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
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bids'
        },
        (payload) => {
          const newAmount = Number(payload.new.amount)

          setHighestBid((currentHighest) => {
            if (newAmount > currentHighest) {
              return newAmount
            }

            return currentHighest
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
      amount: amount,
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
      maxWidth:'1000px',
      margin:'0 auto',
      padding:'40px',
      fontFamily:'Arial',
      backgroundImage:'url(https://raw.githubusercontent.com/pleinbob-arch/kondschafter-auktion/main/background.jpeg)',
      backgroundSize:'cover',
      backgroundPosition:'center',
      backgroundRepeat:'no-repeat',
      minHeight:'100vh'
    }}>

      <div style={{
        background:'rgba(255,255,255,0.88)',
        padding:'30px',
        borderRadius:'20px',
        maxWidth:'100%',
        boxSizing:'border-box',
        overflow:'hidden'
      }}>

        <h1 style={{
          fontSize:'clamp(30px, 7vw, 48px)',
          lineHeight:'1.15',
          wordBreak:'break-word',
          overflowWrap:'anywhere',
          textAlign:'center'
        }}>
          Kondschafter Auktioun<br />
          76. Gréiwemaacher Drauwen- A Wäifest
        </h1>

        <h2 style={{textAlign:'center'}}>
          Kënschtler: André Scholtes
        </h2>

        <p style={{textAlign:'center'}}>
          <strong>Auktioun Enn:</strong> 13 September 2026 - 19:00
        </p>

        <section style={{
          marginTop:'20px',
          padding:'20px',
          border:'1px solid #ccc',
          borderRadius:'12px',
          background:'rgba(255,255,255,0.75)',
          textAlign:'center'
        }}>

          <h2>Countdown</h2>

          <Countdown />

        </section>

        <img
          src="https://raw.githubusercontent.com/pleinbob-arch/kondschafter-auktion/main/kondschafter.jpg"
          alt="Kondschafter"
          style={{
            width:'100%',
            maxWidth:'700px',
            borderRadius:'14px',
            margin:'20px auto 0 auto',
            display:'block'
          }}
        />

        <section style={{
          marginTop:'40px',
          padding:'20px',
          border:'1px solid #ccc',
          borderRadius:'12px'
        }}>
          <h2>Aktuellt Héichstgebot / Current Highest Bid</h2>

          <p style={{
            fontSize:'36px',
            fontWeight:'bold'
          }}>
            {highestBid.toLocaleString('de-LU')} €
          </p>

          <p>
            Mindest nächst Gebot / Minimum next bid:{' '}
            <strong>{(highestBid + 50).toLocaleString('de-LU')} €</strong>
          </p>
        </section>

        {auctionClosed && (
          <p style={{
            marginTop:'30px',
            padding:'15px',
            background:'#fee',
            border:'1px solid #d33',
            borderRadius:'10px',
            fontWeight:'bold'
          }}>
            Auktioun beendet / Auction ended
          </p>
        )}

        <form onSubmit={submitBid} style={{
          marginTop:'40px',
          display:'grid',
          gap:'12px'
        }}>

          <h2>Gebot ofginn / Submit Bid</h2>

          <input
            placeholder="Numm / Name *"
            value={form.name}
            onChange={e => setForm({...form, name:e.target.value})}
            style={{padding:'12px', fontSize:'16px'}}
          />

          <input
            placeholder="Adress / Address *"
            value={form.address}
            onChange={e => setForm({...form, address:e.target.value})}
            style={{padding:'12px', fontSize:'16px'}}
          />

          <input
            placeholder="E-Mail *"
            type="email"
            value={form.email}
            onChange={e => setForm({...form, email:e.target.value})}
            style={{padding:'12px', fontSize:'16px'}}
          />

          <input
            placeholder="Telefon / Phone"
            value={form.phone}
            onChange={e => setForm({...form, phone:e.target.value})}
            style={{padding:'12px', fontSize:'16px'}}
          />

          <input
            placeholder="Gebot an Euro / Bid amount in Euro *"
            type="number"
            value={form.amount}
            onChange={e => setForm({...form, amount:e.target.value})}
            style={{padding:'12px', fontSize:'16px'}}
          />

          <button
            disabled={auctionClosed}
            style={{
              padding:'14px',
              background: auctionClosed ? '#777' : '#111',
              color:'white',
              border:'none',
              borderRadius:'10px',
              fontSize:'16px',
              fontWeight:'bold',
              cursor: auctionClosed ? 'not-allowed' : 'pointer'
            }}
          >
            {auctionClosed
              ? 'Auktioun beendet / Auction ended'
              : 'Gebot späicheren / Submit Bid'}
          </button>

          {message && <p><strong>{message}</strong></p>}

        </form>

        <section style={{marginTop:'40px'}}>
          <h2>Lëtzebuergesch</h2>

          <p>
            Wëllkomm op der offizieller Auktiounssäit vun de Kondschafter.
          </p>
        </section>

        <section style={{marginTop:'30px'}}>
          <h2>English</h2>

          <p>
            Welcome to the official auction page of the "Kondschafter".
          </p>
        </section>

        <section style={{
          marginTop:'50px',
          paddingTop:'25px',
          borderTop:'1px solid #999',
          fontSize:'14px',
          lineHeight:'1.6'
        }}>

          <h3>Organisatioun / Organization</h3>

          <p>
            Dës Auktioun gëtt organiséiert vun der:
          </p>

          <p>
            This auction is organized by:
          </p>

          <p>
            <strong>Kondschafter – association sans but lucratif</strong><br />
            F10056
          </p>

          <p>
            <strong>Adress / Address:</strong><br />
            1A, Rue Kummert<br />
            6743 Grevenmacher<br />
            Luxembourg
          </p>

          <p>
            <strong>Kënschtler / Artist:</strong><br />
            André Scholtes
          </p>

          <p>
            <strong>Websäit / Website:</strong><br />
            https://kondschafter-auktion.vercel.app
          </p>

          <p style={{
  marginTop:'30px',
  fontSize:'12px',
  opacity:'0.6',
  textAlign:'center'
}}>
  <a
    href="/admin"
    style={{
      color:'#444',
      textDecoration:'none'
    }}
  >
    Admin Login
  </a>
</p>

<p style={{
  marginTop:'10px',
  fontSize:'12px',
  opacity:'0.6',
  textAlign:'center'
}}>
  <a
    href="/privacy"
    style={{
      color:'#444',
      textDecoration:'none'
    }}
  >
    Dateschutz / Privacy Policy
  </a>
</p>
              style={{
                color:'#444',
                textDecoration:'none'
              }}
            >
              Admin Login
            </a>
          </p>

        </section>

      </div>

    </main>
  )
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

      setTimeLeft(
        `${days} Deeg / Days, ${hours}h ${minutes}m ${seconds}s`
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <p style={{
      fontSize:'18px',
      fontWeight:'bold',
      marginTop:'10px',
      textAlign:'center'
    }}>
      {timeLeft}
    </p>
  )
}
