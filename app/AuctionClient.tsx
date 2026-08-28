'use client'

import { useEffect, useState } from 'react'
import { createClient, Session } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      detectSessionInUrl: true,
      persistSession: true,
      autoRefreshToken: true
    }
  }
)

type BidderProfile = {
  id: string
  user_id: string
  email: string
  first_name: string
  last_name: string
  street: string
  city: string
  phone: string
  language: string
}

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

type AuctionClientProps = {
  initialHighestBid: number | null
  initialLastBid: PublicBid | null
  initialAuctionSettings?: AuctionSettings | null
  initialBidsLoaded?: boolean
}

export default function AuctionClient({
  initialHighestBid,
  initialLastBid,
  initialAuctionSettings = null,
  initialBidsLoaded = false
}: AuctionClientProps) {
  const [session, setSession] = useState<Session | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [bidderProfile, setBidderProfile] =
    useState<BidderProfile | null>(null)

  const [loginEmail, setLoginEmail] = useState('')
  const [highestBid, setHighestBid] =
    useState<number | null>(initialHighestBid)
  const [lastBid, setLastBid] =
    useState<PublicBid | null>(initialLastBid)
  const [auctionSettings, setAuctionSettings] =
    useState<AuctionSettings | null>(initialAuctionSettings)
  const [bidsLoaded, setBidsLoaded] = useState(initialBidsLoaded)
  const [message, setMessage] = useState('')
  const [auctionClosed, setAuctionClosed] = useState(false)
  const [viewerCount, setViewerCount] = useState(1)
  const [showAuctionInfo, setShowAuctionInfo] = useState(false)

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    phone: '',
    language: 'lb'
  })

  const [bidAmount, setBidAmount] = useState('')

  const startBid = auctionSettings
    ? Number(auctionSettings.start_bid)
    : null

  const minIncrease = auctionSettings
    ? Number(auctionSettings.min_increase)
    : null

  const maxIncrease = auctionSettings
    ? Number(auctionSettings.max_increase)
    : null

  const auctionEnd = auctionSettings
    ? new Date(auctionSettings.auction_end)
    : null

 const minBid =
  startBid === null ||
  minIncrease === null
    ? null
    : highestBid === null
      ? startBid + minIncrease
      : highestBid + minIncrease

  const maxBid =
    startBid === null ||
    maxIncrease === null
      ? null
      : highestBid === null
        ? startBid + maxIncrease
        : highestBid + maxIncrease

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')

    const { error } = await supabase.auth.signInWithOtp({
      email: loginEmail,
      options: {
        emailRedirectTo:
          'https://kondschafter-auktion.vercel.app'
      }
    })

    if (error) {
      setMessage(
        'De Bestätegungslink konnt net geschéckt ginn. ' +
        'Probéier w.e.g. nach eng Kéier. / ' +
        'The confirmation link could not be sent. ' +
        'Please try again.'
      )
      return
    }

    setMessage(
      'De Bestätegungslink gouf geschéckt. ' +
      'Kuck w.e.g. deng E-Mail. / ' +
      'The confirmation link has been sent. ' +
      'Please check your email.'
    )
  }

  async function loadAuctionSettings() {
    const { data, error } = await supabase.rpc(
      'get_auction_settings'
    )

    if (error) {
      console.error(
        'Auction settings konnten nicht geladen werden:',
        error
      )
      return
    }

    const settings =
      (data?.[0] || null) as AuctionSettings | null

    if (!settings) {
      console.error(
        'Auction settings fehlen.'
      )
      return
    }

    setAuctionSettings(settings)
  }

  async function loadHighestBid() {
    const { data, error } = await supabase.rpc(
      'get_public_bids'
    )

    if (error) {
      console.error(
        'Public bids konnten nicht geladen werden:',
        error
      )
      return
    }

    const topBids = (data?.slice(0, 2) || []) as PublicBid[]

    if (topBids.length > 0) {
      setHighestBid(Number(topBids[0].amount))
      setLastBid(topBids[1] || null)
    } else {
      setHighestBid(null)
      setLastBid(null)
    }
    setBidsLoaded(true)
  }

  async function loadBidderProfile(userId: string) {
    setProfileLoading(true)

    const { data, error } = await supabase
      .from('bidders')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error(
        'Bidder profile could not be loaded:',
        error
      )

      setMessage(
        'Deng Donnéeë konnten net geluede ginn. ' +
        'Probéier w.e.g. nach eng Kéier. / ' +
        'Your details could not be loaded. ' +
        'Please try again.'
      )

      setBidderProfile(null)
      setProfileLoading(false)
      return
    }

    setBidderProfile(data || null)
    setProfileLoading(false)
  }

  async function saveBidderProfile(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')

    const {
      data: sessionData,
      error: sessionError
    } = await supabase.auth.getSession()

    const currentSession = sessionData.session

    if (
      sessionError ||
      !currentSession?.user?.id ||
      !currentSession.user.email
    ) {
      setMessage(
        'Deng Sessioun ass net méi aktiv. ' +
        'Logg dech w.e.g. nach eng Kéier an. / ' +
        'Your session is no longer active. ' +
        'Please sign in again.'
      )
      return
    }

    if (
      !profileForm.firstName.trim() ||
      !profileForm.lastName.trim() ||
      !profileForm.street.trim() ||
      !profileForm.city.trim() ||
      !profileForm.phone.trim()
    ) {
      setMessage(
        'Fëll w.e.g. all Pflichtfelder aus. / ' +
        'Please complete all required fields.'
      )
      return
    }

    const { data, error } = await supabase
      .from('bidders')
      .insert([
        {
          user_id: currentSession.user.id,
          email: currentSession.user.email,
          first_name: profileForm.firstName.trim(),
          last_name: profileForm.lastName.trim(),
          street: profileForm.street.trim(),
          city: profileForm.city.trim(),
          phone: profileForm.phone.trim(),
          language: profileForm.language
        }
      ])
      .select('*')
      .single()

    if (error) {
      console.error(
        'Bidder profile insert failed:',
        error
      )

      setMessage(
        'Deng Donnéeë konnten net gespäichert ginn. ' +
        'Probéier w.e.g. nach eng Kéier. / ' +
        'Your details could not be saved. ' +
        'Please try again.'
      )
      return
    }

    setBidderProfile(data)

    setMessage(
      'Merci! Deng Donnéeë goufe gespäichert. ' +
      'Du kanns elo bidden. / ' +
      'Thank you! Your details have been saved. ' +
      'You can now place a bid.'
    )
  }

  async function submitBid(e: React.FormEvent) {
    e.preventDefault()
    setMessage('')

    if (!session?.user?.email) {
      setMessage(
        'Confirméier w.e.g. fir d’éischt deng E-Mail. / ' +
        'Please confirm your email first.'
      )
      return
    }

    if (!bidderProfile) {
      setMessage(
        'Fëll w.e.g. fir d’éischt deng Donnéeën aus. / ' +
        'Please complete your details first.'
      )
      return
    }

    if (
      !auctionSettings ||
      minBid === null ||
      maxBid === null ||
      !auctionEnd
    ) {
      setMessage(
        'D’Auktiounsdonnéeë konnten nach net geluede ginn. ' +
        'Probéier w.e.g. nach eng Kéier. / ' +
        'The auction settings have not loaded yet. ' +
        'Please try again.'
      )
      return
    }

    if (new Date() >= auctionEnd) {
      setMessage(
        'D’Auktioun ass eriwwer. / The auction has ended.'
      )
      return
    }

    const amount = Number(bidAmount)

    if (!Number.isFinite(amount) || amount <= 0) {
      setMessage(
        'Gëff w.e.g. e valabelt Gebot an. / ' +
        'Please enter a valid bid.'
      )
      return
    }

    if (amount < minBid || amount > maxBid) {
      setMessage(
        `Däi Gebot muss tëscht ${minBid.toLocaleString(
          'de-LU'
        )} € an ${maxBid.toLocaleString(
          'de-LU'
        )} € leien./ ` +
        `Your bid must be between ${minBid.toLocaleString(
          'de-LU'
        )} € and ${maxBid.toLocaleString(
          'de-LU'
        )} €.`
      )
      return
    }

    /*
     * Ëffentlech IP-Adress vum Bieter ermëttelen.
     */
    let ipAddress = ''

    try {
      const ipData = await fetch(
        'https://api.ipify.org?format=json'
      )

      if (ipData.ok) {
        const ipJson = await ipData.json()
        ipAddress = ipJson.ip || ''
      }
    } catch {
      ipAddress = ''
    }

    /*
     * Gebot iwwer déi geséchert
     * Supabase RPC-Funktioun späicheren.
     */
    const { error } = await supabase.rpc(
      'place_bid',
      {
        p_amount: amount,
        p_ip_address: ipAddress || 'unknown',
        p_user_agent: navigator.userAgent
      }
    )

    if (error) {
      console.error('Bid submission failed:', error)

      const errorText = error.message || ''

      if (errorText.includes('BID_TOO_LOW')) {
        setMessage(
          'Däi Gebot ass ze niddreg. ' +
          'De Gebotsstand gouf eventuell an der Tëschenzäit erhéicht. / ' +
          'Your bid is too low. ' +
          'The current bid may have increased in the meantime.'
        )
        await loadHighestBid()
        return
      }

      if (errorText.includes('BID_TOO_HIGH')) {
        setMessage(
          'Däi Gebot ass ze héich. ' +
          `Déi maximal Erhéijung pro Gebot ass ${maxIncrease?.toLocaleString('de-LU')} €. / ` +
          'Your bid is too high. ' +
          `The maximum increase per bid is €${maxIncrease?.toLocaleString('de-LU')}.`
        )
        await loadHighestBid()
        return
      }

      if (errorText.includes('AUCTION_ENDED')) {
        setAuctionClosed(true)

        setMessage(
          'D’Auktioun ass eriwwer. / The auction has ended.'
        )
        return
      }

      if (errorText.includes('NOT_AUTHENTICATED')) {
        setMessage(
          'Deng Sessioun ass net méi aktiv. ' +
          'Logg dech w.e.g. nach eng Kéier an. / ' +
          'Your session is no longer active. ' +
          'Please sign in again.'
        )
        return
      }

      if (errorText.includes('BIDDER_PROFILE_MISSING')) {
        setMessage(
          'Deng Bieterdonnéeë feelen. ' +
          'Logg dech w.e.g. nach eng Kéier an. / ' +
          'Your bidder details are missing. ' +
          'Please sign in again.'
        )
        return
      }

      setMessage(
        'Däi Gebot konnt net gespäichert ginn. ' +
        'Probéier w.e.g. nach eng Kéier. / ' +
        'Your bid could not be saved. ' +
        'Please try again.'
      )
      return
    }

    /*
     * Eegent Gebot direkt um Bildschierm weisen.
     */
    setHighestBid(amount)
    setBidAmount('')

    setMessage(
      'Merci! Däi Gebot gouf gespäichert. / ' +
      'Thank you! Your bid has been recorded.'
    )
  }

  async function signOut() {
    setMessage('')
    setBidderProfile(null)
    setProfileLoading(false)

    await supabase.auth.signOut()
  }

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session)

        if (data.session?.user?.id) {
          loadBidderProfile(data.session.user.id)
        } else {
          setProfileLoading(false)
        }

        if (
          window.location.hash ||
          window.location.search
        ) {
          window.history.replaceState(
            {},
            '',
            window.location.pathname
          )
        }
      })

    const authListener = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)

        if (session?.user?.id) {
          loadBidderProfile(session.user.id)
        } else {
          setBidderProfile(null)
          setProfileLoading(false)
        }
      }
    )

    loadAuctionSettings()
    loadHighestBid()

    /*
     * Presence Channel fir Live-Zuschauer.
     */
    const viewerChannel = supabase.channel(
      'auction-viewers',
      {
        config: {
          presence: {
            key: crypto.randomUUID()
          }
        }
      }
    )

    viewerChannel
      .on(
        'presence',
        {
          event: 'sync'
        },
        () => {
          const state = viewerChannel.presenceState()

          const count = Object.values(state).flat().length

          setViewerCount(count || 1)
        }
      )
      .subscribe(async status => {
        if (status === 'SUBSCRIBED') {
          await viewerChannel.track({
            online_at: new Date().toISOString()
          })
        }
      })

    /*
     * Nei Geboter direkt iwwer
     * Supabase Realtime Broadcast empfänken.
     */
    const bidChannel = supabase.channel(
      'auction-bids'
    )

    bidChannel
      .on(
        'broadcast',
        {
          event: 'new_bid'
        },
        () => {
          loadHighestBid()
        }
      )
      .subscribe()

    /*
     * 2-Sekonnen-Polling bleift als
     * zousätzlecht Sécherheetsnetz bestoen.
     */
    const bidRefreshInterval = setInterval(
      () => {
        loadHighestBid()
      },
      2000
    )

    return () => {
      authListener.data.subscription.unsubscribe()

      supabase.removeChannel(bidChannel)
      supabase.removeChannel(viewerChannel)

      clearInterval(bidRefreshInterval)
    }
  }, [])

  useEffect(() => {
    if (!auctionEnd) {
      setAuctionClosed(false)
      return
    }

    const checkAuctionClosed = () => {
      setAuctionClosed(new Date() >= auctionEnd)
    }

    checkAuctionClosed()

    const closeInterval = setInterval(
      checkAuctionClosed,
      1000
    )

    return () => clearInterval(closeInterval)
  }, [auctionSettings])

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        loadAuctionSettings()
        loadHighestBid()
      }
    }

    document.addEventListener(
      'visibilitychange',
      handleVisibility
    )

    return () => {
      document.removeEventListener(
        'visibilitychange',
        handleVisibility
      )
    }
  }, [])

  useEffect(() => {
    try {
      const alreadySeen =
        sessionStorage.getItem('auction-info-seen')

      if (!alreadySeen) {
        setShowAuctionInfo(true)
      }
    } catch {
      setShowAuctionInfo(true)
    }
  }, [])

  function closeAuctionInfo() {
    try {
      sessionStorage.setItem(
        'auction-info-seen',
        'true'
      )
    } catch {
      // Falls sessionStorage net verfügbar ass,
      // gëtt de Popup einfach fir dës Vue zougemaach.
    }

    setShowAuctionInfo(false)
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '24px',
        fontFamily: 'Arial, sans-serif',
        backgroundImage:
          'linear-gradient(rgba(15,61,145,0.25), rgba(15,61,145,0.35)), url(https://raw.githubusercontent.com/pleinbob-arch/kondschafter-auktion/main/background.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <style jsx global>{`
        .auction-button {
          transition:
            transform 0.08s ease,
            box-shadow 0.08s ease,
            filter 0.15s ease;
          box-shadow: 0 4px 0 #082b69;
          cursor: pointer;
        }

        .auction-button:hover {
          filter: brightness(1.06);
        }

        .auction-button:active {
          transform: translateY(3px);
          box-shadow: 0 1px 0 #082b69;
        }

        .auction-button:disabled {
          transform: none;
          box-shadow: none;
          cursor: not-allowed;
        }
      `}</style>

      {showAuctionInfo && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="auction-info-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '18px',
            background: 'rgba(0,0,0,0.62)'
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '620px',
              background: '#fff',
              border: '4px solid #0f3d91',
              borderRadius: '34px',
              padding: '24px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: '42px',
                bottom: '-30px',
                width: 0,
                height: 0,
                borderTop: '30px solid #0f3d91',
                borderRight: '38px solid transparent'
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '47px',
                bottom: '-21px',
                width: 0,
                height: 0,
                borderTop: '24px solid #fff',
                borderRight: '30px solid transparent'
              }}
            />

            <div
              style={{
                display: 'inline-block',
                padding: '7px 16px',
                borderRadius: '999px',
                background: '#ffcf33',
                color: '#0d2e67',
                fontWeight: '900',
                fontSize: '14px',
                letterSpacing: '0.7px',
                boxShadow: '0 4px 0 #d7a900'
              }}
            >
              LIVE AUKTIOUN
            </div>

            <h2
              id="auction-info-title"
              style={{
                margin: '14px 0 4px',
                color: '#0f3d91',
                fontSize: 'clamp(34px, 7vw, 48px)',
                lineHeight: '1',
                fontWeight: '900'
              }}
            >
              FINAL 15 MINUTES
            </h2>

            <p
              style={{
                margin: '0 0 16px',
                color: '#315f9c',
                fontWeight: '800',
                fontSize: '15px'
              }}
            >
              Déi lescht 15 Minutten · The final 15 minutes
            </p>

            <div
              style={{
                padding: '15px 18px',
                background: '#eaf3ff',
                border: '2px solid #8ec5ff',
                borderRadius: '18px',
                color: '#16365f',
                lineHeight: '1.45',
                marginBottom: '12px'
              }}
            >
              <strong style={{ fontSize: '17px' }}>
                LËTZEBUERGESCH
              </strong>
              <p style={{ margin: '8px 0 0' }}>
                <strong>Live-Auktioun:</strong> déi lescht 15 Minutten
                um Stand vun de Kondschafter.
                <br />
                <strong>Aschreiwen um Stand → Bieternummer kréien.</strong>
                <br />
                Ouni Bieternummer <strong>kee Matbidden.</strong>
              </p>
            </div>

            <div
              style={{
                padding: '15px 18px',
                background: '#fff3df',
                border: '2px solid #f1bc63',
                borderRadius: '18px',
                color: '#5b3a08',
                lineHeight: '1.45',
                marginBottom: '16px'
              }}
            >
              <strong style={{ fontSize: '17px' }}>
                ENGLISH
              </strong>
              <p style={{ margin: '8px 0 0' }}>
                <strong>Live auction:</strong> final 15 minutes at the
                Kondschafter stand.
                <br />
                <strong>Register at the stand → receive a bidder number.</strong>
                <br />
                No bidder number = <strong>no live bidding.</strong>
              </p>
            </div>

            <button
              type="button"
              className="auction-button"
              onClick={closeAuctionInfo}
              style={{
                ...buttonStyle,
                width: '100%',
                padding: '14px',
                fontSize: '17px'
              }}
            >
              Verstanen / Understood
            </button>
          </div>
        </div>
      )}

      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '28px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)'
        }}
      >
        <section
          style={{
            padding: '18px 28px',
            textAlign: 'center',
            background:
              'linear-gradient(135deg, #0f3d91, #6bb6ff)',
            color: 'white'
          }}
        >
          <p
            style={{
              margin: 0,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              fontSize: '20px'
            }}
          >
            76. Gréiwemaacher Drauwen- a Wäifest
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              marginBottom: '10px'
            }}
          >
            <img
              src="https://raw.githubusercontent.com/pleinbob-arch/kondschafter-auktion/main/logo.png"
              alt="Kondschafter Logo"
              style={{
                width: '42px',
                height: '42px',
                objectFit: 'contain'
              }}
            />

            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(34px, 8vw, 64px)',
                lineHeight: '1.05'
              }}
            >
              Kondschafter Auktioun
            </h1>
          </div>

          <p
            style={{
              margin: '0 0 14px',
              fontSize: '16px',
              opacity: 0.92
            }}
          >
            Fir de gudden Zweck ·
            Pour la bonne cause ·
            For a good cause
          </p>
        </section>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '28px',
            padding: '32px'
          }}
        >
          <div>
            <img
              src="https://raw.githubusercontent.com/pleinbob-arch/kondschafter-auktion/main/kondschafter.jpg"
              alt="Kondschafter"
              style={{
                width: '100%',
                borderRadius: '22px',
                display: 'block',
                boxShadow:
                  '0 12px 30px rgba(0,0,0,0.25)'
              }}
            />

            <p
              style={{
                marginTop: '10px',
                marginBottom: '20px',
                fontSize: '13px',
                color: '#666',
                textAlign: 'center',
                fontStyle: 'italic'
              }}
            >
              Konschtwierk: 160 cm × 120 cm
              <br />
              © Kënschtler: André Scholtes

              <a
                href="https://www.instagram.com/itwasnotme_scholtes/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram vum André Scholtes"
                style={{
                  marginLeft: '10px',
                  textDecoration: 'none',
                  fontStyle: 'normal'
                }}
              >
                📸
              </a>
            </p>
          </div>

          <div>
            <div style={cardStyle}>
              <p
                style={{
                  margin: '0 0 10px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#315f9c',
                  letterSpacing: '0.3px'
                }}
              >
                {!auctionSettings
                  ? 'Auktiounsdonnéeë gi gelueden / Loading auction settings'
                  : highestBid === null
                    ? 'Startgebot / Starting Bid'
                    : 'Aktuellt Héichstgebot / Current Highest Bid'}
              </p>

              <p
                style={{
                  margin: 0,
                  fontSize: 'clamp(42px, 9vw, 62px)',
                  fontWeight: 'bold',
                  color: '#0f3d91'
                }}
              >
                {!auctionSettings || !bidsLoaded
  ? '…'
  : highestBid !== null
    ? `${highestBid.toLocaleString('de-LU')} €`
    : `${startBid?.toLocaleString('de-LU')} €`}
              </p>

              <div
                style={{
                  marginTop: '16px',
                  paddingTop: '14px',
                  borderTop: '1px solid #d9e8ff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#555'
                }}
              >
                <div>
                  Nächst méiglecht Gebot /
                  Next Possible Bid:{' '}
                  <strong style={{ color: '#0f3d91' }}>
                    {minBid !== null
                      ? `${minBid.toLocaleString('de-LU')} €`
                      : '…'}
                  </strong>
                </div>

                <div style={{ marginTop: '6px' }}>
                  Max. Gebot / Maximum Bid:{' '}
                  <strong style={{ color: '#0f3d91' }}>
                    {maxBid !== null
                      ? `${maxBid.toLocaleString('de-LU')} €`
                      : '…'}
                  </strong>
                </div>

                <div
                  style={{
                    marginTop: '10px',
                    padding: '9px 12px',
                    background: '#eef6ff',
                    borderRadius: '10px',
                    fontSize: '13px',
                    color: '#315f9c'
                  }}
                >
                  {highestBid === null ? (
                    <>
                      Startgebot / Starting Bid:{' '}
                      <strong>
                        {startBid !== null
                          ? `${startBid.toLocaleString('de-LU')} €`
                          : '…'}
                      </strong>
                    </>
                  ) : (
                    <>
                      Erhéijung pro Gebot /
                      Bid increase:{' '}
                      <strong>
                        min. {minIncrease?.toLocaleString('de-LU')} € ·
                        {' '}max. {maxIncrease?.toLocaleString('de-LU')} €
                      </strong>
                    </>
                  )}
                </div>

                {lastBid && (
                  <div style={{ marginTop: '6px' }}>
                    Viregt Gebot / Previous Bid:{' '}
                    <strong style={{ color: '#0f3d91' }}>
                      {Number(lastBid.amount).toLocaleString(
                        'de-LU'
                      )}{' '}
                      €
                    </strong>
                  </div>
                )}
              </div>
            </div>

            <div
              style={{
                ...cardStyle,
                background: '#eef6ff',
                textAlign: 'center'
              }}
            >
              <p style={{ margin: '0 0 8px' }}>
                <strong>Auktiounsenn:</strong>{' '}
                {auctionEnd
                  ? auctionEnd.toLocaleString('lb-LU', {
                      timeZone: 'Europe/Luxembourg',
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : '…'}
              </p>

              <Countdown auctionEnd={auctionEnd} />
            </div>

            <div
              style={{
                ...cardStyle,
                background: '#f7fbff',
                textAlign: 'center'
              }}
            >
              <p
                style={{
                  margin: '0 0 6px',
                  fontSize: '14px',
                  color: '#315f9c'
                }}
              >
                Live Zuschauer / Live Viewers
              </p>

              <p
                style={{
                  margin: 0,
                  fontSize: '30px',
                  fontWeight: 'bold',
                  color: '#0f3d91'
                }}
              >
                {viewerCount}
              </p>
            </div>

            <p
              style={{
                marginTop: '22px',
                fontSize: '16px',
                lineHeight: '1.9',
                maxWidth: '760px',
                marginLeft: 'auto',
                marginRight: 'auto',
                opacity: 0.96,
                textAlign: 'center'
              }}
            >
              <span
                style={{
                  fontWeight: 'bold',
                  fontSize: '22px',
                  display: 'block',
                  marginBottom: '10px'
                }}
              >
                Wëllkomm op der offizieller
                Auktiounssäit vun de Kondschafter ASBL
              </span>

              <span
                style={{
                  fontStyle: 'italic',
                  display: 'block',
                  color: '#1d3557'
                }}
              >
                D’Kondschafter engagéieren sech säit
                ville Jore fir d’Traditiounen an
                d’Liewe ronderëm d’Gréiwemaacher
                Drauwen- a Wäifest.
                <br />
                Mat dëser Auktioun ënnerstëtze mir
                e gudden Zweck a verbannen Konscht,
                Traditioun a Solidaritéit.
              </span>
            </p>

            {!session ? (
              <form
                onSubmit={sendMagicLink}
                style={formBoxStyle}
              >
                <h2 style={{ marginTop: 0 }}>
                  1. E-Mail-Bestätegung
                </h2>

                <p>
                  Fir ze bidden, muss deng E-Mail
                  fir d’éischt confirméiert ginn.
                  <br />
                  To place a bid, please confirm
                  your email first.
                </p>

                <input
                  placeholder="E-Mail *"
                  type="email"
                  value={loginEmail}
                  onChange={e =>
                    setLoginEmail(e.target.value)
                  }
                  style={inputStyle}
                  required
                />

                <button
                  className="auction-button"
                  style={buttonStyle}
                >
                  Bestätegungslink schécken /
                  Send confirmation link
                </button>

                <p
                  style={{
                    fontSize: '13px',
                    color: '#666',
                    marginTop: '10px',
                    lineHeight: '1.5'
                  }}
                >
                  Falls keng E-Mail ukënnt,
                  kontrolléier w.e.g. och däi
                  Spam-Ordner.
                  <br />
                  If you do not receive an email,
                  please also check your spam folder.
                </p>

                {message && (
                  <p>
                    <strong>{message}</strong>
                  </p>
                )}
              </form>
            ) : profileLoading ? (
              <div style={formBoxStyle}>
                <h2 style={{ marginTop: 0 }}>
                  Donnéeë gi gelueden...
                </h2>

                <p>Please wait...</p>
              </div>
            ) : !bidderProfile ? (
              <form
                onSubmit={saveBidderProfile}
                style={formBoxStyle}
              >
                <h2 style={{ marginTop: 0 }}>
                  2. Deng Donnéeën / Your Details
                </h2>

                <p
                  style={{
                    padding: '10px',
                    background: '#eef6ff',
                    borderRadius: '10px',
                    fontSize: '14px'
                  }}
                >
                  Confirméiert E-Mail /
                  Confirmed email:
                  <br />
                  <strong>{session.user.email}</strong>
                </p>

                <input
                  placeholder="Virnumm / First Name *"
                  value={profileForm.firstName}
                  onChange={e =>
                    setProfileForm({
                      ...profileForm,
                      firstName: e.target.value
                    })
                  }
                  style={inputStyle}
                  required
                />

                <input
                  placeholder="Numm / Last Name *"
                  value={profileForm.lastName}
                  onChange={e =>
                    setProfileForm({
                      ...profileForm,
                      lastName: e.target.value
                    })
                  }
                  style={inputStyle}
                  required
                />

                <input
                  placeholder="Strooss + Nummer / Street + Number *"
                  value={profileForm.street}
                  onChange={e =>
                    setProfileForm({
                      ...profileForm,
                      street: e.target.value
                    })
                  }
                  style={inputStyle}
                  required
                />

                <input
                  placeholder="PLZ + Uertschaft / ZIP Code + City *"
                  value={profileForm.city}
                  onChange={e =>
                    setProfileForm({
                      ...profileForm,
                      city: e.target.value
                    })
                  }
                  style={inputStyle}
                  required
                />

                <input
                  placeholder="Telefon / Phone *"
                  type="tel"
                  value={profileForm.phone}
                  onChange={e =>
                    setProfileForm({
                      ...profileForm,
                      phone: e.target.value
                    })
                  }
                  style={inputStyle}
                  required
                />

                <button
                  className="auction-button"
                  style={buttonStyle}
                >
                  Donnéeë späicheren /
                  Save details
                </button>

                <button
                  type="button"
                  onClick={signOut}
                  style={logoutStyle}
                >
                  Ausloggen / Sign out
                </button>

                {message && (
                  <MessageBox message={message} />
                )}
              </form>
            ) : (
              <form
                onSubmit={submitBid}
                style={formBoxStyle}
              >
                <h2 style={{ marginTop: 0 }}>
                  Gebot ofginn / Submit Bid
                </h2>

                <p
                  style={{
                    padding: '10px',
                    background: '#eef6ff',
                    borderRadius: '10px',
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}
                >
                  Confirméiert E-Mail /
                  Confirmed email:
                  <br />
                  <strong>{bidderProfile.email}</strong>
                  <br />
                  Bieter / Bidder:
                  <br />
                  <strong>
                    {bidderProfile.first_name}{' '}
                    {bidderProfile.last_name}
                  </strong>
                </p>

                <div
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    background: '#fff7d6',
                    color: '#604b00',
                    fontSize: '14px',
                    lineHeight: '1.6'
                  }}
                >
                  Erlaabt Gebot / Allowed bid:
                  <br />
                  <strong>
                    {minBid !== null && maxBid !== null
                      ? `${minBid.toLocaleString('de-LU')} € – ${maxBid.toLocaleString('de-LU')} €`
                      : '…'}
                  </strong>
                </div>

                <input
                  placeholder="Gebot an Euro / Bid amount in Euro *"
                  type="number"
                  step="1"
                  min={minBid ?? undefined}
                  max={maxBid ?? undefined}
                  value={bidAmount}
                  onChange={e =>
                    setBidAmount(e.target.value)
                  }
                  style={inputStyle}
                  required
                />

                <button
                  className="auction-button"
                  disabled={auctionClosed || !auctionSettings}
                  style={{
                    ...buttonStyle,
                    background:
                      auctionClosed || !auctionSettings
                        ? '#777'
                        : '#0f3d91',
                    cursor:
                      auctionClosed || !auctionSettings
                        ? 'not-allowed'
                        : 'pointer'
                  }}
                >
                  {auctionClosed
                    ? 'Auktioun eriwwer / Auction ended'
                    : !auctionSettings
                      ? 'Auktiounsdonnéeë gi gelueden / Loading auction settings'
                      : 'Gebot verbindlech ofginn / Submit binding bid *'}
                </button>

                <p
                  style={{
                    fontSize: '12px',
                    lineHeight: '1.6',
                    color: '#555'
                  }}
                >
                  * Mat der Ofginn vun engem Gebot
                  akzeptéiert de Participant
                  d&apos;Dateschutzinformatioun an
                  d&apos;Auktiounsbedingungen.{' '}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#0f3d91',
                      fontWeight: 'bold',
                      textDecoration: 'underline'
                    }}
                  >
                    Dateschutz &amp; Auktiounsbedingungen
                  </a>
                  .
                  <br />
                  * By submitting a bid, the
                  participant accepts the Privacy
                  Policy and Auction Terms.{' '}
                  <a
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#0f3d91',
                      fontWeight: 'bold',
                      textDecoration: 'underline'
                    }}
                  >
                    Privacy Policy &amp; Auction Terms
                  </a>
                  .
                </p>

                <button
                  type="button"
                  onClick={signOut}
                  style={logoutStyle}
                >
                  Ausloggen / Sign out
                </button>

                {message && (
                  <MessageBox message={message} />
                )}
              </form>
            )}
          </div>
        </section>

        <footer
          style={{
            padding: '22px 32px',
            background: '#0f3d91',
            color: 'white',
            fontSize: '14px'
          }}
        >
          <p
            style={{
              textAlign: 'center',
              margin: 0,
              lineHeight: '1.8'
            }}
          >
            <a href="/privacy" style={footerLink}>
              Dateschutz &amp; Auktiounsbedingungen /
              Privacy Policy &amp; Auction Terms
            </a>

            {' · '}

            <a href="/admin" style={footerLink}>
              Admin Login
            </a>
          </p>

          <p
            style={{
              textAlign: 'center',
              marginTop: '16px',
              fontSize: '12px',
              opacity: 0.82
            }}
          >
            © 2026 Kondschafter –
            association sans but lucratif –
            Grevenmacher – All rights reserved.
          </p>

          <div
            style={{
              textAlign: 'right',
              marginTop: '6px'
            }}
          >
            <a
              href="/stream"
              style={{
                color: 'rgba(255,255,255,0.22)',
                textDecoration: 'none',
                fontSize: '11px',
                letterSpacing: '0.5px'
              }}
            >
              Stream
            </a>
          </div>
        </footer>
      </div>
    </main>
  )
}

function MessageBox({
  message
}: {
  message: string
}) {
  const success =
    message.includes('Merci') ||
    message.includes('Thank you')

  return (
    <div
      style={{
        marginTop: '14px',
        padding: '14px',
        borderRadius: '14px',
        background: success
          ? '#e8fff0'
          : '#fff0f0',
        border: success
          ? '1px solid #4caf50'
          : '1px solid #d9534f',
        color: success
          ? '#1b5e20'
          : '#8b0000',
        fontWeight: 'bold',
        textAlign: 'center',
        whiteSpace: 'pre-line'
      }}
    >
      {message.includes('|') ? (
        <>
          <div>{message.split('|')[0]}</div>
          <div style={{ marginTop: '6px' }}>
            {message.split('|')[1]}
          </div>
        </>
      ) : (
        message
      )}
    </div>
  )
}

const cardStyle = {
  padding: '24px',
  borderRadius: '22px',
  background: '#fff',
  border: '1px solid #cfe5ff',
  marginBottom: '20px'
}

const formBoxStyle = {
  display: 'grid',
  gap: '12px',
  padding: '24px',
  borderRadius: '22px',
  background: '#fff',
  border: '1px solid #cfe5ff'
}

const inputStyle = {
  padding: '13px',
  fontSize: '16px',
  border: '1px solid #b7d8ff',
  borderRadius: '12px',
  boxSizing: 'border-box' as const,
  width: '100%'
}

const buttonStyle = {
  padding: '15px',
  background: '#0f3d91',
  color: 'white',
  border: 'none',
  borderRadius: '14px',
  fontSize: '16px',
  fontWeight: 'bold'
}

const logoutStyle = {
  border: 'none',
  background: 'transparent',
  color: '#0f3d91',
  textDecoration: 'underline',
  cursor: 'pointer'
}

const footerLink = {
  color: 'white',
  textDecoration: 'underline'
}

function Countdown({
  auctionEnd
}: {
  auctionEnd: Date | null
}) {
  const [timeLeft, setTimeLeft] = useState('')

  useEffect(() => {
    if (!auctionEnd) {
      setTimeLeft('…')
      return
    }

    const updateCountdown = () => {
      const now = new Date()

      const difference =
        auctionEnd.getTime() - now.getTime()

      if (difference <= 0) {
        setTimeLeft(
          'Auktioun eriwwer / Auction ended'
        )
        return
      }

      const days = Math.floor(
        difference /
          (1000 * 60 * 60 * 24)
      )

      const hours = Math.floor(
        (difference /
          (1000 * 60 * 60)) %
          24
      )

      const minutes = Math.floor(
        (difference /
          (1000 * 60)) %
          60
      )

      const seconds = Math.floor(
        (difference / 1000) % 60
      )

      setTimeLeft(
        `${days} Deeg / Days · ${hours}h ${minutes}m ${seconds}s`
      )
    }

    updateCountdown()

    const interval = setInterval(
      updateCountdown,
      1000
    )

    return () => clearInterval(interval)
  }, [auctionEnd])

  return (
    <p
      style={{
        margin: 0,
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#0f3d91'
      }}
    >
      {timeLeft}
    </p>
  )
}
