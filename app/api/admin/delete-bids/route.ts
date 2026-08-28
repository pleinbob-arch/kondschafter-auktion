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

    const adminDeleteCode =
      process.env.ADMIN_DELETE_CODE

    if (
      !supabaseUrl ||
      !serviceRoleKey ||
      !adminDeleteCode
    ) {
      console.error(
        'Required server environment variables are missing'
      )

      return NextResponse.json(
        {
          error:
            'Server-Konfiguratioun feelt.'
        },
        { status: 500 }
      )
    }

    /*
     * 1. Authorization Header prüfen
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
            'Net ageloggt / Not authenticated'
        },
        { status: 401 }
      )
    }

    const accessToken =
      authHeader.substring(7)

    /*
     * Service Role bleibt ausschließlich auf dem Server.
     */
    const supabaseAdmin =
      createClient(
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
     * 2. Supabase-Session validieren
     */
    const {
      data: userData,
      error: userError
    } =
      await supabaseAdmin.auth.getUser(
        accessToken
      )

    if (
      userError ||
      !userData.user?.email
    ) {
      return NextResponse.json(
        {
          error:
            'Admin-Sessioun ass ongülteg oder ofgelaf.'
        },
        { status: 401 }
      )
    }

    /*
     * 3. Admin-E-Mail prüfen
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
     * 4. Sicherheitscode lesen
     */
    const { code } =
      await request.json()

    if (
      !code ||
      code !== adminDeleteCode
    ) {
      return NextResponse.json(
        {
          error:
            'Falsche Sécherheetscode / Invalid security code'
        },
        { status: 401 }
      )
    }

    /*
     * 5. Alle Gebote löschen
     */
    const { error } =
      await supabaseAdmin
        .from('bids')
        .delete()
        .not('id', 'is', null)

    if (error) {
      console.error(
        'Delete bids failed:',
        error
      )

      return NextResponse.json(
        {
          error:
            'Geboter konnten net geläscht ginn.'
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true
    })

  } catch (error) {
    console.error(
      'Delete bids route failed:',
      error
    )

    return NextResponse.json(
      {
        error:
          'Serverfehler.'
      },
      { status: 500 }
    )
  }
}
