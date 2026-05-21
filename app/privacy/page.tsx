export default function PrivacyPage() {
  return (
    <main style={{
      minHeight:'100vh',
      padding:'30px',
      fontFamily:'Arial, sans-serif',
      background:'linear-gradient(180deg, #dcefff 0%, #f7fbff 100%)'
    }}>

      <div style={{
        maxWidth:'1000px',
        margin:'0 auto',
        background:'white',
        borderRadius:'28px',
        overflow:'hidden',
        boxShadow:'0 15px 50px rgba(0,0,0,0.12)'
      }}>

        <section style={{
          padding:'50px 30px',
          textAlign:'center',
          background:'linear-gradient(135deg, #0f3d91, #6bb6ff)',
          color:'white'
        }}>
          <h1 style={{ margin:0, fontSize:'clamp(34px, 8vw, 58px)', lineHeight:'1.1' }}>
            Dateschutz & Auktiounsbedingungen
          </h1>

          <h2 style={{ marginTop:'14px', fontWeight:'normal', fontSize:'clamp(18px, 4vw, 28px)' }}>
            Privacy Policy & Auction Terms
          </h2>
        </section>

        <section style={{ padding:'40px', lineHeight:'1.8', color:'#16324f' }}>

          <SectionTitle title="Lëtzebuergesch" />

          <Card>
            <SubTitle title="Verantwortlech Organisatioun" />
            <p>
              <strong>Kondschafter – association sans but lucratif</strong><br />
              1A, Rue Kummert<br />
              L-6743 Gréiwemaacher<br />
              Luxembourg
            </p>
            <p><strong>E-Mail:</strong> kondschafter@gmail.com</p>
          </Card>

          <Card>
            <SubTitle title="Zweck vun der Auktioun" />
            <p>
              Den Erléis vun dëser Auktioun gëtt integral un eng gemengnëtzeg
              Stëftung gespent, déi den Dag vun der Auktioun offiziell
              virgestallt gëtt.
            </p>
          </Card>

          <Card>
            <SubTitle title="Gesammelte Donnéeën" />
            <ul>
              <li>Numm a Virnumm</li>
              <li>Adress</li>
              <li>E-Mail-Adress</li>
              <li>Telefonsnummer</li>
              <li>Héicht vum Gebot</li>
              <li>Zäitpunkt vum Gebot</li>
              <li>technesch Donnéeën, wann néideg</li>
            </ul>
          </Card>

          <Card>
            <SubTitle title="Zweck vun der Veraarbechtung" />
            <ul>
              <li>Organisatioun an Duerchféierung vun der Auktioun</li>
              <li>Verwaltung vun de Geboter</li>
              <li>Kontakt mam Gewënner</li>
              <li>Kontroll vun der Validitéit vun de Geboter</li>
              <li>administrativ oder gesetzlech Obligatiounen</li>
            </ul>
          </Card>

          <Card>
            <SubTitle title="Weiderginn vun Donnéeën" />
            <p>
              Keng perséinlech Donnéeë ginn un Drëttpersoune verkaaft oder fir
              kommerziell Zwecker weiderginn.
            </p>
          </Card>

          <Card>
            <SubTitle title="Zoustand vum Konschtwierk / Ist-Zustand" />
            <p>
              D’Bild gëtt am aktuellen Zoustand versteet a verkaaft, esou wéi
              et sech um Dag vun der Auktioun befënnt. De Keefer oder Bieter
              erkläert sech domat averstanen, d’Konschtwierk am
              <strong> Ist-Zoustand / “as is”</strong> ze iwwerhuelen.
            </p>
            <p>
              D’Kondschafter – association sans but lucratif iwwerhëlt keng
              ausdrécklech oder implizit Garantie fir den Zoustand, d’Haltbarkeet,
              d’Echtheet, de spéidere Wäert, eventuell Mängel, Beschiedegungen,
              Restauratiounsbedarf oder aner Eegenschafte vum Konschtwierk.
            </p>
            <p>
              De Keefer oder Bieter erkennt un, datt hie genuch Méiglechkeet hat,
              d’Bild virum Gebot ze gesinn oder sech doriwwer z’informéieren.
              All Risiko am Zesummenhang mam Konschtwierk geet nom Zouschlag
              an no der Iwwergab op de Keefer iwwer.
            </p>
          </Card>

          <Card>
            <SubTitle title="Kee Récktrëtt, kee Remboursement" />
            <p>
              All Geboter si verbindlech. No Zouschlag kann de Kaf net
              annuléiert ginn. Et gëtt kee Remboursement, keen Ëmtausch a keng
              Reklamatioun géint de Veräin.
            </p>
          </Card>

          <Card>
            <SubTitle title="Bezuelung an Iwwergab" />
            <p>
              D’Bild gëtt eréischt no voller Bezuelung un de Gewënner
              iwwerreecht. Am Fall vun Net-Bezuelung kann d’Organisatioun de
              Verkaf annuléieren an d’Bild engem anere Participant ubidden.
            </p>
          </Card>

          <Card>
            <SubTitle title="Haftungsausschloss" />
            <p>
              De Veräin iwwerhëlt keng Haftung fir technesch Problemer,
              verspaten oder net ukomm Geboter, falsch Informatiounen,
              Internet- oder Hosting-Ausfäll, Donnéeëverloscht, Feeler bei der
              Iwwerdroung oder aner Problemer am Zesummenhang mat der
              Participatioun un der Auktioun.
            </p>
            <p>
              D’Organisatioun behält sech d’Recht vir, Geboter ofzeleenen,
              Geboter ze annuléieren, d’Auktioun unzepassen oder am Fall vu
              Force Majeure, technesche Problemer oder Mëssbrauch ofzebriechen.
              D’Decisioune vun der Organisatioun si definitiv.
            </p>
          </Card>

          <SectionTitle title="English" />

          <Card>
            <SubTitle title="Organizing Association" />
            <p>
              <strong>Kondschafter – association sans but lucratif</strong><br />
              1A, Rue Kummert<br />
              L-6743 Grevenmacher<br />
              Luxembourg
            </p>
            <p><strong>Email:</strong> kondschafter@gmail.com</p>
          </Card>

          <Card>
            <SubTitle title="Purpose of the Auction" />
            <p>
              The proceeds of this auction will be donated in full to a
              charitable foundation, which will be officially presented on the
              day of the auction.
            </p>
          </Card>

          <Card>
            <SubTitle title="Collected Data" />
            <ul>
              <li>Name</li>
              <li>Address</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Bid amount</li>
              <li>Date and time of bid</li>
              <li>Technical information, where necessary</li>
            </ul>
          </Card>

          <Card>
            <SubTitle title="Purpose of Processing" />
            <ul>
              <li>Auction organization and management</li>
              <li>Bid administration</li>
              <li>Communication with the winning bidder</li>
              <li>Verification of valid participation</li>
              <li>Administrative or legal obligations</li>
            </ul>
          </Card>

          <Card>
            <SubTitle title="Data Sharing" />
            <p>
              No personal data will be sold or shared with third parties for
              commercial purposes.
            </p>
          </Card>

          <Card>
            <SubTitle title="Condition of the Artwork / As-is" />
            <p>
              The artwork is auctioned and sold in its current condition as it
              is on the day of the auction. The buyer or bidder agrees to
              purchase and accept the artwork on an <strong>“as is”</strong>
              basis.
            </p>
            <p>
              Kondschafter – association sans but lucratif gives no express or
              implied warranty and accepts no liability regarding the condition,
              durability, authenticity, future value, possible defects, damage,
              need for restoration, or any other characteristics of the artwork.
            </p>
            <p>
              The buyer or bidder acknowledges that they had sufficient
              opportunity to view the artwork or inform themselves before
              placing a bid. Any risk related to the artwork passes to the buyer
              after final allocation and handover.
            </p>
          </Card>

          <Card>
            <SubTitle title="No Cancellation, Refunds or Returns" />
            <p>
              All bids are binding. After the final allocation, the purchase
              cannot be cancelled. No refund, exchange, return or claim against
              the association will be accepted.
            </p>
          </Card>

          <Card>
            <SubTitle title="Payment and Delivery" />
            <p>
              The artwork will only be handed over after full payment has been
              received. In the event of non-payment, the organizer reserves the
              right to cancel the sale and offer the artwork to another
              participant.
            </p>
          </Card>

          <Card>
            <SubTitle title="Limitation of Liability" />
            <p>
              The association accepts no liability for technical issues, late or
              missing bids, incorrect information, internet or hosting failures,
              data loss, transmission errors, or any other issue related to
              participation in the auction.
            </p>
            <p>
              The organizer reserves the right to refuse bids, cancel bids,
              modify the auction, or cancel the auction in case of force
              majeure, technical problems or misuse. The decisions of the
              organizer are final.
            </p>
          </Card>

          <div style={{ marginTop:'50px', textAlign:'center' }}>
            <a
              href="/"
              style={{
                display:'inline-block',
                padding:'14px 24px',
                background:'#0f3d91',
                color:'white',
                borderRadius:'14px',
                textDecoration:'none',
                fontWeight:'bold'
              }}
            >
              ← Zeréck op d'Auktioun / Back to Auction
            </a>
          </div>

        </section>
      </div>
    </main>
  )
}

function SectionTitle({ title }: { title:string }) {
  return (
    <h2 style={{
      marginTop:'50px',
      marginBottom:'20px',
      fontSize:'32px',
      color:'#0f3d91',
      borderBottom:'3px solid #6bb6ff',
      paddingBottom:'10px'
    }}>
      {title}
    </h2>
  )
}

function SubTitle({ title }: { title:string }) {
  return (
    <h3 style={{
      marginTop:0,
      color:'#0f3d91',
      fontSize:'24px'
    }}>
      {title}
    </h3>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background:'#f7fbff',
      border:'1px solid #cfe5ff',
      borderRadius:'20px',
      padding:'24px',
      marginBottom:'22px',
      boxShadow:'0 4px 12px rgba(0,0,0,0.04)'
    }}>
      {children}
    </div>
  )
}
