import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { bidderNumber, amount } = await request.json()

    if (!bidderNumber || !amount) {
      return NextResponse.json(
        { error: 'Bieternummer und Betrag fehlen.' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: 'Server-Konfiguration fehlt.' },
        { status: 500 }
      )
    }

    const supabaseAdmin = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      }
    )

    const numericAmount = Number(amount)

    if (!numericAmount) {
      return NextResponse.json(
        { error: 'Ungültiger Betrag.' },
        { status: 400 }
      )
    }

    const { data: currentBids, error: readError } = await supabaseAdmin
      .from('bids')
      .select('amount')
      .order('amount', { ascending: false })
      .limit(1)

    if (readError) {
      return NextResponse.json(
        { error: 'Aktuelles Höchstgebot konnte nicht gelesen werden.' },
        { status: 500 }
      )
    }

    const hasBids =
  currentBids && currentBids.length > 0

const highestBid = hasBids
  ? Number(currentBids[0].amount)
  : null

const minBid = highestBid === null
  ? 2500
  : highestBid + 50

const maxBid = highestBid === null
  ? 3000
  : highestBid + 500

    if (numericAmount < minBid || numericAmount > maxBid) {
      return NextResponse.json(
        {
          error: `Live-Gebot muss zwischen ${minBid} € und ${maxBid} € liegen.`
        },
        { status: 400 }
      )
    }

    const { error: insertError } = await supabaseAdmin
      .from('bids')
      .insert([{
        name: `Live Bieter #${bidderNumber}`,
        address: '',
        email: '',
        phone: '',
        amount: numericAmount,
        language: 'lb',
        ip_address: 'live-auction',
        user_agent: 'admin-live-bid',
        source: 'live',
        bidder_number: String(bidderNumber)
      }])

    if (insertError) {
      return NextResponse.json(
        { error: 'Live-Gebot konnte nicht gespeichert werden.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true
    })

  } catch {
    return NextResponse.json(
      { error: 'Serverfehler.' },
      { status: 500 }
    )
  }
}
