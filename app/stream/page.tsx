'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const AUCTION_END = new Date('2026-09-13T19:00:00')

export default function StreamPage() {
  const [highestBid, setHighestBid] = useState<number | null>(null)
  const [previousBid, setPreviousBid] = useState(0)
  const [viewerCount, setViewerCount] = useState(1)
  const [timeLeft, setTimeLeft] = useState('')

  async function loadHighestBid() {
    const { data } = await supabase
      .from('bids')
      .select('amount')
      .order('amount', { ascending: false })
      .limit(2)

    if (data && data.length > 0) {
      setHighestBid(Number(data[0].amount))

      if (data.length > 1) {
        setPreviousBid(Number(data[1].amount))
      }
    }
  }

  useEffect(() => {
    loadHighestBid()

    const bidsChannel = supabase
      .channel('stream-bids')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bids' },
        () => {
          loadHighestBid()
        }
      )
      .subscribe()

    const viewerChannel = supabase.channel('auction-viewers')

    viewerChannel
      .on('presence', { event: 'sync' }, () => {
        const state = viewerChannel.presenceState()
        const count = Object.values(state).flat().length
        setViewerCount(count || 1)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(bidsChannel)
      supabase.removeChannel(viewerChannel)
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = AUCTION_END.getTime() - now

      if (distance <= 0) {
        setTimeLeft('Auktioun eriwwer / Auction ended')
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((distance / (1000 * 60)) % 60)
      const seconds = Math.floor((distance / 1000) % 60)

      setTimeLeft(
        `${days} Deeg / Days · ${hours}h ${minutes}m ${seconds}s`
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      window.location.reload()
    }, 1000 * 60 * 5)

    return () => clearInterval(interval)
  }, [])

  return (
    <main style={{
      width:'100vw',
      height:'100vh',
      overflow:'hidden',
      padding:'28px',
      boxSizing:'border-box',
      fontFamily:'Arial, sans-serif',
      background:'linear-gradient(135deg, #dcefff 0%, #ffffff 100%)'
    }}>

      <div style={{
        height:'100%',
        display:'grid',
        gridTemplateRows:'150px 1fr',
        gap:'24px'
      }}>

        {/* Header */}
        <div style={{
          background:'linear-gradient(135deg, #0f3d91, #5fa8ff)',
          borderRadius:'26px',
          color:'white',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          gap:'24px',
          textAlign:'center',
          boxShadow:'0 10px 35px rgba(0,0,0,0.18)'
        }}>

          <img
            src="https://raw.githubusercontent.com/pleinbob-arch/kondschafter-auktion/main/logo.png"
            alt="Logo"
            style={{
              width:'76px',
              height:'76px',
              objectFit:'contain',
              background:'white',
              borderRadius:'14px',
              padding:'6px'
            }}
          />

          <div style={{textAlign:'center'}}>

            <p style={{
              margin:'0 0 6px',
              fontSize:'22px',
              letterSpacing:'1.5px',
              textTransform:'uppercase'
            }}>
              76. Gréiwemaacher Drauwen- a Wäifest 2026
            </p>

            <h1 style={{
              margin:0,
              fontSize:'72px',
              lineHeight:'1'
            }}>
              Kondschafter Auktioun
            </h1>

          </div>
        </div>

        {/* Content */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'52% 48%',
          gap:'24px',
          minHeight:0
        }}>

          {/* LEFT */}
          <div style={{
            background:'white',
            borderRadius:'26px',
            padding:'18px',
            boxShadow:'0 10px 30px rgba(0,0,0,0.12)',
            display:'flex',
            flexDirection:'column',
            justifyContent:'space-between'
          }}>

            <div style={{
              flex:1,
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              minHeight:0
            }}>

              <img
                src="https://raw.githubusercontent.com/pleinbob-arch/kondschafter-auktion/main/kondschafter.jpg"
                alt="Artwork"
                style={{
                  width:'100%',
                  height:'100%',
                  objectFit:'contain'
                }}
              />

            </div>

            <p style={{
              margin:'12px 0 16px',
              textAlign:'center',
              fontSize:'18px',
              fontStyle:'italic',
              color:'#555'
            }}>
              © Konschtwierk: André Scholtes
            </p>

            {/* QR */}
            <div style={{
              display:'flex',
              justifyContent:'center'
            }}>

              <div style={{
                background:'#f7fbff',
                border:'1px solid #d9e8ff',
                borderRadius:'20px',
                padding:'18px',
                textAlign:'center'
              }}>

                <p style={{
                  margin:'0 0 10px',
                  fontSize:'22px',
                  fontWeight:'bold',
                  color:'#315f9c'
                }}>
                  Matbidden / Place your bid
                </p>

                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=https://kondschafter-auktion.vercel.app"
                  alt="QR Code"
                  style={{
                    width:'180px',
                    height:'180px'
                  }}
                />

              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div style={{
            display:'grid',
            gridTemplateRows:'1.35fr 0.75fr 0.75fr',
            gap:'24px',
            minHeight:0
          }}>

            {/* BID */}
            <div style={{
              background:'white',
              border:'1px solid #cfe5ff',
              borderRadius:'26px',
              padding:'34px',
              boxShadow:'0 10px 30px rgba(0,0,0,0.1)'
            }}>

              <p style={{
                margin:'0 0 16px',
                fontSize:'34px',
                fontWeight:'bold',
                color:'#315f9c'
              }}>
                Aktuellt Héichstgebot / Current Highest Bid
              </p>

              <p style={{
                margin:0,
                fontSize:'118px',
                lineHeight:'1',
                fontWeight:'bold',
                color:'#0f3d91',
                transition:'all 0.4s ease'
              }}>
                {highestBid !== null
  ? `${highestBid.toLocaleString('de-LU')} €`
  : '...'}
              </p>

              <div style={{
                marginTop:'26px',
                paddingTop:'22px',
                borderTop:'2px solid #d9e8ff',
                fontSize:'28px',
                lineHeight:'1.6',
                color:'#444'
              }}>

                <div>
                  Nächst méiglecht Gebot / Next Possible Bid:{' '}
                  <strong style={{color:'#0f3d91'}}>
                    {(highestBid + 5).toLocaleString('de-LU')} €
                  </strong>
                </div>

                <div>
                  Viregt Gebot / Previous Bid:{' '}
                  <strong style={{color:'#0f3d91'}}>
                    {previousBid.toLocaleString('de-LU')} €
                  </strong>
                </div>

              </div>

            </div>

            {/* COUNTDOWN */}
            <div style={{
              background:'#eef6ff',
              border:'1px solid #cfe5ff',
              borderRadius:'26px',
              padding:'28px',
              textAlign:'center',
              boxShadow:'0 10px 30px rgba(0,0,0,0.08)'
            }}>

              <p style={{
                margin:'0 0 12px',
                fontSize:'30px',
                fontWeight:'bold',
                color:'#315f9c'
              }}>
                Auktioun Enn: 13 September 2026 · 19:00
              </p>

              <p style={{
                margin:0,
                fontSize:'42px',
                fontWeight:'bold',
                color:'#0f3d91'
              }}>
                {timeLeft}
              </p>

            </div>

            {/* VIEWERS */}
            <div style={{
              background:'white',
              border:'1px solid #cfe5ff',
              borderRadius:'26px',
              padding:'28px',
              textAlign:'center',
              boxShadow:'0 10px 30px rgba(0,0,0,0.08)'
            }}>

              <p style={{
                margin:'0 0 10px',
                fontSize:'28px',
                color:'#315f9c'
              }}>
                Live Zuschauer / Live Viewers
              </p>

              <p style={{
                margin:0,
                fontSize:'76px',
                fontWeight:'bold',
                color:'#0f3d91',
                lineHeight:'1'
              }}>
                {viewerCount}
              </p>

            </div>

          </div>

        </div>

      </div>

    </main>
  )
}
