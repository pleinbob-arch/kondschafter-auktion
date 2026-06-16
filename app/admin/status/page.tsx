'use client'

import { useEffect, useState } from 'react'
import { createClient, Session } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ADMIN_EMAILS = [
  'plein.bob@gmail.com',
  'kondschafter@gmail.com'
]

export default function StatusPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [dbStatus, setDbStatus] = useState<'ok' | 'error' | 'checking'>('checking')
  const [realtimeStatus, setRealtimeStatus] = useState<'ok' | 'error' | 'checking'>('checking')
  const [bids, setBids] = useState<any[]>([])
  const [viewerCount, setViewerCount] = useState(0)
  const [lastRefresh, setLastRefresh] = useState('')

  const isAdmin = ADMIN_EMAILS.includes(session?.user?.email || '')
  const highestBid = bids[0] || null
  const totalBids = bids.length
  const uniqueBidders = new Set(bids.map(bid => bid.email)).size
  const lastBid = bids.length > 0
    ? [...bids].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0]
    : null

  async function runChecks() {
    setDbStatus('checking')
    setLastRefresh(new Date().toLocaleString('de-LU'))

    const { data, error } = await supabase
      .from('bids')
      .select('*')
      .order('amount', { ascending: false })

    if (error) {
      setDbStatus('error')
      return
    }

    setBids(data || [])
    setDbStatus('ok')
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

    runChecks()

    const bidsChannel = supabase
      .channel('status-bids-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bids' },
        () => {
          runChecks()
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') setRealtimeStatus('ok')
        if (status === 'CHANNEL_ERROR') setRealtimeStatus('error')
        if (status === 'TIMED_OUT') setRealtimeStatus('error')
      })

    const viewerChannel = supabase.channel('auction-viewers')

    viewerChannel
      .on('presence', { event: 'sync' }, () => {
        const state = viewerChannel.presenceState()
        const count = Object.values(state).flat().length
        setViewerCount(count)
      })
      .subscribe()

    const interval = setInterval(runChecks, 30000)

    return () => {
      supabase.removeChannel(bidsChannel)
      supabase.removeChannel(viewerChannel)
      clearInterval(interval)
    }
  }, [isAdmin])

  if (loading) {
    return <PageBox title="Status gëtt gelueden..." />
  }

  if (!session || !isAdmin) {
    return (
      <PageBox title="Kee Zougang">
        <p>Diese Statusseite ist nur für Admins sichtbar.</p>
        <a href="/admin" style={buttonStyle}>Admin Login</a>
      </PageBox>
    )
  }

  const systemOk = dbStatus === 'ok' && realtimeStatus === 'ok'
const connectionWarning = viewerCount > 40
const bidWarning = totalBids === 0

let systemLevel = 'green'

if (connectionWarning) {
  systemLevel = 'yellow'
}

if (dbStatus !== 'ok' || realtimeStatus !== 'ok') {
  systemLevel = 'red'
}
  return (
    <main style={pageStyle}>
      <div style={{maxWidth:'1300px', margin:'0 auto'}}>
        <div style={headerStyle}>
          <div>
            <h1 style={{margin:0, color:'#0f3d91'}}>
              Kondschafter Systemstatus
            </h1>
            <p style={{marginBottom:0}}>
              Ageloggt als: <strong>{session.user.email}</strong>
            </p>
          </div>

          <div style={{display:'flex', gap:'10px', flexWrap:'wrap'}}>
            <button onClick={runChecks} style={buttonStyle}>
              Status aktualisieren
            </button>
            <a href="/admin" style={buttonStyle}>Admin</a>
            <a href="/stream" style={buttonStyle}>Stream</a>
            <a href="/" style={buttonStyle}>Mainpage</a>
          </div>
        </div>

        <div style={{
  ...bigStatusStyle,
  background:
    systemLevel === 'green'
      ? '#e8fff0'
      : systemLevel === 'yellow'
      ? '#fff8e1'
      : '#fff0f0',
  border:
    systemLevel === 'green'
      ? '2px solid #4caf50'
      : systemLevel === 'yellow'
      ? '2px solid #ffb300'
      : '2px solid #d9534f'
}}>
  <h2 style={{
    margin:'0 0 16px',
    color:'#0f3d91'
  }}>
    KONDSCHAFTER AUKTION STATUS
  </h2>

  <div style={{
    display:'grid',
    gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))',
    gap:'14px'
  }}>

    <div>
      <strong>System</strong><br />
      {systemLevel === 'green'
        ? '🟢 Online'
        : systemLevel === 'yellow'
        ? '🟡 Beobachten'
        : '🔴 Problem'}
    </div>

    <div>
      <strong>Datenbank</strong><br />
      {dbStatus === 'ok' ? '🟢 Verbunden' : '🔴 Fehler'}
    </div>

    <div>
      <strong>Realtime</strong><br />
      {realtimeStatus === 'ok' ? '🟢 Verbunden' : '🔴 Fehler'}
    </div>

    <div>
      <strong>Letztes Gebot</strong><br />
      {lastBid?.created_at
        ? new Date(lastBid.created_at).toLocaleString('de-LU')
        : '—'}
    </div>

    <div>
      <strong>Live Zuschauer</strong><br />
      {viewerCount}
    </div>

  </div>

  <p style={{
    margin:'16px 0 0',
    fontSize:'13px',
    color:'#555'
  }}>
    Leschten Check: <strong>{lastRefresh || '—'}</strong>
  </p>
</div>
        <div style={gridStyle}>
          <StatusCard
            title="Supabase Database"
            value={dbStatus === 'ok' ? 'Verbunden ✅' : dbStatus === 'checking' ? 'Prüfen...' : 'Fehler ❌'}
            detail="Liest Gebote aus der Datenbank"
          />

          <StatusCard
            title="Realtime"
            value={realtimeStatus === 'ok' ? 'Verbunden ✅' : realtimeStatus === 'checking' ? 'Prüfen...' : 'Fehler ❌'}
            detail="Live Updates für neue Gebote"
          />

          <StatusCard
            title="Héichstgebot"
            value={highestBid ? `${Number(highestBid.amount).toLocaleString('de-LU')} €` : '—'}
            detail={highestBid ? highestBid.name : 'Nach kee Gebot'}
          />

          <StatusCard
            title="Total Geboter"
            value={String(totalBids)}
            detail="Gesamtanzahl gespeicherter Gebote"
          />

          <StatusCard
            title="Bieter"
            value={String(uniqueBidders)}
            detail="Einzigartige E-Mail-Adressen"
          />

          <StatusCard
            title="Live Zuschauer"
            value={String(viewerCount)}
            detail="Aktive Realtime-Verbindungen"
          />

          <StatusCard
            title="Letztes Gebot"
            value={lastBid ? `${Number(lastBid.amount).toLocaleString('de-LU')} €` : '—'}
            detail={lastBid?.created_at ? new Date(lastBid.created_at).toLocaleString('de-LU') : 'Noch kein Gebot'}
          />

          <StatusCard
            title="Magic Link / Brevo"
            value="Extern prüfen"
            detail="Brevo → Transactional → Logs"
          />
        </div>

        <div style={infoBoxStyle}>
          <h2 style={{marginTop:0, color:'#0f3d91'}}>Schnell-Diagnose</h2>

          <p><strong>Wenn Login-Mails fehlen:</strong> Brevo Logs prüfen.</p>
          <p><strong>Wenn Gebote nicht erscheinen:</strong> Supabase Database + Realtime prüfen.</p>
          <p><strong>Wenn die Seite langsam lädt:</strong> Vercel Observability prüfen.</p>
          <p><strong>Wenn nur einzelne Nutzer Probleme haben:</strong> Spam-Ordner, Mobilfunk, Browser prüfen.</p>
        </div>

        <div style={quickLinksStyle}>
          <a href="https://supabase.com/dashboard" target="_blank" style={linkButtonStyle}>
            Supabase Dashboard
          </a>
          <a href="https://app.brevo.com" target="_blank" style={linkButtonStyle}>
            Brevo Logs
          </a>
          <a href="https://vercel.com/dashboard" target="_blank" style={linkButtonStyle}>
            Vercel Dashboard
          </a>
        </div>
      </div>
    </main>
  )
}

function StatusCard({
  title,
  value,
  detail
}: {
  title:string
  value:string
  detail:string
}) {
  return (
    <div style={cardStyle}>
      <p style={{
        margin:'0 0 8px',
        color:'#315f9c',
        fontSize:'14px',
        fontWeight:'bold'
      }}>
        {title}
      </p>

      <p style={{
        margin:0,
        fontSize:'28px',
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

function PageBox({
  title,
  children
}: {
  title:string
  children?:React.ReactNode
}) {
  return (
    <main style={pageCenterStyle}>
      <div style={loginBoxStyle}>
        <h1 style={{marginTop:0, color:'#0f3d91'}}>{title}</h1>
        {children}
      </div>
    </main>
  )
}

const pageStyle = {
  minHeight:'100vh',
  padding:'20px',
  background:'#eef6ff',
  fontFamily:'Arial'
}

const headerStyle = {
  display:'flex',
  justifyContent:'space-between',
  alignItems:'center',
  marginBottom:'24px',
  gap:'12px',
  flexWrap:'wrap' as const
}

const gridStyle = {
  display:'grid',
  gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))',
  gap:'16px',
  marginBottom:'24px'
}

const cardStyle = {
  background:'white',
  border:'1px solid #cfe5ff',
  borderRadius:'18px',
  padding:'20px',
  boxShadow:'0 6px 18px rgba(0,0,0,0.06)'
}

const bigStatusStyle = {
  borderRadius:'20px',
  padding:'22px',
  marginBottom:'24px'
}

const infoBoxStyle = {
  background:'white',
  border:'1px solid #cfe5ff',
  borderRadius:'18px',
  padding:'22px',
  marginBottom:'20px'
}

const quickLinksStyle = {
  display:'flex',
  gap:'12px',
  flexWrap:'wrap' as const
}

const buttonStyle = {
  display:'inline-block',
  padding:'12px 18px',
  background:'#0f3d91',
  color:'white',
  border:'none',
  borderRadius:'12px',
  fontWeight:'bold',
  cursor:'pointer',
  textDecoration:'none'
}

const linkButtonStyle = {
  ...buttonStyle,
  background:'#315f9c'
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
