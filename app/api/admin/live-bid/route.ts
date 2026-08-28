import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const ADMIN_EMAILS = [
  'plein.bob@gmail.com',
  'kondschafter@gmail.com'
]

export async function POST(request: Request) {
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL

    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      console.error(
        'Supabase server environment variables are missing'
      )

      return NextResponse.json(
        { error: 'Server-Konfiguration fehlt.' },
        { status: 500 }
      )
    }

    /*
     * 1. Admin-Session aus dem Authorization Header holen
     */
    const authHeader =
      request.headers.get('authorization')

    if (
      !authHeader ||
      !authHeader.startsWith('Bearer ')
    ) {
      return NextResponse.json(
        {
          error:
            'Nicht angemeldet / Not authenticated'
        },
        { status: 401 }
      )
    }

    const accessToken =
      authHeader.substring(7)

    /*
     * Service Role bleibt ausschließlich auf dem Server.
     */
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

    /*
     * 2. Token bei Supabase validieren
     */
    const {
      data: userData,
      error: userError
    } = await supabaseAdmin.auth.getUser(
      accessToken
    )

    if (
      userError ||
      !userData.user?.email
    ) {
      return NextResponse.json(
        {
          error:
            'Ungültige oder abgelaufene Admin-Sitzung.'
        },
        { status: 401 }
      )
    }

    /*
     * 3. Nur unsere beiden Admin-E-Mails zulassen
     */
    if (
      !ADMIN_EMAILS.includes(
        userData.user.email
      )
    ) {
      return NextResponse.json(
        {
          error:
            'Kee Admin-Zougang / No admin access'
        },
        { status: 403 }
      )
    }

    /*
     * 4. Daten lesen
     */
    const {
      bidderNumber,
      amount
    } = await request.json()

    if (
      !bidderNumber ||
      !String(bidderNumber).trim()
    ) {
      return NextResponse.json(
        {
          error:
            'Bieternummer fehlt.'
        },
        { status: 400 }
      )
    }

    const numericAmount =
      Number(amount)

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      return NextResponse.json(
        {
          error:
            'Ungültiger Betrag.'
        },
        { status: 400 }
      )
    }

    /*
     * 5. Atomare Datenbankfunktion aufrufen.
     *
     * Dort werden:
     * - Auktionsende 19:26
     * - Startgebot 2.500–3.000
     * - danach +50 bis +500
     * - gleichzeitige Gebote
     *
     * serverseitig geprüft.
     */
    const { error } =
      await supabaseAdmin.rpc(
        'admin_place_live_bid',
        {
          p_bidder_number:
            String(bidderNumber).trim(),
          p_amount: numericAmount
        }
      )

    if (error) {
      console.error(
        'Live bid failed:',
        error
      )

      if (
        error.message.includes(
          'AUCTION_ENDED'
        )
      ) {
        return NextResponse.json(
          {
            error:
              'Auktioun beendet / Auction ended'
          },
          { status: 400 }
        )
      }

      if (
        error.message.includes(
          'BID_TOO_LOW'
        )
      ) {
        return NextResponse.json(
          {
            error:
              'Dëst Live-Gebot ass ze niddreg.'
          },
          { status: 400 }
        )
      }

      if (
        error.message.includes(
          'BID_TOO_HIGH'
        )
      ) {
        return NextResponse.json(
          {
            error:
              'Dëst Live-Gebot ass ze héich.'
          },
          { status: 400 }
        )
      }

      return NextResponse.json(
        {
          error:
            'Live-Gebot konnte nicht gespeichert werden.'
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true
    })

  } catch (error) {
    console.error(
      'Live bid route failed:',
      error
    )

    return NextResponse.json(
      {
        error: 'Serverfehler.'
      },
      { status: 500 }
    )
  }
}
