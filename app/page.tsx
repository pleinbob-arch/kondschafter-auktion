'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const AUCTION_END = new Date('2026-09-13T19:00:00')

export default function Home() {
  const [highestBid, setHighestBid] = useState(1500)
  const [message, setMessage] = useState('')
  const [auctionClosed, setAuctionClosed] = useState(false)

  const [form, setForm] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
    amount: '',
    language: 'lb'
  })

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
        { event: 'INSERT', schema: 'public', table: 'bids' },
        (payload) => {
          const newAmount = Number(payload.new.amount)

          setHighestBid((currentHighest) => {
            return newAmount > currentHighest ? newAmount : currentHighest
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      clearInterval(closeInterval)
    }
  }, [])

  async function submitBid(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')

    if (new Date() >= AUCTION_END) {
      setMessage('Auktioun beendet / Auction ended')
      return
    }

    const amount = Number(form.amount)

    if (!form.name || !form.address || !form.email || !amount) {
      setMessage('Bitte alle Pflichtfelder ausfüllen.')
      return
    }

    if (amount < highestBid + 50) {
      setMessage(`Däi Gebot muss mindestens ${highestBid + 50} € sinn.`)
      return
    }

    const { error } = await supabase.from('bids').insert([{
      name: form.name,
      address: form.address,
      email: form.email,
      phone: form.phone,
      amount,
      language: form.language
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
      email: '',
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
      backgroundImage:'linear-gradient(rgba(30,20,10,0.45), rgba(30,20,10,0.55)), url(https://raw.githubusercontent.com/pleinbob-arch/kondschafter-auktion/main/background.jpeg)',
      backgroundSize:'cover',
      backgroundPosition:'center',
      backgroundAttachment:'fixed'
    }}>

      <div style={{
        maxWidth:'1100px',
        margin:'0 auto',
        background:'rgba(255,250,242,0.94)',
        borderRadius:'28px',
        overflow:'hidden',
        boxShadow:'0 20px 60px rgba(0,0,0,0.35)'
      }}>

        <section style={{
          padding:'44px 28px',
          textAlign:'center',
          background:'linear-gradient(135deg, #0f3d91, #6bb6ff)',
          color:'white'
        }}>
          <p style={{
            margin:0,
            letterSpacing:'2px',
            textTransform:'uppercase',
            fontSize:'13px'
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

          <h2 style={{
            margin:'0',
            fontWeight:'normal',
            fontSize:'clamp(18px, 4vw, 26px)'
          }}>
            Kënschtler: André Scholtes
          </h2>
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
              marginTop:'16px',
              fontSize:'15px',
              lineHeight:'1.6'
            }}>
              Wëllkomm op der offizieller Auktiounssäit vun de Kondschafter.
              <br />
              Welcome to the official auction page of the "Kondschafter".
            </p>
          </div>

          <div>
            <div style={{
              padding:'24px',
              borderRadius:'22px',
              background:'#fff',
              border:'1px solid #eadfce',
              marginBottom:'20px'
            }}>
              <p style={{
                margin:'0 0 6px',
                fontSize:'14px',
                color:'#705c45'
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
              padding:'20px',
              borderRadius:'22px',
              background:'#eef6ff',
              border:'1px solid #cfe5ff',
              textAlign:'center',
              marginBottom:'20px'
            }}>
              <p style={{margin:'0 0 8px'}}>
                <strong>Auktioun Enn:</strong> 13 September 2026 - 19:00
              </p>
              <Countdown />
            </div>

            {auctionClosed && (
              <p style={{
                padding:'14px',
                borderRadius:'14px',
                background:'#fee',
                border:'1px solid #d33',
                fontWeight:'bold'
              }}>
                Auktioun beendet / Auction ended
              </p>
            )}

            <form onSubmit={submitBid} style={{
              display:'grid',
              gap:'12px',
              padding:'24px',
              borderRadius:'22px',
              background:'#fff',
              border:'1px solid #eadfce'
            }}>
              <h2 style={{marginTop:0}}>
                Gebot ofginn / Submit Bid
              </h2>

              <input placeholder="Numm / Name *" value={form.name}
                onChange={e => setForm({...form, name:e.target.value})}
                style={inputStyle} />

              <input placeholder="Adress / Address *" value={form.address}
                onChange={e => setForm({...form, address:e.target.value})}
                style={inputStyle} />

              <input placeholder="E-Mail *" type="email" value={form.email}
                onChange={e => setForm({...form, email:e.target.value})}
                style={inputStyle} />

              <input placeholder="Telefon / Phone" value={form.phone}
                onChange={e => setForm({...form, phone:e.target.value})}
                style={inputStyle} />

              <input placeholder="Gebot an Euro / Bid amount in Euro *" type="number" value={form.amount}
                onChange={e => setForm({...form, amount:e.target.value})}
                style={inputStyle} />

              <button disabled={auctionClosed} style={{
                padding:'15px',
                background: auctionClosed ? '#777' : '#0f3d91',
                color:'white',
                border:'none',
                borderRadius:'14px',
                fontSize:'16px',
                fontWeight:'bold',
                cursor: auctionClosed ? 'not-allowed' : 'pointer'
              }}>
                {auctionClosed ? 'Auktioun beendet / Auction ended' : 'Gebot späicheren / Submit Bid'}
              </button>

              {message && <p><strong>{message}</strong></p>}
            </form>
          </div>
        </section>

        <footer style={{
          padding:'26px 32px',
          background:'#2d2118',
          color:'#f7efe4',
          fontSize:'14px',
          lineHeight:'1.6'
        }}>
          <p>
            <strong>Kondschafter – association sans but lucratif</strong><br />
            F10056 · 1A, Rue Kummert · 6743 Grevenmacher · Luxembourg
          </p>

          <p>
            <strong>Kënschtler / Artist:</strong> André Scholtes
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

const inputStyle = {
  padding:'13px',
  fontSize:'16px',
  border:'1px solid #b7d8ff',
  borderRadius:'12px',
  boxSizing:'border-box' as const,
  width:'100%'
}

const footerLink = {
  color:'#f7efe4',
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
      color:'#4b1f1f'
    }}>
      {timeLeft}
    </p>
  )
}
