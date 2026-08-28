import { createClient } from '@supabase/supabase-js'
import AuctionClient from './AuctionClient'

type PublicBid = {
  amount: number | string
  created_at: string
  source: string
}

type AuctionSettings = {
  start_bid: number | string
  min_increase: number | string
  max_increase: number | string
  auction_end: string
}

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Page() {
  const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    },
    global: {
      fetch: (url, options = {}) =>
        fetch(url, {
          ...options,
          cache: 'no-store'
        })
    }
  }
)

  const [
    { data: bidData, error: bidError },
    { data: settingsData, error: settingsError }
  ] = await Promise.all([
    supabase.rpc('get_public_bids'),
    supabase.rpc('get_auction_settings')
  ])

  if (bidError) {
    console.error(
      'Initial public bids konnten nicht geladen werden:',
      bidError
    )
  }

  if (settingsError) {
    console.error(
      'Initial auction settings konnten nicht geladen werden:',
      settingsError
    )
  }

  const topBids =
    ((bidData || []) as PublicBid[]).slice(0, 2)

  const initialHighestBid =
    topBids.length > 0
      ? Number(topBids[0].amount)
      : null

  const initialLastBid =
    topBids.length > 1
      ? topBids[1]
      : null

  const initialAuctionSettings =
    ((settingsData || [])[0] || null) as
      | AuctionSettings
      | null

  return (
    <AuctionClient
  initialHighestBid={initialHighestBid}
  initialLastBid={initialLastBid}
  initialAuctionSettings={initialAuctionSettings}
  initialBidsLoaded={!bidError}
/>
  )
}
