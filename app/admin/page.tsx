'use client'

import { useEffect, useState } from 'react'
import { createClient, Session } from '@supabase/supabase-js'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ADMIN_EMAILS = [
  'plein.bob@gmail.com',
  'kondschafter@gmail.com'
]

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [emailInput, setEmailInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [bids, setBids] = useState<any[]>([])
  const [message, setMessage] = useState('')
  const [viewerCount, setViewerCount] = useState(0)

  const isAdmin = ADMIN_EMAILS.includes(session?.user?.email || '')

  const highestBid = bids[0] || null
  const uniqueBidders = new Set(bids.map(bid => bid.email)).size
  const totalBids = bids.length

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
    const code = new URLSearchParams(window.location.search).get('code')

    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
        if (!error) {
          setSession(data.session)
          window.history.replaceState({}, document.title, '/admin')
        }
        setLoading(false)
      })
    } else {
      supabase.auth.getSession().then(({ data }) => {
        setSession(data.session)
        setLoading(false)
      })
    }

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
        { event: '*', schema: 'public', table: 'bids' },
        () => {
          loadBids()
        }
      )
      .subscribe()

    const viewerChannel = supabase.channel('auction-viewers')

    viewerChannel
      .on('presence', { event: 'sync' }, () => {
        const state = viewerChannel.presenceState()
        const count = Object.values(state).flat().length
        setViewerCount(count)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
      supabase.removeChannel(viewerChannel)
    }
  }, [isAdmin])
function createInvoiceEmail(bid:any, index:number) {
  const invoiceNumber = `KA-2026-${String(index + 1).padStart(3, '0')}`
  const amount = Number(bid.amount).toLocaleString('de-LU')

  const subject = `Rechnung ${invoiceNumber} - Kondschafter Auktioun 2026`

  const body = `
Moien ${bid.name},

Du hues dat héchst Gebot bei der Kondschafter Auktioun 2026 ofginn.

--------------------------------------------------

RECHNUNG / INVOICE
Rechnungsnummer / Invoice Number:
${invoiceNumber}

Datum / Date:
${new Date().toLocaleDateString('de-LU')}

Keefer / Buyer:
${bid.name}
${bid.address}
${bid.email}

--------------------------------------------------

Beschreiwung / Description:
Konschtwierk - Kondschafter Auktioun 2026

Betrag / Amount:
${amount} €

--------------------------------------------------

Bezuelung / Payment

Mir bieden dech de Betrag bannent 7 Deeg op dëse Konto ze iwwerweisen:

Kontoinhaber / Account Holder:
Kondschafter - association sans but lucratif

IBAN:
LU15 0099 7800 0034 9316

BIC:
CCRALULLXXX

Verwendungszweck / Payment Reference:
${invoiceNumber} - ${bid.name}

--------------------------------------------------

Merci villmools fir deng Ënnerstëtzung.

Thank you very much for your support.

Kondschafter ASBL
`.trim()

  window.location.href =
    `mailto:${bid.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
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

  async function createInvoicePDF(bid:any, index:number) {
  const doc = new jsPDF()
  const invoiceNumber = `KA-2026-${String(index + 1).padStart(3, '0')}`
  const amount = Number(bid.amount).toLocaleString('de-LU')
  const today = new Date().toLocaleDateString('de-LU')

  try {
    const logoUrl = 'https://raw.githubusercontent.com/pleinbob-arch/kondschafter-auktion/main/logo.png'
    const response = await fetch(logoUrl)
    const blob = await response.blob()

    const reader = new FileReader()
    reader.onloadend = () => {
      const logoBase64 = reader.result as string

      // Header
      doc.setFillColor(15, 61, 145)
      doc.rect(0, 0, 210, 40, 'F')

      doc.addImage(logoBase64, 'PNG', 16, 8, 24, 24)

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(22)
      doc.text('Kondschafter ASBL', 48, 18)

      doc.setFontSize(12)
      doc.text('Rechnung / Invoice', 48, 29)

      // Verein links
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(11)
      doc.text('Kondschafter – association sans but lucratif', 20, 58)
      doc.text('R.C.S.L. F10056', 20, 65)
      doc.text('1A, Rue Kummert', 20, 72)
      doc.text('6743 Grevenmacher', 20, 79)
      doc.text('Luxembourg', 20, 86)

      // Rechnung rechts – weiter links gesetzt
      doc.setFontSize(11)
      doc.text('Rechnungsnummer / Invoice Number:', 115, 58)
      doc.text(invoiceNumber, 115, 65)
      doc.text('Datum / Date:', 115, 77)
      doc.text(today, 115, 84)

      doc.setDrawColor(15, 61, 145)
      doc.line(20, 98, 190, 98)
      doc.setDrawColor(220, 220, 220)

      // Käufer
      doc.setFontSize(13)
      doc.setTextColor(15, 61, 145)
      doc.text('Keefer / Buyer', 20, 113)

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(11)
      doc.text(bid.name || '', 20, 123)
      doc.text(bid.address || '', 20, 131)
      doc.text(bid.email || '', 20, 139)
      doc.line(20, 146, 190, 146)

      // Beschreibung
      doc.setFontSize(13)
      doc.setTextColor(15, 61, 145)
      doc.text('Beschreiwung / Description', 20, 160)

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(11)
      doc.text('Konschtwierk – Kondschafter Auktioun 2026', 20, 170)
      doc.text('Artwork – Kondschafter Auction 2026', 20, 178)
      doc.line(20, 184, 190, 184)

      // Betrag mittig
      doc.setFillColor(238, 246, 255)
      doc.roundedRect(45, 194, 120, 30, 4, 4, 'F')

      doc.setTextColor(15, 61, 145)
      doc.setFontSize(13)
     doc.text('Total / Amount', 105, 204, { align: 'center' })
      
      doc.setFontSize(24)
      doc.text(`${amount} EUR`, 105, 216, { align: 'center' })

      // Zahlung
      doc.setTextColor(15, 61, 145)
      doc.setFontSize(13)
      doc.text('Bezuelung / Payment', 20, 244)

      doc.setTextColor(0, 0, 0)
      doc.setFontSize(11)
      doc.text('Kontoinhaber / Account Holder: Kondschafter - association sans but lucratif', 20, 254)
      doc.text('IBAN: LU15 0099 7800 0034 9316', 20, 262)
      doc.text('BIC: CCRALULLXXX', 20, 270)
      doc.text(`Verwendungszweck / Payment Reference: ${invoiceNumber}`, 20, 278)

      // Footer
      doc.setFillColor(15, 61, 145)
      doc.rect(0, 283, 210, 14, 'F')

      doc.setTextColor(255, 255, 255)
      doc.setFontSize(7)
      doc.text(
        'Kondschafter - association sans but lucratif · R.C.S.L. F10056 · 1A, Rue Kummert · 6743 Grevenmacher · Luxembourg',
        105,
        291,
        { align: 'center' }
      )

      doc.save(`${invoiceNumber}-${bid.name}.pdf`)
    }

    reader.readAsDataURL(blob)
  } catch {
    alert('PDF konnte nicht erstellt werden.')
  }
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

          <p>Deng E-Mail ass ageloggt, mee net als Admin autoriséiert:</p>
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
      padding:'20px',
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
            <h1 style={{margin:0, color:'#0f3d91'}}>
              Kondschafter Adminbereich
            </h1>

            <p style={{marginBottom:0}}>
              Ageloggt als: <strong>{session.user.email}</strong>
            </p>
          </div>

          <div style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
            <button onClick={exportExcel} style={buttonStyle}>
              Excel Export
            </button>

            <button
              onClick={() => supabase.auth.signOut()}
              style={{...buttonStyle, background:'#777'}}
            >
              Ausloggen
            </button>
          </div>
        </div>

        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',
          gap:'16px',
          marginBottom:'24px'
        }}>
          <DashboardCard
            title="Héichstgebot"
            value={highestBid ? `${Number(highestBid.amount).toLocaleString('de-LU')} €` : '—'}
            detail={highestBid ? highestBid.name : 'Nach kee Gebot'}
          />

          <DashboardCard
            title="Total Geboter"
            value={String(totalBids)}
            detail="All enregistréiert Geboter"
          />

          <DashboardCard
            title="Bieter"
            value={String(uniqueBidders)}
            detail="Unik E-Mail-Adressen"
          />

          <DashboardCard
            title="Live Zuschauer"
            value={String(viewerCount)}
            detail="Aktuell op der Auktiounssäit"
          />
        </div>

        {message && <p><strong>{message}</strong></p>}

        <div style={{
          display:'grid',
          gap:'16px'
        }}>
          {bids.map((bid, index) => (
            <div
              key={bid.id}
              style={{
                background:index === 0 ? '#fff7d6' : 'white',
                border:index === 0 ? '2px solid #e6b800' : '1px solid #cfe5ff',
                borderRadius:'18px',
                padding:'18px',
                boxShadow:'0 6px 18px rgba(0,0,0,0.06)'
              }}
            >
              <div style={{
                display:'flex',
                justifyContent:'space-between',
                gap:'12px',
                flexWrap:'wrap',
                marginBottom:'12px'
              }}>
                <div>
                  <p style={{
                    margin:'0 0 4px',
                    color:'#0f3d91',
                    fontWeight:'bold'
                  }}>
                    #{index + 1} {index === 0 ? '· Aktuell führend' : ''}
                  </p>

                  <h2 style={{
                    margin:'0',
                    fontSize:'28px',
                    color:'#0f3d91'
                  }}>
                    {Number(bid.amount).toLocaleString('de-LU')} €
                  </h2>
                </div>
{index < 3 && (
  <>
    <button
      onClick={() => createInvoiceEmail(bid, index)}
      style={{
        padding:'9px 13px',
        border:'none',
        borderRadius:'10px',
        background:'#0f3d91',
        color:'white',
        cursor:'pointer',
        height:'fit-content'
      }}
    >
      Email Rechnung
    </button>

    <button
      onClick={() => createInvoicePDF(bid, index)}
      style={{
        padding:'9px 13px',
        border:'none',
        borderRadius:'10px',
        background:'#1f7a1f',
        color:'white',
        cursor:'pointer',
        height:'fit-content'
      }}
    >
      PDF Rechnung
    </button>
  </>
)}
                <button
                  onClick={() => deleteBid(bid.id)}
                  style={{
                    padding:'9px 13px',
                    border:'none',
                    borderRadius:'10px',
                    background:'#d62828',
                    color:'white',
                    cursor:'pointer',
                    height:'fit-content'
                  }}
                >
                  Läschen
                </button>
              </div>

              <div style={{
                display:'grid',
                gridTemplateColumns:'repeat(auto-fit, minmax(220px, 1fr))',
                gap:'12px',
                fontSize:'14px'
              }}>
                <Info label="Name" value={bid.name} />
                <Info label="Adress" value={bid.address} />
                <Info label="Email" value={bid.email} />
                <Info label="Telefon" value={bid.phone || '—'} />
                <Info label="IP" value={bid.ip_address || '—'} />
                <Info
                  label="Datum"
                  value={bid.created_at
                    ? new Date(bid.created_at).toLocaleString('de-LU')
                    : '—'}
                />
              </div>

              <details style={{marginTop:'12px'}}>
                <summary style={{
                  cursor:'pointer',
                  color:'#0f3d91',
                  fontWeight:'bold'
                }}>
                  Browser / User Agent
                </summary>

                <p style={{
                  fontSize:'12px',
                  overflowWrap:'anywhere',
                  background:'#f7fbff',
                  padding:'10px',
                  borderRadius:'10px'
                }}>
                  {bid.user_agent || '—'}
                </p>
              </details>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

function DashboardCard({
  title,
  value,
  detail
}: {
  title:string
  value:string
  detail:string
}) {
  return (
    <div style={{
      background:'white',
      border:'1px solid #cfe5ff',
      borderRadius:'18px',
      padding:'20px',
      boxShadow:'0 6px 18px rgba(0,0,0,0.06)'
    }}>
      <p style={{
        margin:'0 0 8px',
        color:'#315f9c',
        fontSize:'14px'
      }}>
        {title}
      </p>

      <p style={{
        margin:0,
        fontSize:'30px',
        fontWeight:'bold',
        color:'#0f3d91'
      }}>
        {value}
      </p>

      <p style={{
        margin:'8px 0 0',
        fontSize:'13px',
        color:'#666'
      }}>
        {detail}
      </p>
    </div>
  )
}

function Info({ label, value }: { label:string, value:string }) {
  return (
    <div>
      <p style={{
        margin:'0 0 3px',
        fontSize:'12px',
        color:'#666',
        fontWeight:'bold'
      }}>
        {label}
      </p>

      <p style={{
        margin:0,
        overflowWrap:'anywhere'
      }}>
        {value}
      </p>
    </div>
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
