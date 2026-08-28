'use client'

import { useEffect, useState } from 'react'
import { createClient, Session } from '@supabase/supabase-js'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'

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

type Bid = {
  id: number
  name: string | null
  address: string | null
  email: string | null
  phone: string | null
  amount: number | string
  language: string | null
  ip_address: string | null
  user_agent: string | null
  created_at: string | null
  source: string | null
  bidder_number: string | null
}

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [emailInput, setEmailInput] = useState('')
  const [loading, setLoading] = useState(true)

  const [bids, setBids] = useState<Bid[]>([])
  const [message, setMessage] = useState('')
  const [viewerCount, setViewerCount] = useState(0)
  const [auctionSettings, setAuctionSettings] =
    useState<AuctionSettings | null>(null)

  const [deleteCode, setDeleteCode] = useState('')
  const [deleteMessage, setDeleteMessage] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [liveBidderNumber, setLiveBidderNumber] =
    useState('')
  const [liveBidAmount, setLiveBidAmount] =
    useState('')
  const [liveBidMessage, setLiveBidMessage] =
    useState('')
  const [liveBidLoading, setLiveBidLoading] =
    useState(false)

  const isAdmin =
    ADMIN_EMAILS.includes(
      session?.user?.email || ''
    )

  const highestBid = bids[0] || null
  const totalBids = bids.length

  const startBid = auctionSettings
    ? Number(auctionSettings.start_bid)
    : null

  const minIncrease = auctionSettings
    ? Number(auctionSettings.min_increase)
    : null

  const maxIncrease = auctionSettings
    ? Number(auctionSettings.max_increase)
    : null

  const minBid =
    startBid === null || minIncrease === null
      ? null
      : highestBid
        ? Number(highestBid.amount) + minIncrease
        : startBid

  const maxBid =
    startBid === null || maxIncrease === null
      ? null
      : highestBid
        ? Number(highestBid.amount) + maxIncrease
        : startBid + maxIncrease

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

  function getInvoiceNumber(
    bid: Bid
  ) {
    return `KA-2026-${String(
      bid.id
    ).padStart(3, '0')}`
  }

  async function sendMagicLink(
    e: React.FormEvent
  ) {
    e.preventDefault()
    setMessage('')

    const { error } =
      await supabase.auth.signInWithOtp({
        email: emailInput,
        options: {
          emailRedirectTo:
            'https://kondschafter-auktion.vercel.app/admin'
        }
      })

    if (error) {
      console.error(
        'Admin magic link failed:',
        error
      )

      setMessage(
        'De Magic Link konnt net geschéckt ginn. ' +
        'Probéier w.e.g. nach eng Kéier.'
      )
      return
    }

    setMessage(
      'Magic Link geschéckt. Kuck w.e.g. deng E-Mail.'
    )
  }

  async function loadAuctionSettings() {
    const { data, error } =
      await supabase.rpc(
        'get_auction_settings'
      )

    if (error) {
      console.error(
        'Auction settings load failed:',
        error
      )

      setMessage(
        'D’Auktiounsdonnéeë konnten net geluede ginn.'
      )
      return
    }

    const settings =
      (data?.[0] || null) as AuctionSettings | null

    setAuctionSettings(settings)
  }

  async function loadBids() {
    const { data, error } =
      await supabase.rpc(
        'admin_get_bids'
      )

    if (error) {
      console.error(
        'Admin bids load failed:',
        error
      )

      setMessage(
        'D’Geboter konnten net geluede ginn.'
      )
      return
    }

    setBids(
      (data || []) as Bid[]
    )
  }

  useEffect(() => {
    const code =
      new URLSearchParams(
        window.location.search
      ).get('code')

    if (code) {
      supabase.auth
        .exchangeCodeForSession(code)
        .then(({ data, error }) => {
          if (!error) {
            setSession(data.session)

            window.history.replaceState(
              {},
              document.title,
              '/admin'
            )
          } else {
            console.error(
              'Admin code exchange failed:',
              error
            )
          }

          setLoading(false)
        })
    } else {
      supabase.auth
        .getSession()
        .then(({ data }) => {
          setSession(data.session)
          setLoading(false)
        })
    }

    const authListener =
      supabase.auth.onAuthStateChange(
        (_event, currentSession) => {
          setSession(currentSession)
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

    /*
     * Aktuelle Stand direkt lueden.
     */
    loadAuctionSettings()
    loadBids()

    /*
     * 2-Sekonnen-Polling bleift
     * als Sécherheetsnetz bestoen.
     */
    const bidRefreshInterval =
      setInterval(
        () => {
          loadBids()
        },
        2000
      )

    /*
     * Nei Online- oder Live-Geboter
     * direkt iwwer Broadcast empfänken.
     */
    const bidChannel =
      supabase.channel(
        'auction-bids'
      )

    bidChannel
      .on(
        'broadcast',
        {
          event: 'new_bid'
        },
        () => {
          loadBids()
        }
      )
      .subscribe()

    /*
     * Live-Zuschauer.
     */
    const viewerChannel =
      supabase.channel(
        'auction-viewers'
      )

    viewerChannel
      .on(
        'presence',
        {
          event: 'sync'
        },
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
      .subscribe()

    return () => {
      clearInterval(
        bidRefreshInterval
      )

      supabase.removeChannel(
        bidChannel
      )

      supabase.removeChannel(
        viewerChannel
      )
    }
  }, [isAdmin])

  function createInvoiceEmail(
    bid: Bid
  ) {
    if (!bid.email) {
      alert(
        'Fir dëst Gebot ass keng E-Mail-Adress disponibel.'
      )
      return
    }

    const invoiceNumber =
      getInvoiceNumber(bid)

    const amount =
      Number(
        bid.amount
      ).toLocaleString('de-LU')

    const subject =
      `Rechnung ${invoiceNumber} - Kondschafter Auktioun 2026`

    const body = `
Moien ${bid.name || ''},

hei sinn d'Donnéeë fir deng Rechnung fir d'Kondschafter Auktioun 2026.

Betrag:
${amount} €

Rechnungsnummer:
${invoiceNumber}

D'PDF-Rechnung kann separat un dës E-Mail ugehaange ginn.

Merci villmools fir deng Ënnerstëtzung.

--------------------------------------------------

Hello ${bid.name || ''},

below are the details for your invoice for the Kondschafter Auction 2026.

Amount:
${amount} €

Invoice Number:
${invoiceNumber}

The PDF invoice can be attached separately to this email.

Thank you very much for your support.

Kondschafter ASBL
`.trim()

    window.location.href =
      `mailto:${bid.email}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`
  }

  async function deleteBid(
    id: number
  ) {
    const confirmed =
      confirm(
        'Wëlls du dëst Gebot wierklech läschen?'
      )

    if (!confirmed) return

    const { error } =
      await supabase.rpc(
        'admin_delete_bid',
        {
          p_id: id
        }
      )

    if (error) {
      console.error(
        'Bid deletion failed:',
        error
      )

      setMessage(
        'D’Gebot konnt net geläscht ginn.'
      )
      return
    }

    setMessage(
      'D’Gebot gouf geläscht.'
    )

    await loadBids()
  }

  function exportExcel() {
    const rows =
      bids.map(
        (bid, index) => ({
          Rang: index + 1,
          Gebot: Number(
            bid.amount
          ),
          Quelle:
            bid.source || 'online',
          Bieternummer:
            bid.bidder_number || '',
          Name:
            bid.name || '',
          Adresse:
            bid.address || '',
          Email:
            bid.email || '',
          Telefon:
            bid.phone || '',
          IP:
            bid.ip_address || '',
          Browser:
            bid.user_agent || '',
          Datum:
            bid.created_at
              ? new Date(
                  bid.created_at
                ).toLocaleString(
                  'de-LU'
                )
              : ''
        })
      )

    const worksheet =
      XLSX.utils.json_to_sheet(
        rows
      )

    worksheet['!cols'] = [
      { wch: 8 },
      { wch: 12 },
      { wch: 12 },
      { wch: 14 },
      { wch: 25 },
      { wch: 35 },
      { wch: 30 },
      { wch: 18 },
      { wch: 18 },
      { wch: 60 },
      { wch: 22 }
    ]

    const workbook =
      XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      'Gebote'
    )

    XLSX.writeFile(
      workbook,
      'kondschafter-gebote.xlsx'
    )
  }

  async function createInvoicePDF(
    bid: Bid
  ) {
    if (bid.source === 'live') {
      alert(
        'Fir Live-Geboter ouni komplett Kontaktdonnéeë kann hei keng Rechnung erstallt ginn.'
      )
      return
    }

    const doc = new jsPDF()

    const invoiceNumber =
      getInvoiceNumber(bid)

    const amount =
      Number(
        bid.amount
      ).toLocaleString('de-LU')

    const today =
      new Date()
        .toLocaleDateString(
          'de-LU'
        )

    try {
      const logoUrl =
        'https://raw.githubusercontent.com/pleinbob-arch/kondschafter-auktion/main/logo.png'

      const response =
        await fetch(logoUrl)

      if (!response.ok) {
        throw new Error(
          'Logo could not be loaded'
        )
      }

      const blob =
        await response.blob()

      const reader =
        new FileReader()

      reader.onloadend = () => {
        const logoBase64 =
          reader.result as string

        doc.setFillColor(
          15,
          61,
          145
        )

        doc.rect(
          0,
          0,
          210,
          40,
          'F'
        )

        doc.addImage(
          logoBase64,
          'PNG',
          16,
          8,
          24,
          24
        )

        doc.setTextColor(
          255,
          255,
          255
        )

        doc.setFontSize(22)

        doc.text(
          'Kondschafter ASBL',
          48,
          18
        )

        doc.setFontSize(12)

        doc.text(
          'Rechnung / Invoice',
          48,
          29
        )

        doc.setTextColor(
          0,
          0,
          0
        )

        doc.setFontSize(11)

        doc.text(
          'Kondschafter - association sans but lucratif',
          20,
          58
        )

        doc.text(
          'R.C.S.L. F10056',
          20,
          65
        )

        doc.text(
          '1A, Rue Kummert',
          20,
          72
        )

        doc.text(
          'L-6743 Grevenmacher',
          20,
          79
        )

        doc.text(
          'Luxembourg',
          20,
          86
        )

        doc.text(
          'Rechnungsnummer / Invoice Number:',
          115,
          58
        )

        doc.text(
          invoiceNumber,
          115,
          65
        )

        doc.text(
          'Datum / Date:',
          115,
          77
        )

        doc.text(
          today,
          115,
          84
        )

        doc.setDrawColor(
          15,
          61,
          145
        )

        doc.line(
          20,
          98,
          190,
          98
        )

        doc.setTextColor(
          15,
          61,
          145
        )

        doc.setFontSize(13)

        doc.text(
          'Keefer / Buyer',
          20,
          113
        )

        doc.setTextColor(
          0,
          0,
          0
        )

        doc.setFontSize(11)

        doc.text(
          bid.name || '',
          20,
          123
        )

        doc.text(
          bid.address || '',
          20,
          131
        )

        doc.text(
          bid.email || '',
          20,
          139
        )

        doc.line(
          20,
          146,
          190,
          146
        )

        doc.setFontSize(13)

        doc.setTextColor(
          15,
          61,
          145
        )

        doc.text(
          'Beschreiwung / Description',
          20,
          160
        )

        doc.setTextColor(
          0,
          0,
          0
        )

        doc.setFontSize(11)

        doc.text(
          'Konschtwierk - Kondschafter Auktioun 2026',
          20,
          170
        )

        doc.text(
          'Artwork - Kondschafter Auction 2026',
          20,
          178
        )

        doc.line(
          20,
          184,
          190,
          184
        )

        doc.setFillColor(
          238,
          246,
          255
        )

        doc.roundedRect(
          45,
          194,
          120,
          30,
          4,
          4,
          'F'
        )

        doc.setTextColor(
          15,
          61,
          145
        )

        doc.setFontSize(13)

        doc.text(
          'Total / Amount',
          105,
          204,
          {
            align: 'center'
          }
        )

        doc.setFontSize(24)

        doc.text(
          `${amount} EUR`,
          105,
          216,
          {
            align: 'center'
          }
        )

        doc.setTextColor(
          15,
          61,
          145
        )

        doc.setFontSize(13)

        doc.text(
          'Bezuelung / Payment',
          20,
          244
        )

        doc.setTextColor(
          0,
          0,
          0
        )

        doc.setFontSize(11)

        doc.text(
          'Kontoinhaber / Account Holder: Kondschafter - association sans but lucratif',
          20,
          254
        )

        doc.text(
          'IBAN: LU15 0099 7800 0034 9316',
          20,
          262
        )

        doc.text(
          'BIC: CCRALULLXXX',
          20,
          270
        )

        doc.text(
          `Verwendungszweck / Payment Reference: ${invoiceNumber}`,
          20,
          278
        )

        doc.setFillColor(
          15,
          61,
          145
        )

        doc.rect(
          0,
          283,
          210,
          14,
          'F'
        )

        doc.setTextColor(
          255,
          255,
          255
        )

        doc.setFontSize(7)

        doc.text(
          'Kondschafter - association sans but lucratif · R.C.S.L. F10056 · 1A, Rue Kummert · L-6743 Grevenmacher · Luxembourg',
          105,
          291,
          {
            align: 'center'
          }
        )

        const safeName =
          (bid.name || 'Bieter')
            .replace(
              /[^a-zA-Z0-9äöüÄÖÜéèëÉÈË_-]/g,
              '-'
            )

        doc.save(
          `${invoiceNumber}-${safeName}.pdf`
        )
      }

      reader.readAsDataURL(
        blob
      )
    } catch (error) {
      console.error(
        'Invoice PDF creation failed:',
        error
      )

      alert(
        'D’PDF-Rechnung konnt net erstallt ginn.'
      )
    }
  }

  async function submitLiveBid() {
    setLiveBidMessage('')

    if (
      !liveBidderNumber.trim()
    ) {
      setLiveBidMessage(
        'Gëff w.e.g. eng Bieternummer an.'
      )
      return
    }

    if (
      !liveBidAmount.trim()
    ) {
      setLiveBidMessage(
        'Gëff w.e.g. e Gebotsbetrag an.'
      )
      return
    }

    const amount =
      Number(
        liveBidAmount
      )

    if (
      !Number.isFinite(amount) ||
      amount <= 0
    ) {
      setLiveBidMessage(
        'Gëff w.e.g. e valabele Gebotsbetrag an.'
      )
      return
    }

    if (
      minBid === null ||
      maxBid === null
    ) {
      setLiveBidMessage(
        'D’Auktiounsdonnéeë konnten nach net geluede ginn.'
      )
      return
    }

    if (
      amount < minBid ||
      amount > maxBid
    ) {
      setLiveBidMessage(
        `D'Gebot muss tëscht ${minBid.toLocaleString(
          'de-LU'
        )} € an ${maxBid.toLocaleString(
          'de-LU'
        )} € leien.`
      )
      return
    }

    const confirmed =
      confirm(
        `Live-Gebot wierklech späicheren?\n\n` +
        `Bieter #${liveBidderNumber.trim()}\n` +
        `Gebot: ${amount.toLocaleString('de-LU')} €`
      )

    if (!confirmed) return

    setLiveBidLoading(true)

    try {
      const {
        data: sessionData
      } =
        await supabase.auth.getSession()

      const accessToken =
        sessionData.session
          ?.access_token

      if (!accessToken) {
        setLiveBidMessage(
          'D’Admin-Sessioun ass net méi aktiv. ' +
          'Logg dech w.e.g. nei an.'
        )
        return
      }

      const response =
        await fetch(
          '/api/admin/live-bid',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
              Authorization:
                `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              bidderNumber:
                liveBidderNumber.trim(),
              amount
            })
          }
        )

      const result =
        await response.json()

      if (!response.ok) {
        const errorText =
          result?.error || ''

        if (
          errorText.includes(
            'BID_TOO_LOW'
          )
        ) {
          setLiveBidMessage(
            'D’Gebot ass ze niddreg. ' +
            'De Gebotsstand gouf eventuell an der Tëschenzäit erhéicht.'
          )

          await loadBids()
          return
        }

        if (
          errorText.includes(
            'BID_TOO_HIGH'
          )
        ) {
          setLiveBidMessage(
            'D’Gebot ass ze héich. ' +
            `Déi maximal Erhéijung ass ${maxIncrease?.toLocaleString('de-LU')} €.`
          )

          await loadBids()
          return
        }

        if (
          errorText.includes(
            'AUCTION_ENDED'
          )
        ) {
          setLiveBidMessage(
            'D’Auktioun ass eriwwer.'
          )
          return
        }

        setLiveBidMessage(
          errorText ||
          'D’Live-Gebot konnt net gespäichert ginn.'
        )
        return
      }

      setLiveBidMessage(
        `Live-Gebot vum Bieter #${liveBidderNumber.trim()} ` +
        `iwwer ${amount.toLocaleString('de-LU')} € gouf gespäichert.`
      )

      setLiveBidderNumber('')
      setLiveBidAmount('')

      await loadBids()
    } catch (error) {
      console.error(
        'Live bid request failed:',
        error
      )

      setLiveBidMessage(
        'Serverfehler beim Späichere vum Live-Gebot.'
      )
    } finally {
      setLiveBidLoading(false)
    }
  }

  async function deleteAllBids() {
    setDeleteMessage('')

    if (
      !deleteCode.trim()
    ) {
      setDeleteMessage(
        'Gëff w.e.g. de Sécherheetscode an.'
      )
      return
    }

    const confirmed =
      confirm(
        'Wierklech ALL Geboter läschen? ' +
        'Dës Aktioun kann net réckgängeg gemaach ginn.'
      )

    if (!confirmed) return

    const confirmationText =
      prompt(
        'Fir ze bestätegen, gëff w.e.g. LÄSCHEN an:'
      )

    if (
      confirmationText !==
      'LÄSCHEN'
    ) {
      setDeleteMessage(
        'Läschen ofgebrach. ' +
        'D’Bestätegung "LÄSCHEN" gouf net korrekt aginn.'
      )
      return
    }

    setDeleteLoading(true)

    try {
      const {
        data: sessionData
      } =
        await supabase.auth.getSession()

      const accessToken =
        sessionData.session
          ?.access_token

      if (!accessToken) {
        setDeleteMessage(
          'D’Admin-Sessioun ass net méi aktiv. ' +
          'Logg dech w.e.g. nei an.'
        )
        return
      }

      const response =
        await fetch(
          '/api/admin/delete-bids',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
              Authorization:
                `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              code:
                deleteCode.trim()
            })
          }
        )

      const result =
        await response.json()

      if (!response.ok) {
        setDeleteMessage(
          result?.error ||
          'D’Geboter konnten net geläscht ginn.'
        )
        return
      }

      setDeleteMessage(
        'All Geboter goufe geläscht.'
      )

      setDeleteCode('')

      await loadBids()
    } catch (error) {
      console.error(
        'Delete all bids request failed:',
        error
      )

      setDeleteMessage(
        'Serverfehler beim Läsche vun de Geboter.'
      )
    } finally {
      setDeleteLoading(false)
    }
  }

  if (loading) {
    return (
      <main
        style={
          pageCenterStyle
        }
      >
        <div
          style={
            loginBoxStyle
          }
        >
          <h1
            style={
              titleStyle
            }
          >
            Adminberäich
          </h1>

          <p>
            Gëtt gelueden...
          </p>
        </div>
      </main>
    )
  }

  if (!session) {
    return (
      <main
        style={
          pageCenterStyle
        }
      >
        <form
          onSubmit={
            sendMagicLink
          }
          style={
            loginBoxStyle
          }
        >
          <h1
            style={
              titleStyle
            }
          >
            Admin Login
          </h1>

          <p>
            Login per Magic Link.
            Nëmmen autoriséiert
            Admin-E-Mail-Adresse
            kréien Zougang.
          </p>

          <input
            type="email"
            placeholder="Admin E-Mail"
            value={
              emailInput
            }
            onChange={
              e =>
                setEmailInput(
                  e.target.value
                )
            }
            style={
              inputStyle
            }
            required
          />

          <button
            type="submit"
            style={
              buttonStyle
            }
          >
            Magic Link schécken
          </button>

          {message && (
            <p>
              <strong>
                {message}
              </strong>
            </p>
          )}
        </form>
      </main>
    )
  }

  if (!isAdmin) {
    return (
      <main
        style={
          pageCenterStyle
        }
      >
        <div
          style={
            loginBoxStyle
          }
        >
          <h1
            style={
              titleStyle
            }
          >
            Keen Zougang
          </h1>

          <p>
            Deng E-Mail ass ageloggt,
            mee net als Admin
            autoriséiert:
          </p>

          <p>
            <strong>
              {
                session.user
                  .email
              }
            </strong>
          </p>

          <button
            onClick={() =>
              supabase.auth.signOut()
            }
            style={
              buttonStyle
            }
          >
            Ausloggen
          </button>
        </div>
      </main>
    )
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '20px',
        background: '#eef6ff',
        fontFamily:
          'Arial, sans-serif'
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto'
        }}
      >
        {/* HEADER */}
        <div
          style={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems:
              'center',
            marginBottom:
              '24px',
            gap: '12px',
            flexWrap:
              'wrap'
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                color:
                  '#0f3d91'
              }}
            >
              Kondschafter Adminberäich
            </h1>

            <p
              style={{
                marginBottom:
                  0
              }}
            >
              Ageloggt als:{' '}
              <strong>
                {
                  session.user
                    .email
                }
              </strong>
            </p>
          </div>

          <div
            style={{
              display:
                'flex',
              gap: '10px',
              flexWrap:
                'wrap'
            }}
          >
            <button
              onClick={
                exportExcel
              }
              style={
                buttonStyle
              }
            >
              Excel Export
            </button>

            <a
              href="/admin/status"
              style={
                buttonStyle
              }
            >
              Systemstatus
            </a>

            <button
              onClick={() =>
                supabase.auth.signOut()
              }
              style={{
                ...buttonStyle,
                background:
                  '#777'
              }}
            >
              Ausloggen
            </button>
          </div>
        </div>

        {/* DASHBOARD */}
        <div
          style={{
            display:
              'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom:
              '24px'
          }}
        >
          <DashboardCard
            title={
              highestBid
                ? 'Héichstgebot'
                : 'Startgebot'
            }
            value={
              highestBid
                ? `${Number(
                    highestBid.amount
                  ).toLocaleString(
                    'de-LU'
                  )} €`
                : startBid !== null
                  ? `${startBid.toLocaleString(
                      'de-LU'
                    )} €`
                  : '…'
            }
            detail={
              highestBid
                ? highestBid.name ||
                  (
                    highestBid.source ===
                    'live'
                      ? `Live-Bieter #${highestBid.bidder_number || '—'}`
                      : '—'
                  )
                : 'Nach kee Gebot'
            }
          />

          <DashboardCard
            title="Total Geboter"
            value={
              String(
                totalBids
              )
            }
            detail="All enregistréiert Geboter"
          />

          <DashboardCard
            title="Bieter"
            value={
              String(
                uniqueBidders
              )
            }
            detail="Online + Live-Bieter"
          />

          <DashboardCard
            title="Live Zuschauer"
            value={
              String(
                viewerCount
              )
            }
            detail="Aktuell op der Auktiounssäit"
          />
        </div>

        {/* LIVE-AUKTIOUN */}
        <div
          style={{
            marginBottom:
              '28px',
            padding:
              '22px',
            border:
              '2px solid #0f3d91',
            borderRadius:
              '18px',
            background:
              '#eef6ff'
          }}
        >
          <h2
            style={{
              margin:
                '0 0 8px',
              color:
                '#0f3d91'
            }}
          >
            Live-Auktioun /
            Live Auction
          </h2>

          <p
            style={{
              margin:
                '0 0 18px',
              color:
                '#555'
            }}
          >
            Gebot vum Auktionator
            manuell erfaassen.
          </p>

          <div
            style={{
              display:
                'flex',
              gap:
                '12px',
              flexWrap:
                'wrap',
              alignItems:
                'flex-end'
            }}
          >
            <div
              style={{
                flex:
                  '1 1 180px'
              }}
            >
              <label
                style={{
                  display:
                    'block',
                  marginBottom:
                    '6px',
                  fontWeight:
                    'bold'
                }}
              >
                Bieternummer
              </label>

              <input
                type="text"
                inputMode="numeric"
                placeholder="z. B. 17"
                value={
                  liveBidderNumber
                }
                onChange={
                  e =>
                    setLiveBidderNumber(
                      e.target.value
                    )
                }
                disabled={
                  liveBidLoading ||
                  !auctionSettings
                }
                style={{
                  width:
                    '100%',
                  padding:
                    '12px',
                  border:
                    '1px solid #9bbce8',
                  borderRadius:
                    '10px',
                  boxSizing:
                    'border-box',
                  fontSize:
                    '16px'
                }}
              />
            </div>

            <div
              style={{
                flex:
                  '1 1 220px'
              }}
            >
              <label
                style={{
                  display:
                    'block',
                  marginBottom:
                    '6px',
                  fontWeight:
                    'bold'
                }}
              >
                Gebot / Bid (€)
              </label>

              <input
                type="number"
                min={minBid ?? undefined}
                max={maxBid ?? undefined}
                step="1"
                placeholder={
                  minBid !== null
                    ? `z. B. ${minBid}`
                    : 'Auktiounsdonnéeë gi gelueden...'
                }
                value={
                  liveBidAmount
                }
                onChange={
                  e =>
                    setLiveBidAmount(
                      e.target.value
                    )
                }
                disabled={
                  liveBidLoading ||
                  !auctionSettings
                }
                style={{
                  width:
                    '100%',
                  padding:
                    '12px',
                  border:
                    '1px solid #9bbce8',
                  borderRadius:
                    '10px',
                  boxSizing:
                    'border-box',
                  fontSize:
                    '16px'
                }}
              />
            </div>

            <button
              type="button"
              onClick={
                submitLiveBid
              }
              disabled={
                liveBidLoading ||
                !auctionSettings
              }
              style={{
                padding:
                  '13px 20px',
                border:
                  'none',
                borderRadius:
                  '12px',
                background:
                  liveBidLoading ||
                  !auctionSettings
                    ? '#999'
                    : '#0f3d91',
                color:
                  'white',
                fontWeight:
                  'bold',
                fontSize:
                  '16px',
                cursor:
                  liveBidLoading ||
                  !auctionSettings
                    ? 'not-allowed'
                    : 'pointer',
                minHeight:
                  '46px'
              }}
            >
              {
                liveBidLoading
                  ? 'Gëtt gespäichert...'
                  : !auctionSettings
                    ? 'AUKTIOUNSDONNÉEË GI GELUEDEN...'
                    : 'LIVE-GEBOT SPÄICHEREN'
              }
            </button>
          </div>

          <p
            style={{
              margin:
                '14px 0 0',
              fontSize:
                '14px',
              color:
                '#555'
            }}
          >
            {!auctionSettings ? (
              <>Auktiounsdonnéeë gi gelueden...</>
            ) : highestBid ? (
              <>
                Erlaabt
                Erhéijung:{' '}
                <strong>
                  min. {minIncrease?.toLocaleString('de-LU')} € ·
                  {' '}max. {maxIncrease?.toLocaleString('de-LU')} €
                </strong>
              </>
            ) : (
              <>
                Startgebot:{' '}
                <strong>
                  {startBid !== null
                    ? `${startBid.toLocaleString('de-LU')} €`
                    : '…'}
                </strong>
              </>
            )}
          </p>

          <p
            style={{
              margin:
                '8px 0 0',
              fontSize:
                '14px',
              color:
                '#315f9c'
            }}
          >
            Aktuell erlaabt:{' '}

            <strong>
              {
                minBid !== null
                  ? `${minBid.toLocaleString(
                      'de-LU'
                    )} €`
                  : '…'
              }
            </strong>

            {' '}bis{' '}

            <strong>
              {
                maxBid !== null
                  ? `${maxBid.toLocaleString(
                      'de-LU'
                    )} €`
                  : '…'
              }
            </strong>
          </p>

          {liveBidMessage && (
            <div
              style={{
                marginTop:
                  '14px',
                padding:
                  '12px',
                borderRadius:
                  '10px',
                background:
                  liveBidMessage.includes(
                    'gouf gespäichert'
                  )
                    ? '#e8fff0'
                    : '#fff0f0',
                color:
                  liveBidMessage.includes(
                    'gouf gespäichert'
                  )
                    ? '#1b5e20'
                    : '#8b0000',
                fontWeight:
                  'bold'
              }}
            >
              {
                liveBidMessage
              }
            </div>
          )}
        </div>

        {message && (
          <p>
            <strong>
              {message}
            </strong>
          </p>
        )}

        {/* GEBOTSLËSCHT */}
        <div
          style={{
            display:
              'grid',
            gap:
              '16px'
          }}
        >
          {bids.map(
            (bid, index) => (
              <div
                key={
                  bid.id
                }
                style={{
                  background:
                    index === 0
                      ? '#fff7d6'
                      : 'white',
                  border:
                    index === 0
                      ? '2px solid #e6b800'
                      : '1px solid #cfe5ff',
                  borderRadius:
                    '18px',
                  padding:
                    '18px',
                  boxShadow:
                    '0 6px 18px rgba(0,0,0,0.06)'
                }}
              >
                <div
                  style={{
                    display:
                      'flex',
                    justifyContent:
                      'space-between',
                    gap:
                      '12px',
                    flexWrap:
                      'wrap',
                    marginBottom:
                      '12px'
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin:
                          '0 0 4px',
                        color:
                          '#0f3d91',
                        fontWeight:
                          'bold'
                      }}
                    >
                      #{index + 1}
                      {index === 0
                        ? ' · Aktuell féierend'
                        : ''}
                    </p>

                    <h2
                      style={{
                        margin: 0,
                        fontSize:
                          '28px',
                        color:
                          '#0f3d91'
                      }}
                    >
                      {Number(
                        bid.amount
                      ).toLocaleString(
                        'de-LU'
                      )}{' '}
                      €
                    </h2>

                    {bid.source ===
                      'live' && (
                      <p
                        style={{
                          margin:
                            '6px 0 0',
                          color:
                            '#b05a00',
                          fontWeight:
                            'bold',
                          fontSize:
                            '13px'
                        }}
                      >
                        LIVE ·
                        Bieter #
                        {
                          bid.bidder_number
                        }
                      </p>
                    )}
                  </div>

                  {index < 3 &&
                    bid.source !==
                      'live' && (
                      <>
                        <button
                          onClick={() =>
                            createInvoiceEmail(
                              bid
                            )
                          }
                          style={{
                            padding:
                              '9px 13px',
                            border:
                              'none',
                            borderRadius:
                              '10px',
                            background:
                              '#0f3d91',
                            color:
                              'white',
                            cursor:
                              'pointer',
                            height:
                              'fit-content'
                          }}
                        >
                          E-Mail virbereeden
                        </button>

                        <button
                          onClick={() =>
                            createInvoicePDF(
                              bid
                            )
                          }
                          style={{
                            padding:
                              '9px 13px',
                            border:
                              'none',
                            borderRadius:
                              '10px',
                            background:
                              '#1f7a1f',
                            color:
                              'white',
                            cursor:
                              'pointer',
                            height:
                              'fit-content'
                          }}
                        >
                          PDF Rechnung
                        </button>
                      </>
                    )}

                  <button
                    onClick={() =>
                      deleteBid(
                        bid.id
                      )
                    }
                    style={{
                      padding:
                        '9px 13px',
                      border:
                        'none',
                      borderRadius:
                        '10px',
                      background:
                        '#d62828',
                      color:
                        'white',
                      cursor:
                        'pointer',
                      height:
                        'fit-content'
                    }}
                  >
                    Läschen
                  </button>
                </div>

                <div
                  style={{
                    display:
                      'grid',
                    gridTemplateColumns:
                      'repeat(auto-fit, minmax(220px, 1fr))',
                    gap:
                      '12px',
                    fontSize:
                      '14px'
                  }}
                >
                  <Info
                    label="Typ"
                    value={
                      bid.source ===
                      'live'
                        ? `Live · Bieter #${bid.bidder_number || '—'}`
                        : 'Online'
                    }
                  />

                  <Info
                    label="Name"
                    value={
                      bid.name ||
                      '—'
                    }
                  />

                  <Info
                    label="Adress"
                    value={
                      bid.address ||
                      '—'
                    }
                  />

                  <Info
                    label="E-Mail"
                    value={
                      bid.email ||
                      '—'
                    }
                  />

                  <Info
                    label="Telefon"
                    value={
                      bid.phone ||
                      '—'
                    }
                  />

                  <Info
                    label="IP"
                    value={
                      bid.ip_address ||
                      '—'
                    }
                  />

                  <Info
                    label="Datum"
                    value={
                      bid.created_at
                        ? new Date(
                            bid.created_at
                          ).toLocaleString(
                            'de-LU'
                          )
                        : '—'
                    }
                  />
                </div>

                <details
                  style={{
                    marginTop:
                      '12px'
                  }}
                >
                  <summary
                    style={{
                      cursor:
                        'pointer',
                      color:
                        '#0f3d91',
                      fontWeight:
                        'bold'
                    }}
                  >
                    Browser /
                    User Agent
                  </summary>

                  <p
                    style={{
                      fontSize:
                        '12px',
                      overflowWrap:
                        'anywhere',
                      background:
                        '#f7fbff',
                      padding:
                        '10px',
                      borderRadius:
                        '10px'
                    }}
                  >
                    {
                      bid.user_agent ||
                      '—'
                    }
                  </p>
                </details>
              </div>
            )
          )}
        </div>

        {/* GEFAHRENZON */}
        <div
          style={{
            marginTop:
              '32px',
            padding:
              '22px',
            border:
              '2px solid #d62828',
            borderRadius:
              '18px',
            background:
              '#fff5f5'
          }}
        >
          <h2
            style={{
              marginTop:
                0,
              color:
                '#b00020'
            }}
          >
            Gefahrenzon
          </h2>

          <p
            style={{
              marginTop:
                0,
              color:
                '#555'
            }}
          >
            Hei kënnen all Geboter
            gläichzäiteg geläscht
            ginn. Dës Aktioun kann
            net réckgängeg gemaach
            ginn.
          </p>

          <input
            type="password"
            placeholder="Sécherheetscode"
            value={
              deleteCode
            }
            onChange={
              e =>
                setDeleteCode(
                  e.target.value
                )
            }
            disabled={
              deleteLoading
            }
            style={{
              width:
                '100%',
              maxWidth:
                '420px',
              padding:
                '12px',
              borderRadius:
                '10px',
              border:
                '1px solid #d62828',
              marginBottom:
                '12px',
              boxSizing:
                'border-box'
            }}
          />

          <div>
            <button
              onClick={
                deleteAllBids
              }
              disabled={
                deleteLoading
              }
              style={{
                padding:
                  '12px 18px',
                border:
                  'none',
                borderRadius:
                  '12px',
                background:
                  deleteLoading
                    ? '#999'
                    : '#d62828',
                color:
                  'white',
                fontWeight:
                  'bold',
                cursor:
                  deleteLoading
                    ? 'not-allowed'
                    : 'pointer'
              }}
            >
              {
                deleteLoading
                  ? 'Geboter ginn geläscht...'
                  : 'All Geboter läschen'
              }
            </button>
          </div>

          {deleteMessage && (
            <p
              style={{
                marginTop:
                  '14px',
                fontWeight:
                  'bold',
                color:
                  deleteMessage.includes(
                    'goufe geläscht'
                  )
                    ? '#1b5e20'
                    : '#8b0000'
              }}
            >
              {
                deleteMessage
              }
            </p>
          )}
        </div>
      </div>
    </main>
  )
}

function DashboardCard({
  title,
  value,
  detail
}: {
  title: string
  value: string
  detail: string
}) {
  return (
    <div
      style={{
        background:
          'white',
        border:
          '1px solid #cfe5ff',
        borderRadius:
          '18px',
        padding:
          '20px',
        boxShadow:
          '0 6px 18px rgba(0,0,0,0.06)'
      }}
    >
      <p
        style={{
          margin:
            '0 0 8px',
          color:
            '#315f9c',
          fontSize:
            '14px'
        }}
      >
        {title}
      </p>

      <p
        style={{
          margin:
            0,
          fontSize:
            '30px',
          fontWeight:
            'bold',
          color:
            '#0f3d91'
        }}
      >
        {value}
      </p>

      <p
        style={{
          margin:
            '8px 0 0',
          fontSize:
            '13px',
          color:
            '#666'
        }}
      >
        {detail}
      </p>
    </div>
  )
}

function Info({
  label,
  value
}: {
  label: string
  value: string
}) {
  return (
    <div>
      <p
        style={{
          margin:
            '0 0 3px',
          fontSize:
            '12px',
          color:
            '#666',
          fontWeight:
            'bold'
        }}
      >
        {label}
      </p>

      <p
        style={{
          margin:
            0,
          overflowWrap:
            'anywhere'
        }}
      >
        {value}
      </p>
    </div>
  )
}

const pageCenterStyle = {
  minHeight:
    '100vh',
  display:
    'flex',
  justifyContent:
    'center',
  alignItems:
    'center',
  background:
    '#eef6ff',
  fontFamily:
    'Arial, sans-serif',
  padding:
    '24px'
}

const loginBoxStyle = {
  background:
    'white',
  padding:
    '40px',
  borderRadius:
    '24px',
  width:
    '100%',
  maxWidth:
    '460px',
  boxShadow:
    '0 10px 30px rgba(0,0,0,0.12)'
}

const titleStyle = {
  marginTop:
    0,
  color:
    '#0f3d91',
  textAlign:
    'center' as const
}

const inputStyle = {
  width:
    '100%',
  padding:
    '14px',
  borderRadius:
    '12px',
  border:
    '1px solid #b7d8ff',
  marginBottom:
    '16px',
  fontSize:
    '16px',
  boxSizing:
    'border-box' as const
}

const buttonStyle = {
  display:
    'inline-block',
  padding:
    '12px 18px',
  background:
    '#0f3d91',
  color:
    'white',
  border:
    'none',
  borderRadius:
    '12px',
  fontWeight:
    'bold',
  cursor:
    'pointer',
  textDecoration:
    'none'
}
