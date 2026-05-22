'use client'

import { useEffect, useState } from 'react'
import { createClient, Session } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const AUCTION_END = new Date('2026-09-13T19:00:00+02:00')

export default function Home() {
  const [session, setSession] = useState<Session | null>(null)
  const [loginEmail, setLoginEmail] = useState('')
  const [highestBid, setHighestBid] = useState(500)
  const [message, setMessage] = useState('')
  const [auctionClosed, setAuctionClosed] = useState(false)

  const [form, setForm] = useState({
  firstName: '',
  lastName: '',
  street: '',
  city: '',
  phone: '',
  amount: '',
  language: 'lb'
})

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
      .select('amount')
      .order('amount', { ascending: false })
      .limit(1)

    if (data && data.length > 0) {
      setHighestBid(Number(data[0].amount))
    }
  }

  useEffect(() => {
  const code = new URLSearchParams(window.location.search).get('code')

  if (code) {
    supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
      if (!error) {
        setSession(data.session)
        window.history.replaceState({}, document.title, '/')
      }
    })
  } else {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })
  }

    const authListener = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    loadHighestBid()

    const checkAuctionClosed = () => {
      setAuctionClosed(new Date() >= AUCTION_END)
    }

    checkAuctionClosed()
    const closeInterval = setInterval(checkAuctionClosed, 1000)

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
      clearInterval(closeInterval)
    }
  }, [])

  async function submitBid(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')

    if (!session?.user?.email) {
      setMessage('Bitte zuerst per E-Mail bestätigen.')
      return
    }

    if (new Date() >= AUCTION_END) {
      setMessage('Auktioun beendet / Auction ended')
      return
    }

    const amount = Number(form.amount)

    if (!form.name || !form.address || !form.phone || !amount) {
      setMessage('Bitte alle Pflichtfelder ausfüllen.')
      return
    }

    if (amount < highestBid + 50) {
      setMessage(`Däi Gebot muss mindestens ${highestBid + 50} € sinn.`)
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
      name: form.name,
      address: form.address,
      email: session.user.email,
      phone: form.phone,
      amount,
      language: form.language,
      ip_address: ipAddress,
      user_agent: navigator.userAgent
    }])

    if (error) {
      setMessage('Fehler: ' + error.message)
      return
    }

    setHighestBid(amount)
    setMessage('Merci! Däi Gebot gouf gespäichert.')

    setForm({
      name: '',
      address: '',
      phone: '',
      amount: '',
      language: 'lb'
    })
  }

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

<h1 style={{
  margin:'14px 0 8px',
  fontSize:'clamp(34px, 8vw, 64px)',
  lineHeight:'1.05'
}}>
  Kondschafter Auktioun
</h1>

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
                margin:'0 0 6px',
                fontSize:'14px',
                color:'#315f9c'
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

              <p style={{marginTop:'10px'}}>
                Mindest nächst Gebot:{' '}
                <strong>{(highestBid + 50).toLocaleString('de-LU')} €</strong>
              </p>
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
      Wëllkomm op der offizieller Auktiounssäit vun de Kondschafter
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
                <h2 style={{marginTop:0}}>E-Mail Bestätegung</h2>

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
            ) : (
              <form onSubmit={submitBid} style={formBoxStyle}>
                <h2 style={{marginTop:0}}>Gebot ofginn / Submit Bid</h2>

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
  value={form.firstName}
  onChange={e => setForm({...form, firstName:e.target.value})}
  style={inputStyle}
/>

<input
  placeholder="Numm / Last Name *"
  value={form.lastName}
  onChange={e => setForm({...form, lastName:e.target.value})}
  style={inputStyle}
/>

<input
  placeholder="Strooss + Nummer / Street + Number *"
  value={form.street}
  onChange={e => setForm({...form, street:e.target.value})}
  style={inputStyle}
/>

<input
  placeholder="PLZ + Uertschaft / ZIP Code + City *"
  value={form.city}
  onChange={e => setForm({...form, city:e.target.value})}
  style={inputStyle}
/>

                <input
                  placeholder="Telefon / Phone *"
                  value={form.phone}
                  onChange={e => setForm({...form, phone:e.target.value})}
                  style={inputStyle}
                />

                <input
                  placeholder="Gebot an Euro / Bid amount in Euro *"
                  type="number"
                  value={form.amount}
                  onChange={e => setForm({...form, amount:e.target.value})}
                  style={inputStyle}
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
                  onClick={() => supabase.auth.signOut()}
                  style={{
                    border:'none',
                    background:'transparent',
                    color:'#0f3d91',
                    textDecoration:'underline',
                    cursor:'pointer'
                  }}
                >
                  Ausloggen / Sign out
                </button>

                {message && <p><strong>{message}</strong></p>}
              </form>
            )}
          </div>
        </section>

        <footer style={{
          padding:'26px 32px',
          background:'#0f3d91',
          color:'white',
          fontSize:'14px',
          lineHeight:'1.6'
        }}>
      <p>
  <strong>Kondschafter – association sans but lucratif</strong><br />
  F10056<br />
  1A, Rue Kummert<br />
  6743 Grevenmacher<br />
  Luxembourg
</p>

<p>
  <strong>Kënschtler / Artist:</strong><br />
  André Scholtes<br />
  IT WAS NOT ME S.à r.l.<br />
  B276670<br />
  11, Rue des Tanneurs<br />
  6790 Grevenmacher<br />
  Luxembourg
</p>

          <p style={{textAlign:'center', marginTop:'22px'}}>
            <a href="/privacy" style={footerLink}>Dateschutz / Privacy Policy</a>
            {' · '}
            <a href="/admin" style={footerLink}>Admin Login</a>
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
