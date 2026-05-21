'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ADMIN_PASSWORD = 'ausschuss2026'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [bids, setBids] = useState<any[]>([])
  const [message, setMessage] = useState('')

  async function loadBids() {
    const { data, error } = await supabase
      .from('bids')
      .select('*')
      .order('amount', { ascending: false })

    if (error) {
      setMessage('Fehler: ' + error.message)
      return
    }

    setBids(data || [])
  }

  useEffect(() => {
  if (!unlocked) return

  loadBids()

  const channel = supabase
    .channel('admin-bids-realtime')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'bids'
      },
      () => {
        loadBids()
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [unlocked])

  async function deleteBid(id: number) {
    const confirmDelete = confirm('Gebot wirklich löschen?')

    if (!confirmDelete) return

    const { error } = await supabase
      .from('bids')
      .delete()
      .eq('id', id)

    if (error) {
      setMessage('Fehler: ' + error.message)
      return
    }

    loadBids()
  }

  function exportCSV() {
    const header = 'Name,Adresse,Email,Telefon,Gebot,Zeit\n'

    const rows = bids.map(bid =>
      `"${bid.name}","${bid.address}","${bid.email}","${bid.phone || ''}","${bid.amount}","${bid.created_at}"`
    ).join('\n')

    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'gebote-kondschafter.csv'
    link.click()
  }

  const highestBid = bids.length > 0 ? bids[0] : null

  if (!unlocked) {
    return (
      <main style={{
        maxWidth:'600px',
        margin:'80px auto',
        padding:'30px',
        fontFamily:'Arial'
      }}>
        <h1>Adminbereich</h1>
        <p>Kondschafter - association sans but lucratif</p>

        <input
          type="password"
          placeholder="Passwuert / Passwort"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            padding:'12px',
            width:'100%',
            fontSize:'16px',
            marginTop:'20px'
          }}
        />

        <button
          onClick={() => {
            if (password === ADMIN_PASSWORD) {
              setUnlocked(true)
            } else {
              setMessage('Falsches Passwort')
            }
          }}
          style={{
            marginTop:'15px',
            padding:'12px',
            background:'#111',
            color:'white',
            border:'none',
            borderRadius:'8px',
            width:'100%'
          }}
        >
          Login
        </button>

        {message && <p><strong>{message}</strong></p>}
      </main>
    )
  }

  return (
    <main style={{
      maxWidth:'1100px',
      margin:'0 auto',
      padding:'40px',
      fontFamily:'Arial'
    }}>
      <h1>Adminbereich Kondschafter Auktioun</h1>

      {highestBid && (
        <section style={{
          padding:'20px',
          border:'1px solid #ccc',
          borderRadius:'12px',
          marginBottom:'30px'
        }}>
          <h2>Aktuell führend</h2>
          <p style={{fontSize:'28px', fontWeight:'bold'}}>
            {highestBid.name} – {Number(highestBid.amount).toLocaleString('de-LU')} €
          </p>
          <p>{highestBid.email} · {highestBid.phone}</p>
        </section>
      )}

      <button
        onClick={exportCSV}
        style={{
          padding:'12px',
          background:'#111',
          color:'white',
          border:'none',
          borderRadius:'8px',
          marginBottom:'20px'
        }}
      >
        CSV / Excel Export
      </button>

      {message && <p><strong>{message}</strong></p>}

      <table style={{
        width:'100%',
        borderCollapse:'collapse',
        fontSize:'14px'
      }}>
        <thead>
          <tr>
            <th style={{borderBottom:'1px solid #ccc', padding:'8px'}}>Gebot</th>
            <th style={{borderBottom:'1px solid #ccc', padding:'8px'}}>Name</th>
            <th style={{borderBottom:'1px solid #ccc', padding:'8px'}}>Adresse</th>
            <th style={{borderBottom:'1px solid #ccc', padding:'8px'}}>Kontakt</th>
            <th style={{borderBottom:'1px solid #ccc', padding:'8px'}}>Zeit</th>
            <th style={{borderBottom:'1px solid #ccc', padding:'8px'}}>Aktion</th>
          </tr>
        </thead>

        <tbody>
          {bids.map(bid => (
            <tr key={bid.id}>
              <td style={{padding:'8px', fontWeight:'bold'}}>
                {Number(bid.amount).toLocaleString('de-LU')} €
              </td>
              <td style={{padding:'8px'}}>{bid.name}</td>
              <td style={{padding:'8px'}}>{bid.address}</td>
              <td style={{padding:'8px'}}>
                {bid.email}<br />
                {bid.phone}
              </td>
              <td style={{padding:'8px'}}>
                {new Date(bid.created_at).toLocaleString('de-LU')}
              </td>
              <td style={{padding:'8px'}}>
                <button onClick={() => deleteBid(bid.id)}>
                  Löschen
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
