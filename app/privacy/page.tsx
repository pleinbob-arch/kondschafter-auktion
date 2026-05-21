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

          <h1 style={{
            margin:'0',
            fontSize:'clamp(34px, 8vw, 58px)',
            lineHeight:'1.1'
          }}>
            Dateschutz & Auktiounsbedingungen
          </h1>

          <h2 style={{
            marginTop:'14px',
            fontWeight:'normal',
            fontSize:'clamp(18px, 4vw, 28px)'
          }}>
            Privacy Policy & Auction Terms
          </h2>

        </section>

        <section style={{
          padding:'40px',
          lineHeight:'1.8',
          color:'#16324f'
        }}>

          <SectionTitle title="Lëtzebuergesch" />

          <Card>
            <SubTitle title="Dateschutz an Auktiounsbedingungen" />

            <p>
              Dës Websäit gëtt am Kader vun der Kondschafter Auktioun vum
              76. Gréiwemaacher Drauwen- a Wäifest bedriwwen.
            </p>
          </Card>

          <Card>
            <SubTitle title="Verantwortlech Organisatioun" />

            <p>
              <strong>Kondschafter – association sans but lucratif</strong><br />
              1A, Rue Kummert<br />
              L-6743 Gréiwemaacher<br />
              Luxembourg
            </p>

            <p>
              <strong>E-Mail:</strong> kondschafter@gmail.com
            </p>
          </Card>

          <Card>
            <SubTitle title="Zweck vun der Auktioun" />

            <p>
              Den Erléis vun dëser Auktioun gëtt integral un eng
              gemengnëtzeg Stëftung gespent, déi den Dag vun der Auktioun
              offiziell virgestallt gëtt.
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
              <li>technesch Donnéeën</li>
            </ul>
          </Card>

          <Card>
            <SubTitle title="Zweck vun der Veraarbechtung" />

            <ul>
              <li>Organisatioun vun der Auktioun</li>
              <li>Verwaltung vun de Geboter</li>
              <li>Kommunikatioun mat Participanten</li>
              <li>Administrativ Obligatiounen</li>
            </ul>
          </Card>

          <Card>
            <SubTitle title="Weiderginn vun Donnéeën" />

            <p>
              Keng perséinlech Donnéeë ginn un Drëttpersoune verkaaft
              oder fir kommerziell Zwecker weiderginn.
            </p>
          </Card>

          <Card>
            <SubTitle title="Haftungsausschloss" />

            <ul>
              <li>technesch Problemer</li>
              <li>Hosting- oder Internet-Ausfäll</li>
              <li>Feeler bei Informatiounen</li>
              <li>Problemer bei Participatiounen</li>
            </ul>

            <p>
              D’Organisatioun behält sech d’Recht vir Geboter
              ofzeleenen oder d’Auktioun unzepassen.
            </p>
          </Card>

          <Card>
            <SubTitle title="Kee Récktrëtt oder Remboursement" />

            <p>
              All Geboter si verbindlech. No Zouschlag gëtt kee
              Remboursement oder Ëmtausch ugebueden.
            </p>
          </Card>

          <Card>
            <SubTitle title="Bezuelung an Iwwergab" />

            <p>
              D’Gemälde gëtt eréischt no voller Bezuelung un de Gewënner
              iwwerreecht.
            </p>
          </Card>

          <SectionTitle title="English" />

          <Card>
            <SubTitle title="Privacy Policy and Auction Terms" />

            <p>
              This website is operated for the Kondschafter Auction
              of the 76th Grevenmacher Wine Festival.
            </p>
          </Card>

          <Card>
            <SubTitle title="Organizing Association" />

            <p>
              <strong>Kondschafter – association sans but lucratif</strong><br />
              1A, Rue Kummert<br />
              L-6743 Grevenmacher<br />
              Luxembourg
            </p>

            <p>
              <strong>Email:</strong> kondschafter@gmail.com
            </p>
          </Card>

          <Card>
            <SubTitle title="Purpose of the Auction" />

            <p>
              The proceeds of this auction will be donated in full
              to a charitable foundation.
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
              <li>Technical information</li>
            </ul>
          </Card>

          <Card>
            <SubTitle title="Purpose of Processing" />

            <ul>
              <li>Auction management</li>
              <li>Bid administration</li>
              <li>Communication with participants</li>
              <li>Legal obligations</li>
            </ul>
          </Card>

          <Card>
            <SubTitle title="Data Sharing" />

            <p>
              No personal data will be sold or shared for
              commercial purposes.
            </p>
          </Card>

          <Card>
            <SubTitle title="Limitation of Liability" />

            <ul>
              <li>technical issues</li>
              <li>hosting failures</li>
              <li>incorrect information</li>
              <li>transmission errors</li>
            </ul>

            <p>
              The organizer reserves the right to refuse bids
              or modify the auction.
            </p>
          </Card>

          <Card>
            <SubTitle title="No Refunds or Returns" />

            <p>
              All bids are binding. No refunds or cancellations
              will be accepted after allocation.
            </p>
          </Card>

          <Card>
            <SubTitle title="Payment and Delivery" />

            <p>
              The artwork will only be delivered after full
              payment has been received.
            </p>
          </Card>

          <div style={{
            marginTop:'50px',
            textAlign:'center'
          }}>
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
