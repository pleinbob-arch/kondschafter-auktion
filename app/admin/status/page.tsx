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

type AuctionSettings = {
  start_bid: number | string
  min_increase: number | string
  max_increase: number | string
  auction_end: string
}

export default function StatusPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [dbStatus, setDbStatus] =
    useState<'ok' | 'error' | 'checking'>('checking')
  const [realtimeStatus, setRealtimeStatus] =
    useState<'ok' | 'error' | 'checking'>('checking')
  const [bids, setBids] = useState<any[]>([])
  const [viewerCount, setViewerCount] = useState(0)
  const [lastRefresh, setLastRefresh] = useState('')
  const [timeLeft, setTimeLeft] = useState('')
  const [auctionSettings, setAuctionSettings] =
    useState<AuctionSettings | null>(null)

  const isAdmin =
    ADMIN_EMAILS.includes(session?.user?.email || '')

  const highestBid = bids[0] || null
  const totalBids = bids.length

  const onlineBidders = bids
    .filter(
      bid =>
        bid.source !== 'live' &&
        bid.email
    )
    .map(
      bid => `online:${bid.email}`
    )

  const liveBidders = bids
    .filter(
      bid =>
        bid.source === 'live' &&
        bid.bidder_number
    )
    .map(
      bid => `live:${bid.bidder_number}`
    )

  const uniqueBidders = new Set([
    ...onlineBidders,
    ...liveBidders
  ]).size

  const startBid = auctionSettings
    ? Number(auctionSettings.start_bid)
    : null

  const auctionEnd = auctionSettings
    ? new Date(auctionSettings.auction_end)
    : null

  const auctionClosed =
    auctionEnd
      ? new Date() >= auctionEnd
      : false

  async function runChecks() {
    setDbStatus('checking')

    const [
      { data: bidData, error: bidError },
      { data: settingsData, error: settingsError }
    ] = await Promise.all([
      supabase.rpc('admin_get_bids'),
      supabase.rpc('get_auction_settings')
    ])

    if (bidError || settingsError) {
      console.error(
        'Status check failed:',
        bidError || settingsError
      )
      setDbStatus('error')
      return
    }

    setBids(bidData || [])
    setAuctionSettings(
      (settingsData?.[0] || null) as AuctionSettings | null
    )
    setDbStatus('ok')
    setLastRefresh(
      new Date().toLocaleString('de-LU')
    )
  }

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session)
        setLoading(false)
      })

    const authListener =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          setSession(session)
        }
      )

    return () => {
      authListener
        .data
        .subscription
        .unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!isAdmin) return

    runChecks()

    const bidCheckInterval =
      setInterval(() => {
        runChecks()
      }, 30000)

    const viewerChannel =
      supabase.channel(
        'auction-viewers'
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

          setViewerCount(count)
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setRealtimeStatus('ok')
        }

        if (
          status === 'CHANNEL_ERROR' ||
          status === 'TIMED_OUT' ||
          status === 'CLOSED'
        ) {
          setRealtimeStatus('error')
        }
      })

    return () => {
      clearInterval(bidCheckInterval)
      supabase.removeChannel(
        viewerChannel
      )
    }
  }, [isAdmin])

  useEffect(() => {
    if (!auctionEnd) {
      setTimeLeft('…')
      return
    }

    const updateCountdown = () => {
      const difference =
        auctionEnd.getTime() -
        new Date().getTime()

      if (difference <= 0) {
        setTimeLeft(
          'Auktioun eriwwer / Auction ended'
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
        `${days} Deeg · ${hours}h ${minutes}m ${seconds}s`
      )
    }

    updateCountdown()

    const timer =
      setInterval(
        updateCountdown,
        1000
      )

    return () =>
      clearInterval(timer)
  }, [auctionSettings])

  if (loading) {
    return (
      <PageBox title="Status gëtt gelueden..." />
    )
  }

  if (!session || !isAdmin) {
    return (
      <PageBox title="Kee Zougang">
        <p>
          Diese Statusseite ist nur für Admins sichtbar.
        </p>

        <a
          href="/admin"
          style={buttonStyle}
        >
          Admin Login
        </a>
      </PageBox>
    )
  }

  const connectionWarning =
    viewerCount > 40

  let systemLevel:
    'green' | 'yellow' | 'red' =
      'green'

  if (connectionWarning) {
    systemLevel = 'yellow'
  }

  if (
    dbStatus !== 'ok' ||
    realtimeStatus !== 'ok'
  ) {
    systemLevel = 'red'
  }

  return (
    <main style={pageStyle}>

      <div style={{
        maxWidth:'1300px',
        margin:'0 auto'
      }}>

        <div style={headerStyle}>

          <div>

            <h1 style={{
              margin:0,
              color:'#0f3d91'
            }}>
              Kondschafter Systemstatus
            </h1>

            <p style={{
              marginBottom:0
            }}>
              Ageloggt als:{' '}
              <strong>
                {session.user.email}
              </strong>
            </p>

          </div>

          <div style={{
            display:'flex',
            gap:'10px',
            flexWrap:'wrap'
          }}>

            <button
              onClick={runChecks}
              style={buttonStyle}
            >
              Status aktualisieren
            </button>

            <a
              href="/admin"
              style={buttonStyle}
            >
              Admin
            </a>

            <a
              href="/stream"
              style={buttonStyle}
            >
              Stream
            </a>

            <a
              href="/"
              style={buttonStyle}
            >
              Mainpage
            </a>

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
            gridTemplateColumns:
              'repeat(auto-fit, minmax(220px, 1fr))',
            gap:'14px'
          }}>

            <div>
              <strong>System</strong>
              <br />
              {systemLevel === 'green'
                ? '🟢 Online'
                : systemLevel === 'yellow'
                ? '🟡 Beobachten'
                : '🔴 Problem'}
            </div>

            <div>
              <strong>Datenbank</strong>
              <br />
              {dbStatus === 'ok'
                ? '🟢 Verbunden'
                : dbStatus === 'checking'
                ? '🟡 Prüfen...'
                : '🔴 Fehler'}
            </div>

            <div>
              <strong>Realtime / Presence</strong>
              <br />
              {realtimeStatus === 'ok'
                ? '🟢 Verbunden'
                : realtimeStatus === 'checking'
                ? '🟡 Prüfen...'
                : '🔴 Fehler'}
            </div>

            <div>
              <strong>Status-Legende</strong>
              <br />
              🟢 Normalbetrieb
              <br />
              🟡 Beobachten
              <br />
              🔴 Eingreifen
            </div>

          </div>

          <p style={{
            margin:'16px 0 0',
            fontSize:'13px',
            color:'#555'
          }}>
            Leschten erfollegräichen DB-Check:{' '}
            <strong>
              {lastRefresh || '—'}
            </strong>
            <br />
            Monitoring:{' '}
            <strong>
              🟢 Aktiv
            </strong>
            {' '}· automatesch all 30 Sekonnen
          </p>

        </div>

        <div style={gridStyle}>

          <StatusCard
            title="Supabase Database"
            value={
              dbStatus === 'ok'
                ? 'Verbunden'
                : dbStatus === 'checking'
                ? 'Prüfen...'
                : 'Fehler ❌'
            }
            detail="Geschützte Admin-Abfrage über admin_get_bids()"
          />

          <StatusCard
            title="Realtime / Presence"
            value={
              realtimeStatus === 'ok'
                ? 'Verbunden'
                : realtimeStatus === 'checking'
                ? 'Prüfen...'
                : 'Fehler ❌'
            }
            detail="Live-Zuschauer / Presence-Kanal"
          />

          <StatusCard
            title={
              highestBid
                ? 'Héichstgebot'
                : 'Startgebot'
            }
            value={
              highestBid
                ? `${Number(highestBid.amount).toLocaleString('de-LU')} €`
                : startBid !== null
                  ? `${startBid.toLocaleString('de-LU')} €`
                  : '…'
            }
            detail={
              highestBid
                ? (
                    highestBid.source === 'live'
                      ? `Live · Bieter #${highestBid.bidder_number || '—'}`
                      : highestBid.name || 'Online'
                  )
                : 'Nach kee Gebot'
            }
          />

          <StatusCard
            title="Total Geboter"
            value={String(totalBids)}
            detail="Gesamtanzahl gespeicherter Gebote"
          />

          <StatusCard
            title="Bieter"
            value={String(uniqueBidders)}
            detail="Online + Live Bieter"
          />

          <StatusCard
            title="Live Zuschauer"
            value={String(viewerCount)}
            detail="Aktuell am Presence-Kanal"
          />

          <StatusCard
            title="Auktiounsstatus"
            value={
              auctionClosed
                ? 'Beendet'
                : 'Aktiv ✅'
            }
            detail={
              auctionClosed
                ? auctionEnd
                  ? `Enn: ${auctionEnd.toLocaleString(
                      'de-LU',
                      {
                        timeZone: 'Europe/Luxembourg',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }
                    )}`
                  : 'Enn: —'
                : timeLeft
            }
          />

          <StatusCard
            title="Magic Link / Brevo"
            value="Extern prüfen"
            detail="Brevo → Transactional → Logs"
          />

        </div>

        <div style={infoBoxStyle}>

          <h2 style={{
            marginTop:0,
            color:'#0f3d91'
          }}>
            Schnell-Diagnose
          </h2>

          <p>
            <strong>
              Wenn Login-Mails fehlen:
            </strong>{' '}
            Brevo Logs prüfen.
          </p>

          <p>
            <strong>
              Wenn Gebote nicht erscheinen:
            </strong>{' '}
            Adminseite, Mainpage und Stream neu laden und den DB-Check prüfen.
          </p>

          <p>
            <strong>
              Wenn die Seite langsam lädt:
            </strong>{' '}
            Vercel Observability und Supabase Infrastructure prüfen.
          </p>

          <p>
            <strong>
              Wenn nur einzelne Nutzer Probleme haben:
            </strong>{' '}
            Spam-Ordner, Mobilfunk/WLAN und Browser prüfen.
          </p>

          <p>
            <strong>
              Supabase:
            </strong>{' '}
            Pro + Micro Compute aktiv lassen.
          </p>

          <p>
            <strong>
              Brevo:
            </strong>{' '}
            Starter während der Auktion aktiv lassen.
          </p>

        </div>

        <div style={quickLinksStyle}>

          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            style={linkButtonStyle}
          >
            Supabase Dashboard
          </a>

          <a
            href="https://app.brevo.com"
            target="_blank"
            rel="noopener noreferrer"
            style={linkButtonStyle}
          >
            Brevo Logs
          </a>

          <a
            href="https://vercel.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            style={linkButtonStyle}
          >
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

        <h1 style={{
          marginTop:0,
          color:'#0f3d91'
        }}>
          {title}
        </h1>

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
  gridTemplateColumns:
    'repeat(auto-fit, minmax(240px, 1fr))',
  gap:'16px',
  marginBottom:'24px'
}

const cardStyle = {
  background:'white',
  border:'1px solid #cfe5ff',
  borderRadius:'18px',
  padding:'20px',
  boxShadow:
    '0 6px 18px rgba(0,0,0,0.06)'
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
  boxShadow:
    '0 10px 30px rgba(0,0,0,0.12)'
}
