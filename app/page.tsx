import { createClient } from '@supabase/supabase-js'
import AuctionClient from './AuctionClient'

type PublicBid = {
  amount: number | string
  created_at: string
  source: string
}

export const dynamic = 'force-dynamic'

export default async function Page() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data, error } = await supabase.rpc(
    'get_public_bids'
  )

  if (error) {
    console.error(
      'Initial public bids konnten nicht geladen werden:',
      error
    )
  }

  const topBids =
    ((data || []) as PublicBid[]).slice(0, 2)

  const initialHighestBid =
    topBids.length > 0
      ? Number(topBids[0].amount)
      : null

  const initialLastBid =
    topBids.length > 1
      ? topBids[1]
      : null

  return (
    <AuctionClient
      initialHighestBid={initialHighestBid}
      initialLastBid={initialLastBid}
    />
  )
}
