'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import * as XLSX from 'xlsx'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [bids, setBids] = useState<any[]>([])

  async function loadBids() {
    const { data } = await supabase
      .from('bids')
      .select('*')
      .order('amount', { ascending: false })

    if (data) {
      setBids(data)
    }
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

  function login() {
    if (password === 'Kondschafter2026') {
      setUnlocked(true)
    } else {
      alert('Falscht Passwuert')
    }
  }

  async function deleteBid(id:number) {
    const confirmed = confirm(
      'Wëlls du dëst Gebot wierklech läschen?'
    )

    if (!confirmed) return

    await supabase
      .from('bids')
      .delete()
      .eq('id', id)

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
      Sprache: bid.language || '',
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
      { wch: 12 },
      { wch: 18 },
      { wch: 60 },
      { wch: 22 }
    ]

    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Gebote'
    )

    XLSX.writeFile(
      workbook,
      'kondschafter-gebote.xlsx'
    )
  }

  if (!unlocked) {
    return (
      <main style={{
        minHeight:'100vh',
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        background:'#eef6ff',
        fontFamily:'Arial'
      }}>

        <div style={{
          background:'white',
          padding:'40px',
          borderRadius:'24px',
          width:'100%',
          maxWidth:'420px',
          boxShadow:'0 10px 30px rgba(0,0,0,0.12)'
        }}>

          <h1 style={{
            marginTop:0,
            color:'#0f3d91',
            textAlign:'center'
          }}>
            Admin Login
          </h1>

          <input
            type="password"
            placeholder="Passwuert"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width:'100%',
              padding:'14px',
              borderRadius:'12px',
              border:'1px solid #b7d8ff',
              marginBottom:'16px',
              fontSize:'16px',
              boxSizing:'border-box'
            }}
          />

          <button
            onClick={login}
            style={{
              width:'100%',
              padding:'14px',
              background:'#0f3d91',
              color:'white',
              border:'none',
              borderRadius:'12px',
              fontWeight:'bold',
              fontSize:'16px',
              cursor:'pointer'
            }}
          >
            Login
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

          <h1 style={{
            margin:0,
            color:'#0f3d91'
          }}>
            Kondschafter Adminbereich
          </h1>

          <button
            onClick={exportExcel}
            style={{
              padding:'12px 18px',
              background:'#111',
              color:'white',
              border:'none',
              borderRadius:'12px',
              fontWeight:'bold',
              cursor:'pointer'
            }}
          >
            Excel Export
          </button>

        </div>

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
                <th style={thStyle}>Sprooch</th>
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
                    background:index % 2 === 0
                      ? 'white'
                      : '#f7fbff'
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
                  <td style={tdStyle}>{bid.language}</td>
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
                      ? new Date(bid.created_at)
                          .toLocaleString('de-LU')
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
