import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: Request) {
  try {
    const { code } = await request.json()

    // Sicherheitscode prüfen
    if (!code || code !== process.env.ADMIN_DELETE_CODE) {
      return NextResponse.json(
        { error: 'Falsche Sécherheetscode / Invalid security code' },
        { status: 401 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      console.error('Supabase server environment variables are missing')

      return NextResponse.json(
        { error: 'Server-Konfiguratioun feelt.' },
        { status: 500 }
      )
    }

    // Dieser Client existiert ausschließlich auf dem Server.
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

    const { error } = await supabaseAdmin
      .from('bids')
      .delete()
      .not('id', 'is', null)

    if (error) {
      console.error('Delete bids failed:', error)

      return NextResponse.json(
        { error: 'Geboter konnten net geläscht ginn.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true
    })

  } catch (error) {
    console.error('Delete bids route failed:', error)

    return NextResponse.json(
      { error: 'Serverfehler.' },
      { status: 500 }
    )
  }
}
