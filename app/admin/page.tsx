'use client'

import { useEffect, useState } from 'react'
import { createClient, Session } from '@supabase/supabase-js'
import * as XLSX from 'xlsx'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ADMIN_EMAIL = 'plein.bob@gmail.com'

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [emailInput, setEmailInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [bids, setBids] = useState<any[]>([])
  const [message, setMessage] = useState('')

  const isAdmin = session?.user?.email === ADMIN_EMAIL

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')

    const { error } = await supabase.auth.signInWithOtp({
      email: emailInput,
      options: {
        emailRedirectTo: 'https://kondschafter-auktion.vercel.app/admin'
      }
    })

    if (error) {
      setMessage('Fehler: ' + error.message)
      return
    }

    setMessage('Magic Link geschéckt. Kuck w.e.g. deng E-Mail.')
  }

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
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const authListener = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      authListener.data.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!isAdmin) return

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
  }, [isAdmin])

  async function deleteBid(id:number) {
    const confirmed = confirm('Wëlls du dëst Gebot wierklech läschen?')
    if (!confirmed) return

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

  function exportExcel() {
    const rows = bids.map((bid, index) => ({
      Rang: index + 1,
      Gebot: Number(bid.amount),
      Name: bid.name,
      Adresse: bid.address,
      Email: bid.email,
      Telefon: bid.phone || '',
      IP: bid.ip_address || '',
      Browser: bid.user_agent || '',
      Datum: bid.created_at
        ? new Date(bid.created_at).toLocaleString('de-LU')
        : ''
    }))

    const worksheet = XLSX.utils.json_to_sheet(rows)

    worksheet['!cols'] = [
      { wch: 8 },
      { wch: 12 },
      { wch: 25 },
      { wch: 35 },
      { wch: 30 },
      { wch: 18 },
      { wch: 18 },
      { wch: 60 },
      { wch: 22 }
    ]

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Gebote')
    XLSX.writeFile(workbook, 'kondschafter-gebote.xlsx')
  }

  if (loading) {
    return (
      <main style={pageCenterStyle}>
        <div style={loginBoxStyle}>
          <h1 style={titleStyle}>Adminbereich</h1>
          <p>Lueden...</p>
        </div>
      </main>
    )
  }

  if (!session) {
    return (
      <main style={pageCenterStyle}>
        <form onSubmit={sendMagicLink} style={loginBoxStyle}>
          <h1 style={titleStyle}>Admin Login</h1>

          <p>
            Login per Magic Link. Nëmmen autoriséiert Admin-E-Mailen
            kréien Zougang.
          </p>

          <input
            type="email"
            placeholder="Admin E-Mail"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            style={inputStyle}
            required
          />

          <button type="submit" style={buttonStyle}>
            Magic Link schécken
          </button>

          {message && <p><strong>{message}</strong></p>}
        </form>
      </main>
    )
  }

  if (!isAdmin) {
    return (
      <main style={pageCenterStyle}>
        <div style={loginBoxStyle}>
          <h1 style={titleStyle}>Kee Zougang</h1>

          <p>
            Deng E-Mail ass ageloggt, mee net als Admin autoriséiert:
          </p>

          <p><strong>{session.user.email}</strong></p>

          <button
            onClick={() => supabase.auth.signOut()}
            style={buttonStyle}
          >
            Ausloggen
          </button>
        </div>
      </main>
    )
  }

  return (
    <main style={{
      minHeight:'100vh',
      padding:'30px',
      background:'#eef6ff',
      fontFamily:'Arial'
    }}>

      <div style={{
        maxWidth:'1400px',
        margin:'0 auto'
      }}>

        <div style={{
          display:'flex',
          justifyContent:'space-between',
          alignItems:'center',
          marginBottom:'24px',
          gap:'12px',
          flexWrap:'wrap'
        }}>

          <div>
            <h1 style={{
              margin:0,
              color:'#0f3d91'
            }}>
              Kondschafter Adminbereich
            </h1>

            <p>
              Ageloggt als: <strong>{session.user.email}</strong>
            </p>
          </div>

          <div style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
            <button onClick={exportExcel} style={buttonStyle}>
              Excel Export
            </button>

            <button
              onClick={() => supabase.auth.signOut()}
              style={{
                ...buttonStyle,
                background:'#777'
              }}
            >
              Ausloggen
            </button>
          </div>

        </div>

        {message && <p><strong>{message}</strong></p>}

        <div style={{
          background:'white',
          borderRadius:'22px',
          overflow:'auto',
          boxShadow:'0 10px 30px rgba(0,0,0,0.08)'
        }}>

          <table style={{
            width:'100%',
            borderCollapse:'collapse',
            minWidth:'1200px'
          }}>

            <thead style={{
              background:'#0f3d91',
              color:'white'
            }}>
              <tr>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Gebot</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Adress</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Telefon</th>
                <th style={thStyle}>IP</th>
                <th style={thStyle}>Browser</th>
                <th style={thStyle}>Datum</th>
                <th style={thStyle}>Aktion</th>
              </tr>
            </thead>

            <tbody>
              {bids.map((bid, index) => (
                <tr
                  key={bid.id}
                  style={{
                    background:index % 2 === 0 ? 'white' : '#f7fbff'
                  }}
                >
                  <td style={tdStyle}>{index + 1}</td>

                  <td style={{
                    ...tdStyle,
                    fontWeight:'bold',
                    color:'#0f3d91'
                  }}>
                    {Number(bid.amount).toLocaleString('de-LU')} €
                  </td>

                  <td style={tdStyle}>{bid.name}</td>
                  <td style={tdStyle}>{bid.address}</td>
                  <td style={tdStyle}>{bid.email}</td>
                  <td style={tdStyle}>{bid.phone}</td>
                  <td style={tdStyle}>{bid.ip_address}</td>

                  <td style={{
                    ...tdStyle,
                    maxWidth:'220px',
                    overflow:'hidden',
                    textOverflow:'ellipsis',
                    whiteSpace:'nowrap'
                  }}>
                    {bid.user_agent}
                  </td>

                  <td style={tdStyle}>
                    {bid.created_at
                      ? new Date(bid.created_at).toLocaleString('de-LU')
                      : ''}
                  </td>

                  <td style={tdStyle}>
                    <button
                      onClick={() => deleteBid(bid.id)}
                      style={{
                        padding:'8px 12px',
                        border:'none',
                        borderRadius:'10px',
                        background:'#d62828',
                        color:'white',
                        cursor:'pointer'
                      }}
                    >
                      Läschen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </div>
    </main>
  )
}

const pageCenterStyle = {
  minHeight:'100vh',
  display:'flex',
  justifyContent:'center',
  alignItems:'center',
  background:'#eef6ff',
  fontFamily:'Arial',
  padding:'24px'
}

const loginBoxStyle = {
  background:'white',
  padding:'40px',
  borderRadius:'24px',
  width:'100%',
  maxWidth:'460px',
  boxShadow:'0 10px 30px rgba(0,0,0,0.12)'
}

const titleStyle = {
  marginTop:0,
  color:'#0f3d91',
  textAlign:'center' as const
}

const inputStyle = {
  width:'100%',
  padding:'14px',
  borderRadius:'12px',
  border:'1px solid #b7d8ff',
  marginBottom:'16px',
  fontSize:'16px',
  boxSizing:'border-box' as const
}

const buttonStyle = {
  padding:'12px 18px',
  background:'#0f3d91',
  color:'white',
  border:'none',
  borderRadius:'12px',
  fontWeight:'bold',
  cursor:'pointer'
}

const thStyle = {
  padding:'16px',
  textAlign:'left' as const,
  fontSize:'14px'
}

const tdStyle = {
  padding:'14px 16px',
  borderBottom:'1px solid #e7eef7',
  fontSize:'14px'
}
