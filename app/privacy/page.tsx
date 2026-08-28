export default function PrivacyPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '30px',
        fontFamily: 'Arial, sans-serif',
        background:
          'linear-gradient(180deg, #dcefff 0%, #f7fbff 100%)'
      }}
    >
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          background: 'white',
          borderRadius: '28px',
          overflow: 'hidden',
          boxShadow:
            '0 15px 50px rgba(0,0,0,0.12)'
        }}
      >
        <section
          style={{
            padding: '50px 30px',
            textAlign: 'center',
            background:
              'linear-gradient(135deg, #0f3d91, #6bb6ff)',
            color: 'white'
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: 'clamp(34px, 8vw, 58px)',
              lineHeight: '1.1'
            }}
          >
            Dateschutz &amp; Auktiounsbedingungen
          </h1>

          <h2
            style={{
              marginTop: '14px',
              fontWeight: 'normal',
              fontSize:
                'clamp(18px, 4vw, 28px)'
            }}
          >
            Privacy Policy &amp; Auction Terms
          </h2>

          <p
            style={{
              margin:
                '18px auto 0',
              maxWidth: '760px',
              fontSize: '14px',
              lineHeight: '1.6',
              opacity: 0.9
            }}
          >
            Gülteg fir d&apos;Kondschafter Auktioun
            am Kader vum 76. Gréiwemaacher
            Drauwen- a Wäifest 2026.
            <br />
            Applicable to the Kondschafter auction
            held in connection with the 76th
            Grevenmacher Drauwen- a Wäifest 2026.
          </p>
        </section>

        <section
          style={{
            padding: '40px',
            lineHeight: '1.8',
            color: '#16324f'
          }}
        >
          <SectionTitle title="Lëtzebuergesch" />

          <Card>
            <SubTitle title="1. Verantwortlechen" />

            <p>
              Verantwortlech fir dës Websäit,
              d&apos;Auktioun an d&apos;Veraarbechtung
              vun de perséinlechen Donnéeën ass:
            </p>

            <p>
              <strong>
                Kondschafter – association sans but lucratif
              </strong>
              <br />
              R.C.S.L. F10056
              <br />
              1A, Rue Kummert
              <br />
              L-6743 Grevenmacher
              <br />
              Luxembourg
            </p>

            <p>
              <strong>E-Mail:</strong>{' '}
              kondschafter@gmail.com
            </p>
          </Card>

          <Card>
            <SubTitle title="2. Zweck vun der Auktioun" />

            <p>
              Am Kader vun dëser Auktioun gëtt
              d&apos;Konschtwierk
              <strong> „Kondschafter“</strong> vum
              André Scholtes versteet.
            </p>

            <p>
              Den Erléis vun der Auktioun ass fir
              e gudden Zweck bestëmmt. Déi definitiv
              begënschtegt gemengnëtzeg Organisatioun
              oder Stëftung gëtt spéitstens am
              Zesummenhang mat der Auktioun bekannt
              gemaach.
            </p>
          </Card>

          <Card>
            <SubTitle title="3. Wéi eng Donnéeë gi verschafft?" />

            <p>
              Am Zesummenhang mat der Registréierung,
              der Participatioun an der Ofwécklung vun
              der Auktioun kënne besonnesch folgend
              Donnéeë verschafft ginn:
            </p>

            <ul>
              <li>Virnumm an Numm</li>
              <li>Postadress</li>
              <li>E-Mail-Adress</li>
              <li>Telefonsnummer</li>
              <li>Benotzer- oder Kontidentifikatioun</li>
              <li>Héicht vum Gebot</li>
              <li>Zäitpunkt vum Gebot</li>
              <li>Quell vum Gebot, z. B. online oder live</li>
              <li>ëffentlech IP-Adress bei Online-Geboter</li>
              <li>
                Browser- an Apparatinformatiounen
                (User-Agent)
              </li>
              <li>
                technesch Login-, Session- a
                Sécherheetsinformatiounen
              </li>
            </ul>

            <p>
              Bei Live-Geboter kënnen amplaz vun
              Online-Kontaktdonnéeën eng intern
              Bieternummer an d&apos;Informatioun
              „Live Bieter“ enregistréiert ginn.
            </p>
          </Card>

          <Card>
            <SubTitle title="4. IP-Adress an ipify" />

            <p>
              Beim Ofginn vun engem
              <strong> Online-Gebot</strong> gëtt déi
              ëffentlech IP-Adress vum benotzten
              Internetuschloss ermëttelt an zesumme
              mam Gebot gespäichert.
            </p>

            <p>
              Fir dës technesch Ermittlung gëtt den
              externen Déngscht
              <strong> api.ipify.org</strong>
              benotzt. De Browser mécht dobäi eng
              direkt Ufro un dësen Déngscht. Doduerch
              kritt de Bedreiwer vum Déngscht
              technesch bedéngt Kenntnis vun der
              IP-Adress an den Donnéeën, déi fir
              d&apos;Kommunikatioun néideg sinn.
            </p>

            <p>
              D&apos;Späicherung vun der IP-Adress
              duerch d&apos;Kondschafter déngt
              besonnesch der Dokumentatioun vum
              Gebot, der Erkennung vu Mëssbrauch,
              der Sécherung vun der Auktioun an der
              méiglecher Klärung vu Sträitfäll iwwer
              d&apos;Authentizitéit oder d&apos;Ofginn
              vun engem Gebot.
            </p>
          </Card>

          <Card>
            <SubTitle title="5. Zwecker vun der Donnéeëveraarbechtung" />

            <p>
              D&apos;Donnéeë ginn nëmmen esou wäit
              verschafft, wéi dat fir folgend Zwecker
              néideg ass:
            </p>

            <ul>
              <li>
                Registréierung an Authentifikatioun
                vun de Participanten
              </li>

              <li>
                Organisatioun an technesch
                Duerchféierung vun der Auktioun
              </li>

              <li>
                Entgéinthuelen, späicheren an
                dokumentéieren vun de Geboter
              </li>

              <li>
                Feststellung vum héchste valabele
                Gebot
              </li>

              <li>
                Kontakt mam Gewënner
              </li>

              <li>
                Ofwécklung vum Kaf, der Bezuelung an
                der Iwwergab vum Konschtwierk
              </li>

              <li>
                Verhënnerung an Ënnersichung vu
                Bedruch, manipuléierte Geboter oder
                techneschem Mëssbrauch
              </li>

              <li>
                Beweissicherung bei méigleche
                Sträitfäll
              </li>

              <li>
                Erfëllung vu gesetzlechen,
                steierlechen, comptabelen oder
                administrativen Obligatiounen
              </li>
            </ul>
          </Card>

          <Card>
            <SubTitle title="6. Rechtsgrondlage" />

            <p>
              Je no Zweck baséiert
              d&apos;Veraarbechtung besonnesch op:
            </p>

            <ul>
              <li>
                <strong>
                  Art. 6 Abs. 1 lit. b DSGVO
                </strong>
                : Veraarbechtung, déi fir
                d&apos;Participatioun un der Auktioun,
                virvertraglech Moossnamen an
                d&apos;Ofwécklung vum entstoende
                Vertragsverhältnis néideg ass;
              </li>

              <li>
                <strong>
                  Art. 6 Abs. 1 lit. c DSGVO
                </strong>
                : Veraarbechtung, déi fir
                d&apos;Erfëllung vu gesetzlechen
                Obligatiounen néideg ass;
              </li>

              <li>
                <strong>
                  Art. 6 Abs. 1 lit. f DSGVO
                </strong>
                : berechtegt Interesse un enger
                sécherer, nachvollzéierbarer an
                mëssbrauchsfräier Duerchféierung vun
                der Auktioun, un der IT-Sécherheet an
                un der Geltendmaachung oder
                Verdeedegung vu Rechtsuspréch.
              </li>
            </ul>
          </Card>

          <Card>
            <SubTitle title="7. Cookies, Sessions an Authentifikatioun" />

            <p>
              D&apos;Websäit benotzt nëmmen
              technesch néideg Mechanismen,
              Session-Donnéeën an, jee no technescher
              Ëmsetzung, technesch néideg Cookies
              oder lokal Browser-Späicherung.
            </p>

            <p>
              Dës Elementer si fir de Login, déi
              sécher Authentifikatioun an d&apos;korrekt
              Funktioun vun der Auktioun néideg.
            </p>

            <p>
              Et ginn duerch d&apos;Kondschafter keng
              Marketing-, Werbe- oder
              Verhalensprofil-Cookies agesat.
            </p>
          </Card>

          <Card>
            <SubTitle title="8. Technesch Déngschtleeschter an Empfänger" />

            <p>
              Fir de Betrib vun der Plattform ginn
              spezialiséiert technesch
              Déngschtleeschter agesat. Dozou
              gehéieren aktuell besonnesch:
            </p>

            <ul>
              <li>
                <strong>Vercel</strong> – Hosting an
                Ausliwwerung vun der Webapplikatioun;
              </li>

              <li>
                <strong>Supabase</strong> –
                Datebank, Authentifikatioun an
                Realtime-Funktiounen;
              </li>

              <li>
                <strong>Brevo</strong> –
                Versand vun technesch néidegen
                Transaktiouns- an
                Authentifikatiouns-E-Mailen;
              </li>

              <li>
                <strong>ipify</strong> –
                technesch Ermittlung vun der
                ëffentlecher IP-Adress bei engem
                Online-Gebot.
              </li>
            </ul>

            <p>
              Donnéeë ginn nëmmen esou wäit un dës
              Déngschtleeschter iwwermëttelt, wéi dat
              fir déi jeeweileg technesch Funktioun
              néideg ass.
            </p>

            <p>
              Perséinlech Donnéeë ginn net un
              Drëttpersoune verkaaft an net fir
              onofhängeg kommerziell Werbezwecker vun
              de Kondschafter weiderginn.
            </p>
          </Card>

          <Card>
            <SubTitle title="9. Veraarbechtung ausserhalb vum EWR" />

            <p>
              Bei Cloud-, Hosting- oder
              Infrastruktur-Déngschtleeschter kann
              net ausgeschloss ginn, datt Donnéeën
              och ausserhalb vun der Europäescher
              Unioun bzw. dem Europäesche
              Wirtschaftsraum verschafft oder
              transferéiert ginn.
            </p>

            <p>
              Wann esou en Transfert ënner
              d&apos;DSGVO fält, soll en nëmmen op
              Basis vun engem gesetzlech unerkannten
              Transfertmechanismus oder anere
              passenden Garantien am Sënn vun der
              DSGVO erfollegen.
            </p>
          </Card>

          <Card>
            <SubTitle title="10. Späicherdauer" />

            <p>
              Perséinlech Donnéeë ginn net méi laang
              gespäichert wéi et fir d&apos;Zwecker
              vun der Auktioun, d&apos;Ofwécklung vum
              Verkaf, d&apos;Dokumentatioun vu
              Geboter, d&apos;Verdeedegung vu
              méigleche Rechtsuspréch oder
              gesetzlech Opbewahrungsflichte
              néideg ass.
            </p>

            <p>
              Donnéeën, déi gesetzlechen
              Opbewahrungsflichte ënnerleien, kënnen
              entspriechend méi laang gespäichert
              ginn. Donnéeën, fir déi kee weidere
              legitimen oder gesetzleche
              Späichergrond besteet, ginn duerno
              geläscht oder anonymiséiert.
            </p>
          </Card>

          <Card>
            <SubTitle title="11. Rechter vun de betraffene Persounen" />

            <p>
              Am Kader vun den applicabele
              Dateschutzbestëmmungen hutt Dir
              besonnesch d&apos;Recht op:
            </p>

            <ul>
              <li>Informatioun an Auskunft</li>
              <li>Berichtegung vun onkorrekten Donnéeën</li>
              <li>
                Läschung, souwäit keng gesetzlech
                oder aner zulässeg Grënn
                dogéintstinn
              </li>
              <li>
                Aschränkung vun der Veraarbechtung
              </li>
              <li>
                Donnéeëportabilitéit, wann déi
                gesetzlech Viraussetzunge erfëllt
                sinn
              </li>
              <li>
                Widdersproch géint Veraarbechtungen,
                déi op engem berechtegten Interesse
                baséieren
              </li>
            </ul>

            <p>
              Fir esou Rechter auszeüben, kënnt Dir
              Iech un
              <strong> kondschafter@gmail.com</strong>
              wenden.
            </p>
          </Card>

          <Card>
            <SubTitle title="12. Beschwerderecht bei der CNPD" />

            <p>
              Wann Dir der Meenung sidd, datt Är
              perséinlech Donnéeën net am Aklang mat
              dem applicabele Dateschutzrecht
              verschafft ginn, hutt Dir d&apos;Recht,
              Iech un déi zoustänneg
              Dateschutzautoritéit ze wenden.
            </p>

            <p>
              Fir Lëtzebuerg ass dat:
            </p>

            <p>
              <strong>
                Commission nationale pour la
                protection des données (CNPD)
              </strong>
              <br />
              Luxembourg
            </p>
          </Card>

          <SectionTitle title="Auktiounsbedingungen" />

          <Card>
            <SubTitle title="13. Uwendungsberäich" />

            <p>
              Mat der Participatioun un der Auktioun
              akzeptéiert de Bieter dës
              Auktiounsbedingungen an déi
              Dateschutzinformatioun an hirer zur
              Zäit vum Gebot publizéierter Fassung.
            </p>

            <p>
              Eng Participatioun ass nëmme fir
              Persounen erlaabt, déi rechtsfäeg sinn,
              e verbindlecht Gebot ofzeginn.
            </p>
          </Card>

          <Card>
            <SubTitle title="14. Konschtwierk" />

            <p>
              Gegenstand vun der Auktioun ass
              d&apos;Konschtwierk
              <strong> „Kondschafter“</strong>,
              eng Reinterpretatioun vum André
              Scholtes.
            </p>

            <p>
              D&apos;ugewise Fotoen,
              Bildschirmduerstellungen an digital
              Reproduktioune kënnen aus technesche
              Grënn a Faarf, Hellegkeet,
              Kontrast oder Detailer vum
              Originalwierk ofwäichen.
            </p>
          </Card>

          <Card>
            <SubTitle title="15. Startgebot a Gebotsschrëtt" />

            <p>
              D&apos;Startgebot läit bei
              <strong> 2.500 €</strong>.
            </p>

            <p>
              Solange nach kee Gebot virläit, muss
              dat éischt valabelt Gebot tëscht
              <strong> 2.500 € an 3.000 €</strong>
              leien.
            </p>

            <p>
              Duerno muss all neit Gebot dat bis
              dohinner héchst valabelt Gebot ëm
              mindestens
              <strong> 50 €</strong> an ëm maximal
              <strong> 500 €</strong> iwwerschreiden.
            </p>

            <p>
              Geboter, déi dës Konditiounen net
              erfëllen oder vum System ofgeleent
              ginn, gëllen net als valabel Geboter.
            </p>
          </Card>

          <Card>
            <SubTitle title="16. Verbindlechkeet vun de Geboter" />

            <p>
              E valabelt Gebot ass
              <strong> verbindlech</strong>.
            </p>

            <p>
              De Bieter ass selwer verantwortlech,
              d&apos;Héicht vum Gebot ze kontrolléieren,
              ier en et ofgëtt.
            </p>

            <p>
              Eng einfache Feeler, Meenungsännerung
              oder versehentlech Ofginn berechtegt
              net automatesch dozou, e Gebot
              zeréckzezéien.
            </p>

            <p>
              Bei engem offensichtlechen
              Eingabefeeler oder enger
              aussergewéinlecher Situatioun kann
              d&apos;Organisatioun am Eenzelfall
              entscheeden, ob e Gebot korrigéiert
              oder annuléiert gëtt. Et besteet keen
              automateschen Usproch dorop.
            </p>
          </Card>

          <Card>
            <SubTitle title="17. Online- a Live-Geboter" />

            <p>
              Souwuel valabel Online-Geboter wéi och
              valabel Geboter, déi am Kader vun der
              Live-Auktioun duerch déi zoustänneg
              Organisatioun erfaasst ginn, kënnen an
              déi selwecht Gebotslëscht afléissen.
            </p>

            <p>
              Entscheedend ass den am
              Auktiounssystem als valabel
              enregistréierte Gebotsstand.
            </p>
          </Card>

          <Card>
            <SubTitle title="18. Enn vun der Auktioun" />

            <p>
              D&apos;Auktioun ass geplangt bis den
              <strong>
                {' '}13. September 2026 um 19:26 Auer
                Lëtzebuerger Zäit
              </strong>
              .
            </p>

            <p>
              Nom technesch festgeluechten Enn ginn
              iwwer déi regulär Online-Funktioun keng
              nei Geboter méi ugeholl.
            </p>
          </Card>

          <Card>
            <SubTitle title="19. Héichst Gebot a Gewënner" />

            <p>
              Grondsätzlech ass dat héchst valabelt
              a rechtzäiteg enregistréiert Gebot
              ausschlaggebend.
            </p>

            <p>
              D&apos;Organisatioun däerf e Gebot
              ignoréieren oder annuléieren, wann
              konkret Indizien op Manipulatioun,
              Bedruch, technesche Feeler,
              offensichtleche Mëssbrauch,
              Onméiglechkeet vun der Identifikatioun
              vum Bieter oder en anere wesentleche
              Grond hiweisen.
            </p>

            <p>
              Esou eng Entscheedung däerf net
              willkürlech geholl ginn.
            </p>
          </Card>

          <Card>
            <SubTitle title="20. Ofschloss vum Verkaf" />

            <p>
              De Gewënner gëtt vun der
              Organisatioun kontaktéiert.
            </p>

            <p>
              Souwäit gesetzlech zulässeg, kënnt de
              definitive Verkaf mam Zouschlag bzw.
              mat der Bestätegung vum Gewënner duerch
              d&apos;Organisatioun zustanen.
            </p>

            <p>
              D&apos;Organisatioun kann virun der
              definitiver Bestätegung d&apos;Identitéit
              an d&apos;Kontaktdonnéeë vum
              potenzielle Gewënner iwwerpréiwen.
            </p>
          </Card>

          <Card>
            <SubTitle title="21. Bezuelung" />

            <p>
              De Gewënner ass verpflicht, den
              zougeschloene Kafpräis no den
              Instruktioune vun der Organisatioun
              ze bezuelen.
            </p>

            <p>
              D&apos;Konschtwierk gëtt
              grondsätzlech eréischt no voller
              Bezuelung iwwerreecht.
            </p>

            <p>
              Wann de Gewënner trotz Ufro a
              raisonnabeler Nofrist net bezilt, kann
              d&apos;Organisatioun, souwäit
              gesetzlech zulässeg, vum Verkaf
              zerécktrieden an dat nächst valabelt
              Gebot berücksichtegen oder d&apos;Wierk
              anderwäerteg ubidden.
            </p>
          </Card>

          <Card>
            <SubTitle title="22. Zoustand vum Konschtwierk" />

            <p>
              D&apos;Konschtwierk gëtt am
              tatsächlechen Zoustand iwwerreecht,
              an deem et sech zum Zäitpunkt vun der
              Iwwergab befënnt.
            </p>

            <p>
              De Bieter gëtt opgefuerdert, sech, wann
              méiglech, virum Gebot selwer en
              Androck vum Wierk ze maachen.
            </p>

            <p>
              D&apos;Kondschafter ginn, souwäit
              gesetzlech zulässeg, keng
              <strong> fräiwëlleg kommerziell Garantie</strong>
              iwwer déi gesetzlech obligatoresch
              Rechter eraus.
            </p>

            <p>
              Zwingend gesetzlech Rechter a
              Haftungsbestëmmunge bleiwen onberéiert.
            </p>
          </Card>

          <Card>
            <SubTitle title="23. Récktrëtt, Retour a Remboursement" />

            <p>
              Geboter sinn am Prinzip verbindlech.
              Eng fräiwëlleg Annulatioun oder e
              fräiwëllege Remboursement ass no
              engem valabele Verkaf net virgesinn.
            </p>

            <p>
              Dëst gëllt awer
              <strong> nëmmen esou wäit, wéi
              zwingend gesetzlech Rechter näischt
              Aneres virschreiwen</strong>.
            </p>

            <p>
              Falls engem Participant am konkrete
              Fall duerch zwingend applicabelt Recht
              e Widerrufs-, Récktrëtts-, Garantie-
              oder anert Verbraucherschutzrecht
              zousteet, gëtt dat duerch dës
              Auktiounsbedingungen net ausgeschloss.
            </p>
          </Card>

          <Card>
            <SubTitle title="24. Technesch Problemer" />

            <p>
              Eng Online-Auktioun hänkt vu
              Verbindungen, Apparater, Browseren,
              Internetzougang an externen
              Infrastrukturservicer of.
            </p>

            <p>
              D&apos;Organisatioun kann dofir net
              garantéieren, datt d&apos;Websäit zu
              all Zäit ouni Ënnerbriechung,
              Verzögerung oder technesche Feeler
              verfügbar ass.
            </p>

            <p>
              De Bieter ass verantwortlech dofir,
              säi Gebot rechtzäiteg ofzeginn. Eng
              nëmmen um eegene Gerät ugewisen oder
              aginn Offer, déi net valabel vum
              System enregistréiert gouf, gëllt net
              als ofginn.
            </p>
          </Card>

          <Card>
            <SubTitle title="25. Haftung" />

            <p>
              Souwäit gesetzlech zulässeg, haft
              d&apos;Organisatioun net fir Schied,
              déi ausschliisslech aus externen
              technesche Stéierungen,
              Internetausfäll, Problemer um
              Endgerät vum Participant oder
              ähnlechen Ëmstänn entstinn, op déi
              d&apos;Organisatioun keen
              raisonnabelen Afloss huet.
            </p>

            <p>
              Dës Haftungsbegrenzung gëllt
              <strong> net</strong>, souwäit eng
              Haftung no zwingendem Recht net
              ausgeschloss oder limitéiert ka ginn.
            </p>

            <p>
              Besonnesch bleift eng gesetzlech
              Haftung fir vorsätzlecht oder, souwäit
              applicabel, schwéier fahrlässegt
              Verhalen, fir Verletzung vu Liewen,
              Kierper oder Gesondheet an aner
              zwingend Haftungsfäll onberéiert.
            </p>
          </Card>

          <Card>
            <SubTitle title="26. Integritéit vun der Auktioun" />

            <p>
              Manipulatiounsversich, automatiséiert
              Mëssbrauch, Benotzung vu falschen
              Identitéiten, bewosst falsch
              Kontaktdonnéeën oder aner Handlungen,
              déi d&apos;Integritéit vun der
              Auktioun beeinträchtegen, sinn net
              erlaabt.
            </p>

            <p>
              Bei engem begrënnte Verdacht kann
              d&apos;Organisatioun de Participant
              blockéieren, betraffe Geboter
              iwwerpréiwen an, wann néideg,
              annuléieren.
            </p>
          </Card>

          <Card>
            <SubTitle title="27. Ënnerbriechung oder Ofbroch vun der Auktioun" />

            <p>
              Bei engem schwéieren technesche
              Problem, engem Sécherheetsincident,
              Manipulatioun, Force majeure oder
              engem anere wesentleche Grond kann
              d&apos;Organisatioun d&apos;Auktioun
              temporär ënnerbriechen, korrigéieren,
              verlängeren oder ofbriechen, wann dat
              fir eng fair an ordnungsgeméiss
              Duerchféierung néideg ass.
            </p>

            <p>
              Esou eng Moossnam soll nëmmen aus
              sachlechem Grond an am néidegen Ëmfang
              geholl ginn.
            </p>
          </Card>

          <Card>
            <SubTitle title="28. Applicabelt Recht" />

            <p>
              Souwäit gesetzlech zulässeg, gëllt
              Lëtzebuerger Recht.
            </p>

            <p>
              Zwingend gesetzlech Bestëmmungen,
              besonnesch zwingend Rechter vun engem
              Participant, déi duerch eng
              Rechtswahl net ofbedonge kënne ginn,
              bleiwen onberéiert.
            </p>
          </Card>

          <Card>
            <SubTitle title="29. Salvatoresch Bestëmmung" />

            <p>
              Sollt eng Bestëmmung vun dësen
              Auktiounsbedingungen ganz oder deelweis
              ongëlteg oder net duerchsetzbar sinn,
              bleift d&apos;Gëltegkeet vun deenen
              anere Bestëmmungen, souwäit gesetzlech
              zulässeg, onberéiert.
            </p>
          </Card>

          <SectionTitle title="English" />

          <Card>
            <SubTitle title="1. Controller and Organizer" />

            <p>
              The controller responsible for this
              website, the auction and the processing
              of personal data is:
            </p>

            <p>
              <strong>
                Kondschafter – association sans but lucratif
              </strong>
              <br />
              R.C.S.L. F10056
              <br />
              1A, Rue Kummert
              <br />
              L-6743 Grevenmacher
              <br />
              Luxembourg
            </p>

            <p>
              <strong>Email:</strong>{' '}
              kondschafter@gmail.com
            </p>
          </Card>

          <Card>
            <SubTitle title="2. Personal Data" />

            <p>
              Depending on the manner of
              participation, the following data may
              be processed:
            </p>

            <ul>
              <li>first and last name</li>
              <li>postal address</li>
              <li>email address</li>
              <li>telephone number</li>
              <li>account or user identifier</li>
              <li>bid amount</li>
              <li>date and time of the bid</li>
              <li>bid source, such as online or live</li>
              <li>
                public IP address for online bids
              </li>
              <li>
                browser and device information
                (user agent)
              </li>
              <li>
                technical authentication, session
                and security information
              </li>
            </ul>
          </Card>

          <Card>
            <SubTitle title="3. IP Address and ipify" />

            <p>
              When an online bid is submitted, the
              public IP address of the internet
              connection used for the bid is
              determined and stored together with
              the bid.
            </p>

            <p>
              The external service
              <strong> api.ipify.org</strong> is
              contacted for this purpose. This
              requires the participant&apos;s browser
              to make a direct request to that
              service. The operator of that service
              will therefore necessarily receive
              the IP address and technical request
              information required to process the
              connection.
            </p>

            <p>
              The auction organizer stores the IP
              address in particular for bid
              documentation, fraud prevention,
              security and the investigation or
              defence of potential claims concerning
              the authenticity of a bid.
            </p>
          </Card>

          <Card>
            <SubTitle title="4. Purposes and Legal Bases" />

            <p>
              Personal data is processed where
              necessary for registration,
              authentication, the operation of the
              auction, recording and documenting
              bids, determining the successful
              bidder, contacting the winner,
              processing payment and transfer of the
              artwork, preventing fraud and complying
              with legal obligations.
            </p>

            <p>
              Depending on the purpose, processing
              may in particular be based on Article
              6(1)(b), Article 6(1)(c) and Article
              6(1)(f) GDPR.
            </p>
          </Card>

          <Card>
            <SubTitle title="5. Technical Service Providers" />

            <p>
              The platform currently uses technical
              service providers including:
            </p>

            <ul>
              <li>
                <strong>Vercel</strong> for hosting;
              </li>

              <li>
                <strong>Supabase</strong> for
                database, authentication and
                realtime functionality;
              </li>

              <li>
                <strong>Brevo</strong> for
                transactional and authentication
                emails;
              </li>

              <li>
                <strong>ipify</strong> for
                determining the public IP address
                when an online bid is submitted.
              </li>
            </ul>

            <p>
              Personal data is not sold by
              Kondschafter and is not disclosed for
              independent commercial advertising
              purposes.
            </p>
          </Card>

          <Card>
            <SubTitle title="6. International Processing" />

            <p>
              Depending on the infrastructure and
              subprocessors used by the relevant
              service providers, data may be
              processed outside the European
              Economic Area.
            </p>

            <p>
              Where the GDPR applies to such a
              transfer, an appropriate legal
              transfer mechanism or other applicable
              safeguard should be used.
            </p>
          </Card>

          <Card>
            <SubTitle title="7. Retention" />

            <p>
              Personal data is retained only for as
              long as necessary for the auction,
              settlement of the sale, documentation
              of bids, establishment or defence of
              legal claims, and compliance with
              applicable statutory retention
              obligations.
            </p>

            <p>
              Data for which no further lawful
              retention purpose exists will
              subsequently be deleted or anonymised.
            </p>
          </Card>

          <Card>
            <SubTitle title="8. Data Subject Rights" />

            <p>
              Subject to the applicable statutory
              requirements and limitations, data
              subjects may have rights including:
            </p>

            <ul>
              <li>access</li>
              <li>rectification</li>
              <li>erasure</li>
              <li>restriction of processing</li>
              <li>data portability</li>
              <li>
                objection to processing based on
                legitimate interests
              </li>
            </ul>

            <p>
              Requests may be sent to
              <strong> kondschafter@gmail.com</strong>.
            </p>

            <p>
              Data subjects also have the right to
              lodge a complaint with the competent
              data protection authority. In
              Luxembourg, this is the
              <strong>
                {' '}Commission nationale pour la
                protection des données (CNPD)
              </strong>
              .
            </p>
          </Card>

          <SectionTitle title="Auction Terms – English" />

          <Card>
            <SubTitle title="9. Binding Bids" />

            <p>
              Every valid bid is binding.
              Participants are responsible for
              checking the amount entered before
              submitting a bid.
            </p>

            <p>
              A change of mind or simple input error
              does not automatically give a bidder
              the right to withdraw a bid.
            </p>
          </Card>

          <Card>
            <SubTitle title="10. Starting Bid and Bid Increments" />

            <p>
              The starting bid is
              <strong> €2,500</strong>.
            </p>

            <p>
              If no bid has yet been recorded, the
              first valid bid must be between
              <strong> €2,500 and €3,000</strong>.
            </p>

            <p>
              Every subsequent bid must exceed the
              current highest valid bid by at least
              <strong> €50</strong> and by no more
              than <strong>€500</strong>.
            </p>
          </Card>

          <Card>
            <SubTitle title="11. Auction Closing" />

            <p>
              The auction is scheduled to close on
              <strong>
                {' '}13 September 2026 at 19:26
                Luxembourg time
              </strong>
              .
            </p>

            <p>
              After the technical closing time, no
              further bids will be accepted through
              the regular online bidding function.
            </p>
          </Card>

          <Card>
            <SubTitle title="12. Successful Bidder" />

            <p>
              As a general rule, the highest valid
              bid recorded by the auction system at
              the relevant closing time will be
              decisive.
            </p>

            <p>
              The organizer may disregard or cancel
              a bid where there are concrete
              indications of fraud, manipulation,
              abuse, an obvious technical error,
              inability to identify the bidder or
              another material irregularity.
            </p>
          </Card>

          <Card>
            <SubTitle title="13. Payment and Transfer" />

            <p>
              The successful bidder must pay the
              purchase price in accordance with the
              instructions provided by the
              organizer.
            </p>

            <p>
              The artwork will normally be released
              only after payment in full.
            </p>

            <p>
              If the successful bidder fails to pay
              despite a reasonable further deadline,
              the organizer may, to the extent
              permitted by law, cancel the sale and
              consider the next valid bidder or
              otherwise dispose of the artwork.
            </p>
          </Card>

          <Card>
            <SubTitle title="14. Condition of the Artwork" />

            <p>
              The artwork is transferred in its
              actual condition at the time of
              handover.
            </p>

            <p>
              Digital photographs and screen
              displays may differ from the original
              artwork in colour, brightness,
              contrast or detail.
            </p>

            <p>
              To the extent permitted by law, the
              organizer does not provide any
              voluntary commercial warranty beyond
              rights that cannot lawfully be
              excluded.
            </p>
          </Card>

          <Card>
            <SubTitle title="15. Cancellation, Returns and Refunds" />

            <p>
              Valid bids are intended to be binding,
              and no voluntary cancellation, return
              or refund is offered after a valid
              sale.
            </p>

            <p>
              However, nothing in these terms
              excludes any withdrawal, cancellation,
              warranty, consumer protection or other
              right that applies mandatorily under
              applicable law.
            </p>
          </Card>

          <Card>
            <SubTitle title="16. Technical Availability" />

            <p>
              The organizer cannot guarantee that
              the website, internet connections,
              third-party infrastructure or
              participant devices will operate
              without interruption or delay at all
              times.
            </p>

            <p>
              A bid is only considered submitted
              where it has been validly received and
              recorded by the auction system.
            </p>
          </Card>

          <Card>
            <SubTitle title="17. Liability" />

            <p>
              To the extent permitted by applicable
              law, the organizer will not be liable
              for losses caused solely by external
              internet failures, participant device
              problems or other circumstances beyond
              its reasonable control.
            </p>

            <p>
              Nothing in these terms excludes or
              limits liability where such exclusion
              or limitation is prohibited by
              mandatory law.
            </p>
          </Card>

          <Card>
            <SubTitle title="18. Manipulation and Abuse" />

            <p>
              Fraudulent bids, false identities,
              deliberately false contact details,
              automated abuse or any attempt to
              manipulate the auction are prohibited.
            </p>

            <p>
              The organizer may investigate and,
              where reasonably justified, reject or
              cancel affected bids.
            </p>
          </Card>

          <Card>
            <SubTitle title="19. Suspension or Cancellation" />

            <p>
              In the event of a serious technical
              failure, security incident,
              manipulation, force majeure or another
              material reason, the organizer may
              suspend, correct, extend or cancel the
              auction where reasonably necessary to
              preserve a fair and orderly process.
            </p>
          </Card>

          <Card>
            <SubTitle title="20. Governing Law" />

            <p>
              To the extent permitted by law,
              Luxembourg law applies.
            </p>

            <p>
              Any mandatory rights or protections
              which cannot lawfully be excluded by
              a choice of law remain unaffected.
            </p>
          </Card>

          <div
            style={{
              marginTop: '40px',
              paddingTop: '24px',
              borderTop:
                '1px solid #d9e8ff',
              lineHeight: '1.8'
            }}
          >
            <h2
              style={{
                color: '#0f3d91'
              }}
            >
              Responsabilitéitsinformatiounen /
              Legal Information
            </h2>

            <p>
              <strong>
                Kondschafter – association sans but lucratif
              </strong>
              <br />
              R.C.S.L. F10056
              <br />
              1A, Rue Kummert
              <br />
              L-6743 Grevenmacher
              <br />
              Luxembourg
              <br />
              E-Mail: kondschafter@gmail.com
            </p>

            <p>
              <strong>
                Kënschtler / Artist
              </strong>
              <br />
              André Scholtes
              <br />
              IT WAS NOT ME S.à r.l.
              <br />
              R.C.S.L. B276670
              <br />
              11, Rue des Tanneurs
              <br />
              L-6790 Grevenmacher
              <br />
              Luxembourg
            </p>

            <p
              style={{
                marginTop: '28px',
                fontSize: '13px',
                color: '#5c7085'
              }}
            >
              Lescht Aktualiséierung / Last updated:
              28 August 2026
            </p>
          </div>

          <div
            style={{
              marginTop: '50px',
              textAlign: 'center'
            }}
          >
            <a
              href="/"
              style={{
                display: 'inline-block',
                padding: '14px 24px',
                background: '#0f3d91',
                color: 'white',
                borderRadius: '14px',
                textDecoration: 'none',
                fontWeight: 'bold'
              }}
            >
              ← Zeréck op d&apos;Auktioun /
              Back to Auction
            </a>
          </div>
        </section>
      </div>
    </main>
  )
}

function SectionTitle({
  title
}: {
  title: string
}) {
  return (
    <h2
      style={{
        marginTop: '50px',
        marginBottom: '20px',
        fontSize: '32px',
        color: '#0f3d91',
        borderBottom:
          '3px solid #6bb6ff',
        paddingBottom: '10px'
      }}
    >
      {title}
    </h2>
  )
}

function SubTitle({
  title
}: {
  title: string
}) {
  return (
    <h3
      style={{
        marginTop: 0,
        color: '#0f3d91',
        fontSize: '24px'
      }}
    >
      {title}
    </h3>
  )
}

function Card({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        background: '#f7fbff',
        border:
          '1px solid #cfe5ff',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '22px',
        boxShadow:
          '0 4px 12px rgba(0,0,0,0.04)'
      }}
    >
      {children}
    </div>
  )
}
