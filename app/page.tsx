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

const AUCTION_END = new Date('2026-09-13T19:26:00+02:00')
const START_BID = 2500
const MIN_INCREASE = 50
const MAX_INCREASE = 500

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
  const [highestBid, setHighestBid] = useState<number | null>(null)
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

  const minBid =
    highestBid === null
      ? START_BID
      : highestBid + MIN_INCREASE

  const maxBid =
    highestBid === null
      ? START_BID + MAX_INCREASE
      : highestBid + MAX_INCREASE

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

    setMessage(
      'Bestätegungslink gouf geschéckt. Kuck w.e.g. deng E-Mail.'
    )
  }

 async function loadHighestBid() {
  const { data, error } = await supabase
    .rpc('get_public_bids')

  if (error) {
    console.error('Public bids konnten nicht geladen werden:', error)
    return
  }

  const topBids = data?.slice(0, 2) || []

  if (topBids.length > 0) {
    setHighestBid(Number(topBids[0].amount))
    setLastBid(topBids[1] || null)
  } else {
    setHighestBid(null)
    setLastBid(null)
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

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession()

  const currentSession = sessionData.session

  if (sessionError || !currentSession?.user?.id || !currentSession.user.email) {
    setMessage(
      'Deng Sessioun ass net méi aktiv. Logg dech w.e.g. nach eng Kéier an. / Your session is no longer active. Please sign in again.'
    )
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
      user_id: currentSession.user.id,
      email: currentSession.user.email,
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
    console.error('Bidder profile insert failed:', error)

    setMessage(
      'Fehler beim Speichern der Bieterdaten: ' + error.message
    )
    return
  }

  setBidderProfile(data)

  setMessage(
    'Merci! Deng Donnéeë goufe gespäichert. Du kanns elo bidden.'
  )
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

    if (amount < minBid || amount > maxBid) {
      setMessage(
        `Däi Gebot muss tëscht ${minBid.toLocaleString('de-LU')} € an ${maxBid.toLocaleString('de-LU')} € leien.|` +
        `Your bid must be between ${minBid.toLocaleString('de-LU')} € and ${maxBid.toLocaleString('de-LU')} €.`
      )
      return
    }

    let ipAddress = ''

    try {
      const ipData = await fetch(
        'https://api.ipify.org?format=json'
      )

      const ipJson = await ipData.json()
      ipAddress = ipJson.ip || ''
    } catch {
      ipAddress = 'unknown'
    }

    const { error } = await supabase.rpc('place_bid', {
      p_amount: amount,
      p_ip_address: ipAddress || 'unknown',
      p_user_agent: navigator.userAgent
    })

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

      if (
        window.location.hash ||
        window.location.search
      ) {
        window.history.replaceState(
          {},
          '',
          window.location.pathname
        )
      }
    })

    const authListener =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session)

          if (session?.user?.id) {
            loadBidderProfile(session.user.id)
          } else {
            setBidderProfile(null)
            setProfileLoading(false)
          }
        }
      )

    loadHighestBid()

    const checkAuctionClosed = () => {
      setAuctionClosed(
        new Date() >= AUCTION_END
      )
    }

    checkAuctionClosed()

    const closeInterval =
      setInterval(
        checkAuctionClosed,
        1000
      )

    const viewerChannel =
      supabase.channel(
        'auction-viewers',
        {
          config: {
            presence: {
              key: crypto.randomUUID()
            }
          }
        }
      )

    viewerChannel
      .on(
        'presence',
        { event:'sync' },
        () => {
          const state =
            viewerChannel.presenceState()

          const count =
            Object.values(state)
              .flat()
              .length

          setViewerCount(count || 1)
        }
      )
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await viewerChannel.track({
            online_at:
              new Date().toISOString()
          })
        }
      })

    const bidRefreshInterval = setInterval(() => {
      loadHighestBid()
    }, 2000)

    return () => {
      authListener.data.subscription.unsubscribe()
      supabase.removeChannel(viewerChannel)
      clearInterval(bidRefreshInterval)
      clearInterval(closeInterval)
    }
  }, [])

  useEffect(() => {
    const handleVisibility = () => {
      if (
        document.visibilityState === 'visible'
      ) {
        loadHighestBid()
      }
    }

    document.addEventListener(
      'visibilitychange',
      handleVisibility
    )

    return () => {
      document.removeEventListener(
        'visibilitychange',
        handleVisibility
      )
    }
  }, [])

  return (
    <main style={{
      minHeight:'100vh',
      padding:'24px',
      fontFamily:'Arial, sans-serif',
      backgroundImage:
        'linear-gradient(rgba(15,61,145,0.25), rgba(15,61,145,0.35)), url(https://raw.githubusercontent.com/pleinbob-arch/kondschafter-auktion/main/background.jpeg)',
      backgroundSize:'cover',
      backgroundPosition:'center',
      backgroundAttachment:'fixed'
    }}>

      <style jsx global>{`
        .auction-button {
          transition:
            transform 0.08s ease,
            box-shadow 0.08s ease,
            filter 0.15s ease;
          box-shadow:0 4px 0 #082b69;
          cursor:pointer;
        }

        .auction-button:hover {
          filter:brightness(1.06);
        }

        .auction-button:active {
          transform:translateY(3px);
          box-shadow:0 1px 0 #082b69;
        }

        .auction-button:disabled {
          transform:none;
          box-shadow:none;
          cursor:not-allowed;
        }
      `}</style>

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
          background:
            'linear-gradient(135deg, #0f3d91, #6bb6ff)',
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
          gridTemplateColumns:
            'repeat(auto-fit, minmax(280px, 1fr))',
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
                boxShadow:
                  '0 12px 30px rgba(0,0,0,0.25)'
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

              Konschtwierk: 160 cm x 120 cm
              <br />
              © Kënschtler: André Scholtes

              <a
                href="https://www.instagram.com/itwasnotme_scholtes/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  marginLeft:'10px',
                  textDecoration:'none',
                  fontStyle:'normal'
                }}
              >
                📸
              </a>

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
                {highestBid === null
                  ? 'Startgebot / Starting Bid'
                  : 'Aktuellt Héichstgebot / Current Highest Bid'}
              </p>

              <p style={{
                margin:0,
                fontSize:
                  'clamp(42px, 9vw, 62px)',
                fontWeight:'bold',
                color:'#0f3d91'
              }}>
                {highestBid !== null
                  ? `${highestBid.toLocaleString('de-LU')} €`
                  : `${START_BID.toLocaleString('de-LU')} €`}
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
                  <strong style={{
                    color:'#0f3d91'
                  }}>
                    {minBid.toLocaleString('de-LU')} €
                  </strong>
                </div>

                <div style={{
                  marginTop:'6px'
                }}>
                  Max. Gebot / Maximum Bid:{' '}
                  <strong style={{
                    color:'#0f3d91'
                  }}>
                    {maxBid.toLocaleString('de-LU')} €
                  </strong>
                </div>

                <div style={{
                  marginTop:'10px',
                  padding:'9px 12px',
                  background:'#eef6ff',
                  borderRadius:'10px',
                  fontSize:'13px',
                  color:'#315f9c'
                }}>
                  {highestBid === null ? (
                    <>
                      Startgebot / Starting Bid:{' '}
                      <strong>2.500 €</strong>
                    </>
                  ) : (
                    <>
                      Erhéijung pro Gebot / Bid increase:{' '}
                      <strong>
                        min. 50 € · max. 500 €
                      </strong>
                    </>
                  )}
                </div>

                {lastBid && (
                  <div style={{
                    marginTop:'6px'
                  }}>
                    Viregt Gebot / Previous Bid:{' '}
                    <strong style={{
                      color:'#0f3d91'
                    }}>
                      {Number(lastBid.amount)
                        .toLocaleString('de-LU')} €
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

              <p style={{
                margin:'0 0 8px'
              }}>
                <strong>
                  Auktioun Enn:
                </strong>{' '}
                13 September 2026 - 19:26
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

              <form
                onSubmit={sendMagicLink}
                style={formBoxStyle}
              >

                <h2 style={{marginTop:0}}>
                  1. E-Mail Bestätegung
                </h2>

                <p>
                  Fir ze bidden, muss deng E-Mail
                  fir d'éischt confirméiert ginn.
                  <br />
                  To place a bid, please confirm
                  your email first.
                </p>

                <input
                  placeholder="E-Mail *"
                  type="email"
                  value={loginEmail}
                  onChange={e =>
                    setLoginEmail(e.target.value)
                  }
                  style={inputStyle}
                  required
                />

                <button
                  className="auction-button"
                  style={buttonStyle}
                >
                  Bestätegungslink schécken /
                  Send confirmation link
                </button>

                <p style={{
                  fontSize:'13px',
                  color:'#666',
                  marginTop:'10px',
                  lineHeight:'1.5'
                }}>
                  Falls keng E-Mail ukënnt,
                  kontrolléier w.e.g. och däi
                  Spam-Ordner.
                  <br />
                  If you do not receive an email,
                  please also check your spam folder.
                </p>

                {message && (
                  <p>
                    <strong>{message}</strong>
                  </p>
                )}

              </form>

            ) : profileLoading ? (

              <div style={formBoxStyle}>
                <h2 style={{marginTop:0}}>
                  Donnéeë ginn gelueden...
                </h2>
                <p>Please wait...</p>
              </div>

            ) : !bidderProfile ? (

              <form
                onSubmit={saveBidderProfile}
                style={formBoxStyle}
              >

                <h2 style={{marginTop:0}}>
                  2. Deng Donnéeën / Your Details
                </h2>

                <p style={{
                  padding:'10px',
                  background:'#eef6ff',
                  borderRadius:'10px',
                  fontSize:'14px'
                }}>
                  Confirméiert E-Mail /
                  Confirmed email:
                  <br />
                  <strong>
                    {session.user.email}
                  </strong>
                </p>

                <input
                  placeholder="Virnumm / First Name *"
                  value={profileForm.firstName}
                  onChange={e =>
                    setProfileForm({
                      ...profileForm,
                      firstName:e.target.value
                    })
                  }
                  style={inputStyle}
                  required
                />

                <input
                  placeholder="Numm / Last Name *"
                  value={profileForm.lastName}
                  onChange={e =>
                    setProfileForm({
                      ...profileForm,
                      lastName:e.target.value
                    })
                  }
                  style={inputStyle}
                  required
                />

                <input
                  placeholder="Strooss + Nummer / Street + Number *"
                  value={profileForm.street}
                  onChange={e =>
                    setProfileForm({
                      ...profileForm,
                      street:e.target.value
                    })
                  }
                  style={inputStyle}
                  required
                />

                <input
                  placeholder="PLZ + Uertschaft / ZIP Code + City *"
                  value={profileForm.city}
                  onChange={e =>
                    setProfileForm({
                      ...profileForm,
                      city:e.target.value
                    })
                  }
                  style={inputStyle}
                  required
                />

                <input
                  placeholder="Telefon / Phone *"
                  value={profileForm.phone}
                  onChange={e =>
                    setProfileForm({
                      ...profileForm,
                      phone:e.target.value
                    })
                  }
                  style={inputStyle}
                  required
                />

                <button
                  className="auction-button"
                  style={buttonStyle}
                >
                  Donnéeë späicheren /
                  Save details
                </button>

                <button
                  type="button"
                  onClick={signOut}
                  style={logoutStyle}
                >
                  Ausloggen / Sign out
                </button>

                {message && (
                  <div style={{
                    marginTop:'14px',
                    padding:'14px',
                    borderRadius:'14px',
                    background:
                      message.includes('Merci')
                        ? '#e8fff0'
                        : '#fff0f0',
                    border:
                      message.includes('Merci')
                        ? '1px solid #4caf50'
                        : '1px solid #d9534f',
                    color:
                      message.includes('Merci')
                        ? '#1b5e20'
                        : '#8b0000',
                    fontWeight:'bold',
                    textAlign:'center',
                    whiteSpace:'pre-line'
                  }}>
                    {message}
                  </div>
                )}

              </form>

            ) : (

              <form
                onSubmit={submitBid}
                style={formBoxStyle}
              >

                <h2 style={{marginTop:0}}>
                  Gebot ofginn / Submit Bid
                </h2>

                <p style={{
                  padding:'10px',
                  background:'#eef6ff',
                  borderRadius:'10px',
                  fontSize:'14px',
                  lineHeight:'1.6'
                }}>
                  Confirméiert E-Mail /
                  Confirmed email:
                  <br />

                  <strong>
                    {bidderProfile.email}
                  </strong>

                  <br />

                  Bidder:
                  <br />

                  <strong>
                    {bidderProfile.first_name}{' '}
                    {bidderProfile.last_name}
                  </strong>
                </p>

                <div style={{
                  padding:'10px',
                  borderRadius:'10px',
                  background:'#fff7d6',
                  color:'#604b00',
                  fontSize:'14px',
                  lineHeight:'1.6'
                }}>
                  Erlaabt Gebot / Allowed bid:
                  <br />
                  <strong>
                    {minBid.toLocaleString('de-LU')} €
                    {' '}–{' '}
                    {maxBid.toLocaleString('de-LU')} €
                  </strong>
                </div>

                <input
                  placeholder="Gebot an Euro / Bid amount in Euro *"
                  type="number"
                  step="1"
                  value={bidAmount}
                  onChange={e =>
                    setBidAmount(e.target.value)
                  }
                  style={inputStyle}
                  required
                />

                <button
                  className="auction-button"
                  disabled={auctionClosed}
                  style={{
                    ...buttonStyle,
                    background:
                      auctionClosed
                        ? '#777'
                        : '#0f3d91',
                    cursor:
                      auctionClosed
                        ? 'not-allowed'
                        : 'pointer'
                  }}
                >
                  {auctionClosed
                    ? 'Auktioun beendet / Auction ended'
                    : 'Gebot ofginn / Submit Bid *'}
                </button>

                <p style={{
                  fontSize:'12px',
                  lineHeight:'1.5',
                  color:'#555'
                }}>
                  * Mat der Ofginn vun engem Gebot
                  akzeptéiert de Participant
                  d'Dateschutzerklärung an
                  d'Auktiounsbedingungen.
                  <br />
                  * By submitting a bid, the
                  participant agrees to the privacy
                  policy and auction terms.
                </p>

                <button
                  type="button"
                  onClick={signOut}
                  style={logoutStyle}
                >
                  Ausloggen / Sign out
                </button>

                {message && (
                  <div style={{
                    marginTop:'14px',
                    padding:'14px',
                    borderRadius:'14px',
                    background:
                      message.includes('Merci')
                        ? '#e8fff0'
                        : '#fff0f0',
                    border:
                      message.includes('Merci')
                        ? '1px solid #4caf50'
                        : '1px solid #d9534f',
                    color:
                      message.includes('Merci')
                        ? '#1b5e20'
                        : '#8b0000',
                    fontWeight:'bold',
                    textAlign:'center'
                  }}>

                    {message.includes('|') ? (
                      <>
                        <div>
                          {message.split('|')[0]}
                        </div>

                        <div style={{
                          marginTop:'6px'
                        }}>
                          {message.split('|')[1]}
                        </div>
                      </>
                    ) : (
                      message
                    )}

                  </div>
                )}

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

            <a
              href="/privacy"
              style={footerLink}
            >
              Dateschutz / Privacy Policy
            </a>

            {' · '}

            <a
              href="/admin"
              style={footerLink}
            >
              Admin Login
            </a>

          </p>

          <p style={{
            textAlign:'center',
            marginTop:'16px',
            fontSize:'12px',
            opacity:0.82
          }}>
            © 2026 Kondschafter -
            association sans but lucratif -
            Grevenmacher -
            All rights reserved.
          </p>

          <div style={{
            textAlign:'right',
            marginTop:'6px'
          }}>
            <a
              href="/stream"
              style={{
                color:
                  'rgba(255,255,255,0.22)',
                textDecoration:'none',
                fontSize:'11px',
                letterSpacing:'0.5px'
              }}
            >
              Stream
            </a>
          </div>

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
  const [timeLeft, setTimeLeft] =
    useState('')

  useEffect(() => {
    const targetDate =
      new Date(
        '2026-09-13T19:26:00+02:00'
      )

    const updateCountdown = () => {
      const now = new Date()

      const difference =
        targetDate.getTime() -
        now.getTime()

      if (difference <= 0) {
        setTimeLeft(
          'Auktioun beendet / Auction ended'
        )
        return
      }

      const days =
        Math.floor(
          difference /
          (1000 * 60 * 60 * 24)
        )

      const hours =
        Math.floor(
          (
            difference /
            (1000 * 60 * 60)
          ) % 24
        )

      const minutes =
        Math.floor(
          (
            difference /
            (1000 * 60)
          ) % 60
        )

      const seconds =
        Math.floor(
          (
            difference /
            1000
          ) % 60
        )

      setTimeLeft(
        `${days} Deeg / Days · ${hours}h ${minutes}m ${seconds}s`
      )
    }

    updateCountdown()

    const interval =
      setInterval(
        updateCountdown,
        1000
      )

    return () =>
      clearInterval(interval)

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
