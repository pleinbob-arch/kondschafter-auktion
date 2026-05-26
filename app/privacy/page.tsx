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
            margin:0,
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
            <SubTitle title="Verantwortlech Organisatioun" />

            <p>
              <strong>Kondschafter – association sans but lucratif</strong><br />
              R.C.S.L. F10056<br />
              1A, Rue Kummert<br />
              6743 Grevenmacher<br />
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
              gemengnëtzeg Organisatioun oder Stëftung gespent.
            </p>
          </Card>

          <Card>
            <SubTitle title="Gesammelte Donnéeën" />

            <ul>
              <li>Numm a Virnumm</li>
              <li>Adress</li>
              <li>E-Mail-Adress</li>
              <li>Telefonsnummer</li>
              <li>IP-Adress</li>
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
            <SubTitle title="Cookies & technesch Donnéeën" />

            <p>
              Dës Websäit benotzt ausschliisslech technesch néideg
              Cookies an Session-Donnéeën, fir de Login an d’Funktioune
              vun der Auktioun ze garantéieren.
            </p>

            <p>
              Et ginn keng Marketing-, Tracking- oder Analyse-Cookies benotzt.
            </p>
          </Card>

          <Card>
            <SubTitle title="Hosting & technesch Déngschter" />

            <p>
              D’Websäit gëtt iwwer modern Cloud- an Hosting-Servicer
              bedriwwen. Technesch Donnéeë kënnen dobäi temporär
              verschafft ginn, fir d'Sécherheet an d'Stabilitéit
              vun der Plattform ze garantéieren.
            </p>
          </Card>

          <Card>
            <SubTitle title="Rechtsgrondlag" />

            <p>
              D’Veraarbechtung vun den Donnéeë geschitt op Basis vum
              berechtegten Interesse fir d’Organisatioun an d’Ofwécklung
              vun der Auktioun souwéi administrativ a gesetzlech
              Obligatiounen.
            </p>
          </Card>

          <Card>
            <SubTitle title="Späicherdauer" />

            <p>
              Donnéeë ginn nëmme sou laang gespäichert wéi et fir
              d’Ofwécklung vun der Auktioun oder gesetzlech Obligatiounen
              néideg ass.
            </p>
          </Card>

          <Card>
            <SubTitle title="Weiderginn vun Donnéeën" />

            <p>
              Keng perséinlech Donnéeë ginn un Drëttpersoune verkaaft
              oder fir kommerziell Zwecker benotzt.
            </p>
          </Card>

          <Card>
            <SubTitle title="Zoustand vum Konschtwierk / Ist-Zustand" />

            <p>
              D’Bild gëtt am aktuellen Zoustand versteet a verkaaft,
              esou wéi et sech um Dag vun der Auktioun befënnt.
            </p>

            <p>
              De Keefer oder Bieter erkläert sech domat averstanen,
              d’Konschtwierk am <strong>Ist-Zoustand / “as is”</strong>
              ze iwwerhuelen.
            </p>

            <p>
              D’Kondschafter – association sans but lucratif iwwerhëlt
              keng ausdrécklech oder implizit Garantie.
            </p>
          </Card>

          <Card>
            <SubTitle title="Kee Récktrëtt, kee Remboursement" />

            <p>
              All Geboter si verbindlech. No Zouschlag kann de Kaf
              net annuléiert ginn.
            </p>

            <p>
              Et gëtt kee Remboursement, keen Ëmtausch a keng
              Reklamatioun géint de Veräin.
            </p>
          </Card>

          <Card>
            <SubTitle title="Bezuelung an Iwwergab" />

            <p>
              D’Bild gëtt eréischt no voller Bezuelung un de Gewënner
              iwwerreecht.
            </p>

            <p>
              Am Fall vun Net-Bezuelung kann d’Organisatioun de Verkaf
              annuléieren an d’Bild engem anere Participant ubidden.
            </p>
          </Card>

          <Card>
            <SubTitle title="Haftungsausschloss" />

            <p>
              De Veräin iwwerhëlt keng Haftung fir technesch Problemer,
              verspaten oder net ukomm Geboter, Hosting-Ausfäll,
              Donnéeëverloscht oder aner Problemer am Zesummenhang
              mat der Participatioun un der Auktioun.
            </p>

            <p>
              D’Organisatioun behält sech d’Recht vir,
              Geboter ofzeleenen, Geboter ze annuléieren,
              d’Auktioun unzepassen oder ofzebriechen.
            </p>
          </Card>

          <SectionTitle title="English" />

          <Card>
            <SubTitle title="Organizing Association" />

            <p>
              <strong>Kondschafter – association sans but lucratif</strong><br />
              R.C.S.L. F10056<br />
              1A, Rue Kummert<br />
              6743 Grevenmacher<br />
              Luxembourg
            </p>

            <p>
              <strong>Email:</strong> kondschafter@gmail.com
            </p>
          </Card>

          <Card>
            <SubTitle title="Cookies & Technical Data" />

            <p>
              This website only uses technically necessary cookies
              and session data required for login and auction functions.
            </p>

            <p>
              No marketing, tracking or analytics cookies are used.
            </p>
          </Card>

          <Card>
            <SubTitle title="Data Usage" />

            <p>
              Personal data is processed exclusively for the organization
              and operation of the auction.
            </p>
          </Card>

          <Card>
            <SubTitle title="Condition of the Artwork / As-is" />

            <p>
              The artwork is sold in its current condition and accepted
              on an <strong>“as is”</strong> basis.
            </p>

            <p>
              No warranty or guarantee is provided by the organizing association.
            </p>
          </Card>

          <Card>
            <SubTitle title="No Refunds or Returns" />

            <p>
              All bids are binding. No cancellation, refund or exchange
              is possible after allocation.
            </p>
          </Card>

          <Card>
            <SubTitle title="Limitation of Liability" />

            <p>
              The association accepts no liability for technical issues,
              missing bids, hosting failures or transmission problems.
            </p>
          </Card>

          <div style={{
            marginTop:'40px',
            paddingTop:'24px',
            borderTop:'1px solid #d9e8ff',
            lineHeight:'1.8'
          }}>

            <h2 style={{color:'#0f3d91'}}>
              Responsabilitéitsinformatiounen / Legal Information
            </h2>

            <p>
              <strong>Kondschafter – association sans but lucratif</strong><br />
              R.C.S.L. F10056<br />
              1A, Rue Kummert<br />
              6743 Grevenmacher<br />
              Luxembourg
            </p>

            <p>
              <strong>Kënschtler / Artist</strong><br />
              André Scholtes<br />
              IT WAS NOT ME S.à r.l.<br />
              R.C.S.L. B276670<br />
              11, Rue des Tanneurs<br />
              6790 Grevenmacher<br />
              Luxembourg
            </p>

          </div>

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
