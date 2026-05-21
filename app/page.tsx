'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [highestBid, setHighestBid] = useState(1500)
  const [message, setMessage] = useState('')
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
  }, [])

  async function submitBid(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')

    const amount = Number(form.amount)

    if (!form.name || !form.address || !form.email || !amount) {
      setMessage('Please complete all required fields.')
      return
    }

    if (amount < highestBid + 50) {
      setMessage(`Däi Gebot muss mindestens ${highestBid + 50} € sinn.`)
      return
    }

    const { error } = await supabase.from('bids').insert([form])

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
          overflowWrap:'anywhere'
        }}>
          Kondschafter Auktioun<br />
          76. Gréiwemaacher Drauwen- A Wäifest
        </h1>

        <h2>Kënschtler / Artist: André Scholtes</h2>

        <p>
          <strong>Auktioun Enn:</strong> 13 September 2026 - 19:00 / Auction ends: 8:00 PM
        </p>

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
            Mindest nächst Gebot / Minimum next bid: <strong>{(highestBid + 50).toLocaleString('de-LU')} €</strong>
          </p>
        </section>

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

          <button style={{
            padding:'14px',
            background:'#111',
            color:'white',
            border:'none',
            borderRadius:'10px',
            fontSize:'16px',
            fontWeight:'bold'
          }}>
            Gebot späicheren / Submit Bid
          </button>

          {message && <p><strong>{message}</strong></p>}
        </form>

        <section style={{marginTop:'40px'}}>
          <h2>Lëtzebuergesch</h2>
          <p>Wëllkomm op der offizieller Auktiounssäit vun de Kondschafter.</p>
        </section>

        <section style={{marginTop:'30px'}}>
          <h2>English</h2>
          <p>Welcome to the official auction page of the "Kondschafter".</p>
        </section>

      </div>
    </main>
  )
}
