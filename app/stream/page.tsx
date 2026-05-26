'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const AUCTION_END = new Date('2026-09-13T19:00:00')

export default function StreamPage() {
  const [highestBid, setHighestBid] = useState(0)
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
    const interval = setInterval(() => {
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

    return () => clearInterval(interval)
  }, [])

  return (
    <main style={{
      minHeight:'100vh',
      padding:'24px',
      fontFamily:'Arial, sans-serif',
      background:'linear-gradient(180deg, #dcefff 0%, #f7fbff 100%)'
    }}>

      <div style={{
        maxWidth:'1600px',
        margin:'0 auto'
      }}>

        <div style={{
          background:'linear-gradient(135deg, #0f3d91, #5fa8ff)',
          borderRadius:'28px',
          padding:'28px',
          color:'white',
          marginBottom:'28px',
          textAlign:'center',
          boxShadow:'0 10px 35px rgba(0,0,0,0.15)'
        }}>

          <p style={{
            margin:'0 0 10px',
            fontSize:'22px',
            letterSpacing:'1px'
          }}>
            76. GRÉIWEMAACHER DRAUWEN- A WÄIFEST 2026
          </p>

          <div style={{
            display:'flex',
            alignItems:'center',
            justifyContent:'center',
            gap:'18px'
          }}>

            <img
              src="https://raw.githubusercontent.com/pleinbob-arch/kondschafter-auktion/main/logo.png"
              alt="Logo"
              style={{
                width:'70px',
                height:'70px',
                objectFit:'contain',
                background:'white',
                borderRadius:'12px',
                padding:'6px'
              }}
            />

            <h1 style={{
              margin:0,
              fontSize:'clamp(58px, 7vw, 100px)',
              lineHeight:'1'
            }}>
              Kondschafter Auktioun
            </h1>

          </div>

          <p style={{
            marginTop:'18px',
            fontSize:'28px'
          }}>
            Fir de gudden Zweck · Pour la bonne cause · For a good cause
          </p>

        </div>

        <div style={{
          display:'grid',
          gridTemplateColumns:'1.2fr 1fr',
          gap:'28px',
          alignItems:'start'
        }}>

          <div>

            <img
              src="https://raw.githubusercontent.com/pleinbob-arch/kondschafter-auktion/main/artwork.jpg"
              alt="Artwork"
              style={{
                width:'100%',
                borderRadius:'28px',
                boxShadow:'0 15px 40px rgba(0,0,0,0.18)'
              }}
            />

            <p style={{
              textAlign:'center',
              marginTop:'12px',
              fontStyle:'italic',
              color:'#444',
              fontSize:'22px'
            }}>
              © Konschtwierk: André Scholtes
            </p>

          </div>

          <div style={{
            display:'grid',
            gap:'22px'
          }}>

            <Card>

              <p style={{
                margin:'0 0 18px',
                color:'#2155a3',
                fontWeight:'bold',
                fontSize:'34px'
              }}>
                Aktuellt Héichstgebot / Current Highest Bid
              </p>

              <h2 style={{
                margin:'0 0 24px',
                fontSize:'clamp(72px, 9vw, 120px)',
                color:'#123f91',
                lineHeight:'1'
              }}>
                {highestBid.toLocaleString('de-LU')} €
              </h2>

              <div style={{
                borderTop:'2px solid #d7e5ff',
                paddingTop:'18px',
                fontSize:'26px',
                lineHeight:'1.7'
              }}>

                <p style={{margin:'0 0 8px'}}>
                  Nächst méiglecht Gebot / Next Possible Bid:{' '}
                  <strong>{(highestBid + 5).toLocaleString('de-LU')} €</strong>
                </p>

                <p style={{margin:0}}>
                  Viregt Gebot / Previous Bid:{' '}
                  <strong>{previousBid.toLocaleString('de-LU')} €</strong>
                </p>

              </div>

            </Card>

            <Card centered>

              <p style={{
                margin:'0 0 10px',
                fontSize:'34px',
                fontWeight:'bold'
              }}>
                Auktioun Enn: 13 September 2026 · 19:00
              </p>

              <p style={{
                margin:0,
                fontSize:'40px',
                color:'#123f91',
                fontWeight:'bold'
              }}>
                {timeLeft}
              </p>

            </Card>

            <Card centered>

              <p style={{
                margin:'0 0 10px',
                fontSize:'26px',
                color:'#2155a3'
              }}>
                Live Zuschauer / Live Viewers
              </p>

              <p style={{
                margin:0,
                fontSize:'74px',
                fontWeight:'bold',
                color:'#123f91'
              }}>
                {viewerCount}
              </p>

            </Card>

          </div>

        </div>

      </div>
    </main>
  )
}

function Card({
  children,
  centered
}: {
  children: React.ReactNode
  centered?: boolean
}) {
  return (
    <div style={{
      background:'rgba(255,255,255,0.92)',
      border:'1px solid #cfe5ff',
      borderRadius:'26px',
      padding:'34px',
      textAlign:centered ? 'center' : 'left',
      boxShadow:'0 10px 30px rgba(0,0,0,0.08)'
    }}>
      {children}
    </div>
  )
}
