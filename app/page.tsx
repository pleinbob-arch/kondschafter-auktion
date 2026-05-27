'use client'

import { useEffect, useState } from 'react'
import { createClient, Session } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true
    }
  }
)

const AUCTION_END = new Date('2026-09-13T19:00:00+02:00')

type BidderProfile = {
  id: string
  user_id: string
  email: string
  first_name: string
  last_name: string
  street: string
  city: string
  phone: string
  language: string
}

export default function Home() {
  const [session, setSession] = useState<Session | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [bidderProfile, setBidderProfile] = useState<BidderProfile | null>(null)

  const [loginEmail, setLoginEmail] = useState('')
  const [highestBid, setHighestBid] = useState(50)
  const [lastBid, setLastBid] = useState<any>(null)
  const [message, setMessage] = useState('')
  const [auctionClosed, setAuctionClosed] = useState(false)
  const [viewerCount, setViewerCount] = useState(1)

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    phone: '',
    language: 'lb'
  })

  const [bidAmount, setBidAmount] = useState('')

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')

    const { error } = await supabase.auth.signInWithOtp({
      email: loginEmail,
      options: {
        emailRedirectTo: 'https://kondschafter-auktion.vercel.app'
      }
    })

    if (error) {
      setMessage('Fehler: ' + error.message)
      return
    }

    setMessage('Bestätegungslink gouf geschéckt. Kuck w.e.g. deng E-Mail.')
  }

  async function loadHighestBid() {
    const { data } = await supabase
      .from('bids')
      .select('*')
      .order('amount', { ascending: false })
      .limit(2)

    if (data && data.length > 0) {
      setHighestBid(Number(data[0].amount))
      setLastBid(data[1] || null)
    }
  }

  async function loadBidderProfile(userId: string) {
    setProfileLoading(true)

    const { data, error } = await supabase
      .from('bidders')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      setMessage('Fehler beim Laden der Bieterdaten: ' + error.message)
      setBidderProfile(null)
      setProfileLoading(false)
      return
    }

    setBidderProfile(data || null)
    setProfileLoading(false)
  }

  async function saveBidderProfile(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')

    if (!session?.user?.id || !session?.user?.email) {
      setMessage('Bitte zuerst per E-Mail bestätigen.')
      return
    }

    if (
      !profileForm.firstName ||
      !profileForm.lastName ||
      !profileForm.street ||
      !profileForm.city ||
      !profileForm.phone
    ) {
      setMessage('Bitte alle Pflichtfelder ausfüllen.')
      return
    }

    const { data, error } = await supabase
      .from('bidders')
      .insert([{
        user_id: session.user.id,
        email: session.user.email,
        first_name: profileForm.firstName,
        last_name: profileForm.lastName,
        street: profileForm.street,
        city: profileForm.city,
        phone: profileForm.phone,
        language: profileForm.language
      }])
      .select('*')
      .single()

    if (error) {
      setMessage('Fehler: ' + error.message)
      return
    }

    setBidderProfile(data)
    setMessage('Merci! Deng Donnéeë goufe gespäichert. Du kanns elo bidden.')
  }

  async function submitBid(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')

    if (!session?.user?.email) {
      setMessage('Bitte zuerst per E-Mail bestätigen.')
      return
    }

    if (!bidderProfile) {
      setMessage('Bitte zuerst deine Daten ausfüllen.')
      return
    }

    if (new Date() >= AUCTION_END) {
      setMessage('Auktioun beendet / Auction ended')
      return
    }

    const amount = Number(bidAmount)

    if (!amount) {
      setMessage('Bitte ein Gebot eingeben.')
      return
    }

    if (amount < highestBid + 5) {
      setMessage(`Däi Gebot muss mindestens ${highestBid + 5} € sinn.`)
      return
    }

    let ipAddress = ''

    try {
      const ipData = await fetch('https://api.ipify.org?format=json')
      const ipJson = await ipData.json()
      ipAddress = ipJson.ip || ''
    } catch {
      ipAddress = 'unknown'
    }

    const { error } = await supabase.from('bids').insert([{
      name: `${bidderProfile.first_name} ${bidderProfile.last_name}`,
      address: `${bidderProfile.street}, ${bidderProfile.city}`,
      email: bidderProfile.email,
      phone: bidderProfile.phone,
      amount,
      language: bidderProfile.language || 'lb',
      ip_address: ipAddress,
      user_agent: navigator.userAgent
    }])

    if (error) {
      setMessage('Fehler: ' + error.message)
      return
    }

    setHighestBid(amount)
    setBidAmount('')
    setMessage('Merci! Däi Gebot gouf gespäichert.')
  }

  async function signOut() {
    setMessage('')
    setBidderProfile(null)
    setProfileLoading(false)
    await supabase.auth.signOut()
  }

  useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    setSession(data.session)

    if (data.session?.user?.id) {
      loadBidderProfile(data.session.user.id)
    } else {
      setProfileLoading(false)
    }

    if (window.location.hash || window.location.search) {
      window.history.replaceState({}, '', window.location.pathname)
    }
  })

  const authListener = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session)

    if (session?.user?.id) {
      loadBidderProfile(session.user.id)
    } else {
      setBidderProfile(null)
      setProfileLoading(false)
    }
  })

  loadHighestBid()

  const checkAuctionClosed = () => {
    setAuctionClosed(new Date() >= AUCTION_END)
  }

  checkAuctionClosed()
  const closeInterval = setInterval(checkAuctionClosed, 1000)

  const viewerChannel = supabase.channel('auction-viewers', {
    config: {
      presence: {
        key: crypto.randomUUID()
      }
    }
  })

  viewerChannel
    .on('presence', { event: 'sync' }, () => {
      const state = viewerChannel.presenceState()
      const count = Object.values(state).flat().length
      setViewerCount(count || 1)
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await viewerChannel.track({
          online_at: new Date().toISOString()
        })
      }
    })

  const channel = supabase
    .channel('bids-realtime')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'bids' },
      () => {
        loadHighestBid()
      }
    )
    .subscribe()

  return () => {
    authListener.data.subscription.unsubscribe()
    supabase.removeChannel(channel)
    supabase.removeChannel(viewerChannel)
    clearInterval(closeInterval)
  }
}, [])

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadHighestBid()
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  return (
    <main style={{
      minHeight:'100vh',
      padding:'24px',
      fontFamily:'Arial, sans-serif',
      backgroundImage:'linear-gradient(rgba(15,61,145,0.25), rgba(15,61,145,0.35)), url(https://raw.githubusercontent.com/pleinbob-arch/kondschafter-auktion/main/background.jpeg)',
      backgroundSize:'cover',
      backgroundPosition:'center',
      backgroundAttachment:'fixed'
    }}>

      <div style={{
        maxWidth:'1100px',
        margin:'0 auto',
        background:'rgba(255,255,255,0.95)',
        borderRadius:'28px',
        overflow:'hidden',
        boxShadow:'0 20px 60px rgba(0,0,0,0.25)'
      }}>

        <section style={{
          padding:'18px 28px',
          textAlign:'center',
          background:'linear-gradient(135deg, #0f3d91, #6bb6ff)',
          color:'white'
        }}>
          <p style={{
            margin:0,
            letterSpacing:'2px',
            textTransform:'uppercase',
            fontSize:'20px'
          }}>
            76. Gréiwemaacher Drauwen- A Wäifest
          </p>

          <div style={{
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            gap:'14px',
            marginBottom:'10px'
          }}>
            <img
              src="https://raw.githubusercontent.com/pleinbob-arch/kondschafter-auktion/main/logo.png"
              alt="Kondschafter Logo"
              style={{
                width:'42px',
                height:'42px',
                objectFit:'contain'
              }}
            />

            <h1 style={{
              margin:0,
              fontSize:'clamp(34px, 8vw, 64px)',
              lineHeight:'1.05'
            }}>
              Kondschafter Auktioun
            </h1>
          </div>

          <p style={{
            margin:'0 0 14px',
            fontSize:'16px',
            opacity:0.92
          }}>
            Fir de gudden Zweck · Pour la bonne cause · For a good cause
          </p>
        </section>

        <section style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',
          gap:'28px',
          padding:'32px'
        }}>
          <div>
            <img
              src="https://raw.githubusercontent.com/pleinbob-arch/kondschafter-auktion/main/kondschafter.jpg"
              alt="Kondschafter"
              style={{
                width:'100%',
                borderRadius:'22px',
                display:'block',
                boxShadow:'0 12px 30px rgba(0,0,0,0.25)'
              }}
            />
            <p style={{
              marginTop:'10px',
              marginBottom:'20px',
              fontSize:'13px',
              color:'#666',
              textAlign:'center',
              fontStyle:'italic'
            }}>
              © Konschtwierk: André Scholtes
            </p>
          </div>

          <div>
            <div style={cardStyle}>
              <p style={{
                margin:'0 0 10px',
                fontSize:'18px',
                fontWeight:'bold',
                color:'#315f9c',
                letterSpacing:'0.3px'
              }}>
                Aktuellt Héichstgebot / Current Highest Bid
              </p>

              <p style={{
                margin:0,
                fontSize:'clamp(42px, 9vw, 62px)',
                fontWeight:'bold',
                color:'#0f3d91'
              }}>
                {highestBid.toLocaleString('de-LU')} €
              </p>

              <div style={{
                marginTop:'16px',
                paddingTop:'14px',
                borderTop:'1px solid #d9e8ff',
                display:'flex',
                flexDirection:'column',
                gap:'8px',
                fontSize:'14px',
                color:'#555'
              }}>
                <div>
                  Nächst méiglecht Gebot / Next Possible Bid:{' '}
                  <strong style={{color:'#0f3d91'}}>
                    {(highestBid + 5).toLocaleString('de-LU')} €
                  </strong>
                </div>

                {lastBid && (
                  <div>
                    Viregt Gebot / Previous Bid:{' '}
                    <strong style={{color:'#0f3d91'}}>
                      {Number(lastBid.amount).toLocaleString('de-LU')} €
                    </strong>
                  </div>
                )}
              </div>
            </div>

            <div style={{
              ...cardStyle,
              background:'#eef6ff',
              textAlign:'center'
            }}>
              <p style={{margin:'0 0 8px'}}>
                <strong>Auktioun Enn:</strong> 13 September 2026 - 19:00
              </p>
              <Countdown />
            </div>

            <div style={{
              ...cardStyle,
              background:'#f7fbff',
              textAlign:'center'
            }}>
              <p style={{
                margin:'0 0 6px',
                fontSize:'14px',
                color:'#315f9c'
              }}>
                Live Zuschauer / Live Viewers
              </p>

              <p style={{
                margin:0,
                fontSize:'30px',
                fontWeight:'bold',
                color:'#0f3d91'
              }}>
                {viewerCount}
              </p>
            </div>

            <p style={{
              marginTop:'22px',
              fontSize:'16px',
              lineHeight:'1.9',
              maxWidth:'760px',
              marginLeft:'auto',
              marginRight:'auto',
              opacity:0.96,
              textAlign:'center'
            }}>
              <span style={{
                fontWeight:'bold',
                fontSize:'22px',
                display:'block',
                marginBottom:'10px'
              }}>
                Wëllkomm op der offizieller Auktiounssäit vun de Kondschafter ASBL
              </span>

              <span style={{
                fontStyle:'italic',
                display:'block',
                color:'#1d3557'
              }}>
                D’Kondschafter engagéieren sech säit ville Joren fir
                d’Traditiounen an d’Liewe ronderëm d’Gréiwemaacher
                Drauwen- a Wäifest.
                <br />
                Mat dëser Auktioun ënnerstëtze mir e gudden Zweck
                a verbannen Konscht, Traditioun a Solidaritéit.
              </span>
            </p>

            {!session ? (
              <form onSubmit={sendMagicLink} style={formBoxStyle}>
                <h2 style={{marginTop:0}}>1. E-Mail Bestätegung</h2>

                <p>
                  Fir ze bidden, muss deng E-Mail fir d'éischt confirméiert ginn.
                  <br />
                  To place a bid, please confirm your email first.
                </p>

                <input
                  placeholder="E-Mail *"
                  type="email"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  style={inputStyle}
                  required
                />

                <button style={buttonStyle}>
                  Bestätegungslink schécken / Send confirmation link
                </button>

                <p style={{
                  fontSize:'13px',
                  color:'#666',
                  marginTop:'10px',
                  lineHeight:'1.5'
                }}>
                  Falls keng E-Mail ukënnt, kontrolléier w.e.g. och däi Spam-Ordner.
                  <br />
                  If you do not receive an email, please also check your spam folder.
                </p>

                {message && <p><strong>{message}</strong></p>}
              </form>
            ) : profileLoading ? (
              <div style={formBoxStyle}>
                <h2 style={{marginTop:0}}>Donnéeë ginn gelueden...</h2>
                <p>Please wait...</p>
              </div>
            ) : !bidderProfile ? (
              <form onSubmit={saveBidderProfile} style={formBoxStyle}>
                <h2 style={{marginTop:0}}>2. Deng Donnéeën / Your Details</h2>

                <p style={{
                  padding:'10px',
                  background:'#eef6ff',
                  borderRadius:'10px',
                  fontSize:'14px'
                }}>
                  Confirméiert E-Mail / Confirmed email:<br />
                  <strong>{session.user.email}</strong>
                </p>

                <input
                  placeholder="Virnumm / First Name *"
                  value={profileForm.firstName}
                  onChange={e => setProfileForm({...profileForm, firstName:e.target.value})}
                  style={inputStyle}
                  required
                />

                <input
                  placeholder="Numm / Last Name *"
                  value={profileForm.lastName}
                  onChange={e => setProfileForm({...profileForm, lastName:e.target.value})}
                  style={inputStyle}
                  required
                />

                <input
                  placeholder="Strooss + Nummer / Street + Number *"
                  value={profileForm.street}
                  onChange={e => setProfileForm({...profileForm, street:e.target.value})}
                  style={inputStyle}
                  required
                />

                <input
                  placeholder="PLZ + Uertschaft / ZIP Code + City *"
                  value={profileForm.city}
                  onChange={e => setProfileForm({...profileForm, city:e.target.value})}
                  style={inputStyle}
                  required
                />

                <input
                  placeholder="Telefon / Phone *"
                  value={profileForm.phone}
                  onChange={e => setProfileForm({...profileForm, phone:e.target.value})}
                  style={inputStyle}
                  required
                />

                <button style={buttonStyle}>
                  Donnéeë späicheren / Save details
                </button>

                <button
                  type="button"
                  onClick={signOut}
                  style={logoutStyle}
                >
                  Ausloggen / Sign out
                </button>

                {message && <p><strong>{message}</strong></p>}
              </form>
            ) : (
              <form onSubmit={submitBid} style={formBoxStyle}>
                <h2 style={{marginTop:0}}>3. Gebot ofginn / Submit Bid</h2>

                <p style={{
                  padding:'10px',
                  background:'#eef6ff',
                  borderRadius:'10px',
                  fontSize:'14px',
                  lineHeight:'1.6'
                }}>
                  Confirméiert E-Mail / Confirmed email:<br />
                  <strong>{bidderProfile.email}</strong>
                  <br />
                  Bidder:<br />
                  <strong>{bidderProfile.first_name} {bidderProfile.last_name}</strong>
                </p>

                <input
                  placeholder="Gebot an Euro / Bid amount in Euro *"
                  type="number"
                  value={bidAmount}
                  onChange={e => setBidAmount(e.target.value)}
                  style={inputStyle}
                  required
                />

                <button
                  disabled={auctionClosed}
                  style={{
                    ...buttonStyle,
                    background: auctionClosed ? '#777' : '#0f3d91',
                    cursor: auctionClosed ? 'not-allowed' : 'pointer'
                  }}
                >
                  {auctionClosed
                    ? 'Auktioun beendet / Auction ended'
                    : 'Gebot späicheren / Submit Bid *'}
                </button>

                <p style={{
                  fontSize:'12px',
                  lineHeight:'1.5',
                  color:'#555'
                }}>
                  * Mat der Ofginn vun engem Gebot akzeptéiert de Participant
                  d'Dateschutzerklärung an d'Auktiounsbedingungen.
                  <br />
                  * By submitting a bid, the participant agrees to the privacy
                  policy and auction terms.
                </p>

                <p style={{fontSize:'12px'}}>
                  <a href="/privacy" style={{
                    color:'#0f3d91',
                    textDecoration:'underline'
                  }}>
                    Dateschutz / Privacy Policy
                  </a>
                </p>

                <button
                  type="button"
                  onClick={signOut}
                  style={logoutStyle}
                >
                  Ausloggen / Sign out
                </button>

                {message && <p><strong>{message}</strong></p>}
              </form>
            )}
          </div>
        </section>

        <footer style={{
          padding:'22px 32px',
          background:'#0f3d91',
          color:'white',
          fontSize:'14px'
        }}>
          <p style={{
            textAlign:'center',
            margin:0,
            lineHeight:'1.8'
          }}>
            <a href="/privacy" style={footerLink}>
              Dateschutz / Privacy Policy
            </a>

            {' · '}

            <a href="/admin" style={footerLink}>
              Admin Login
            </a>

            {' · '}

            <a href="/stream" style={footerLink}>
              Stream
            </a>
          </p>

          <p style={{
            textAlign:'center',
            marginTop:'16px',
            fontSize:'12px',
            opacity:0.82
          }}>
            © 2026 Kondschafter - association sans but lucratif - Grevenmacher - All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  )
}

const cardStyle = {
  padding:'24px',
  borderRadius:'22px',
  background:'#fff',
  border:'1px solid #cfe5ff',
  marginBottom:'20px'
}

const formBoxStyle = {
  display:'grid',
  gap:'12px',
  padding:'24px',
  borderRadius:'22px',
  background:'#fff',
  border:'1px solid #cfe5ff'
}

const inputStyle = {
  padding:'13px',
  fontSize:'16px',
  border:'1px solid #b7d8ff',
  borderRadius:'12px',
  boxSizing:'border-box' as const,
  width:'100%'
}

const buttonStyle = {
  padding:'15px',
  background:'#0f3d91',
  color:'white',
  border:'none',
  borderRadius:'14px',
  fontSize:'16px',
  fontWeight:'bold'
}

const logoutStyle = {
  border:'none',
  background:'transparent',
  color:'#0f3d91',
  textDecoration:'underline',
  cursor:'pointer'
}

const footerLink = {
  color:'white',
  textDecoration:'underline'
}

function Countdown() {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    const targetDate = new Date('2026-09-13T19:00:00')

    const interval = setInterval(() => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference <= 0) {
        setTimeLeft('Auktioun beendet / Auction ended')
        clearInterval(interval)
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / (1000 * 60)) % 60)
      const seconds = Math.floor((difference / 1000) % 60)

      setTimeLeft(`${days} Deeg / Days · ${hours}h ${minutes}m ${seconds}s`)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <p style={{
      margin:0,
      fontSize:'18px',
      fontWeight:'bold',
      color:'#0f3d91'
    }}>
      {timeLeft}
    </p>
  )
}
