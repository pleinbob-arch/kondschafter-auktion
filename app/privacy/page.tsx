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
          boxShadow: '0 15px 50px rgba(0,0,0,0.12)'
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
              fontSize: 'clamp(18px, 4vw, 28px)'
            }}
          >
            Privacy Policy &amp; Auction Terms
          </h2>

          <p
            style={{
              margin: '18px auto 0',
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
          <SectionTitle title="Lëtzebuergesch – Dateschutz" />

          <Card>
            <SubTitle title="1. Verantwortlechen" />

            <p>
              Verantwortlech fir dës Websäit,
              d&apos;Organisatioun vun der Auktioun
              an d&apos;Veraarbechtung vun de
              perséinlechen Donnéeën ass:
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
              oder Stëftung gëtt am Zesummenhang
              mat der Auktioun bekannt gemaach.
            </p>
          </Card>

          <Card>
            <SubTitle title="3. Veraarbechtete perséinlech Donnéeën" />

            <p>
              Am Zesummenhang mat der Registréierung,
              der Participatioun an der Ofwécklung
              vun der Auktioun kënne besonnesch
              folgend Donnéeë verschafft ginn:
            </p>

            <ul>
              <li>Virnumm an Numm</li>
              <li>Postadress</li>
              <li>E-Mail-Adress</li>
              <li>Telefonsnummer</li>
              <li>Benotzer- oder Kontidentifikatioun</li>
              <li>Héicht vum Gebot</li>
              <li>Datum an Zäitpunkt vum Gebot</li>
              <li>Quell vum Gebot, online oder live</li>
              <li>
                ëffentlech IP-Adress bei Online-Geboter
              </li>
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
              Bei Live-Geboter kann eng intern
              Bieternummer benotzt ginn. Dës déngt
              der Zouuerdnung an der Dokumentatioun
              vum Live-Gebot.
            </p>
          </Card>

          <Card>
            <SubTitle title="4. IP-Adress an ipify" />

            <p>
              Beim Ofginn vun engem
              <strong> Online-Gebot</strong> gëtt
              déi ëffentlech IP-Adress vum
              Internetuschloss, iwwer deen d&apos;Gebot
              ofgi gëtt, ermëttelt an zesumme mam
              Gebot gespäichert.
            </p>

            <p>
              Fir d&apos;Ermittlung vun der
              ëffentlecher IP-Adress gëtt den externen
              techneschen Déngscht
              <strong> api.ipify.org</strong> benotzt.
              De Browser vum Participant mécht
              dobäi eng direkt Ufro un dësen
              Déngscht.
            </p>

            <p>
              Doduerch kritt de Bedreiwer vun dësem
              Déngscht technesch bedéngt Kenntnis
              vun der IP-Adress an deenen
              Informatiounen, déi fir d&apos;Iwwerdroung
              vun der Ufro néideg sinn.
            </p>

            <p>
              D&apos;Kondschafter späicheren déi
              ermëttelt IP-Adress zesumme mam Gebot,
              fir d&apos;Ofginn vum Gebot
              nachvollzéibar ze dokumentéieren,
              d&apos;Integritéit an d&apos;Sécherheet
              vun der Auktioun ze schützen,
              Mëssbrauch oder Manipulatioun
              z&apos;erkennen an eventuell
              Sträitfäll iwwer d&apos;Ofginn oder
              d&apos;Authentizitéit vun engem Gebot
              kënnen ze klären.
            </p>

            <p>
              Wann e Participant e VPN,
              Proxy oder en aneren techneschen
              Zwëscheservice benotzt, kann déi
              gespäichert IP-Adress d&apos;Adress
              vun dësem Service an net déi
              ursprénglech Anschlussadress sinn.
            </p>
          </Card>

          <Card>
            <SubTitle title="5. Zwecker vun der Veraarbechtung" />

            <p>
              Perséinlech Donnéeë ginn nëmmen esou
              wäit verschafft, wéi dat fir
              d&apos;Organisatioun, d&apos;Sécherheet
              an d&apos;Ofwécklung vun der Auktioun
              néideg oder gesetzlech virgesinn ass.
            </p>

            <p>
              Dozou gehéieren insbesondere:
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
                Bestëmmung vum héchste valabele Gebot
              </li>
              <li>
                Identifikatioun a Kontakt mam
                Gewënner
              </li>
              <li>
                Ofwécklung vun der Bezuelung an
                Iwwergab vum Konschtwierk
              </li>
              <li>
                Sécherung vun der Integritéit vun
                der Auktioun
              </li>
              <li>
                Erkennung an Ënnersichung vu
                Mëssbrauch oder Manipulatioun
              </li>
              <li>
                Dokumentatioun a Beweissicherung
                bei eventuelle Sträitfäll
              </li>
              <li>
                Erfëllung vu gesetzlechen,
                administrativen, comptabelen oder
                steierlechen Obligatiounen
              </li>
            </ul>
          </Card>

          <Card>
            <SubTitle title="6. Rechtlech Grondlag" />

            <p>
              D&apos;Veraarbechtung vun de
              perséinlechen Donnéeë geschitt am
              Aklang mat dem zu Lëtzebuerg
              applicabelen Dateschutzrecht,
              insbesondere der europäescher
              Dateschutzgesetzgebung.
            </p>

            <p>
              Je no Zweck ass d&apos;Veraarbechtung
              néideg fir d&apos;Participatioun un
              der Auktioun an d&apos;Ofwécklung vum
              domat verbonnene Vertragsverhältnis,
              fir gesetzlech Obligatiounen
              z&apos;erfëllen oder fir berechtegt
              Interesse vun der Organisatioun ze
              schützen.
            </p>

            <p>
              Zu dëse berechtegten Interesse
              gehéieren insbesondere
              IT-Sécherheet, Schutz géint
              Manipulatioun a Mëssbrauch,
              nachvollzéierbar Dokumentatioun vun
              de Geboter an d&apos;Geltendmaachung
              oder Verdeedegung vu rechtlechen
              Uspréch.
            </p>
          </Card>

          <Card>
            <SubTitle title="7. Cookies, Session an Authentifikatioun" />

            <p>
              D&apos;Websäit benotzt technesch
              néideg Session- an
              Authentifikatiounsmechanismen an,
              jee no technescher Ëmsetzung,
              technesch néideg Browser-Späicherung
              oder Cookies.
            </p>

            <p>
              Dës si fir de Login, d&apos;Sécherheet
              an d&apos;korrekt Funktioun vun der
              Auktioun néideg.
            </p>

            <p>
              D&apos;Kondschafter setzen op dëser
              Auktiounssäit keng Marketing-,
              Werbe- oder Analyse-Cookies fir
              eegestänneg Werbe- oder
              Profilingzwecker an.
            </p>
          </Card>

          <Card>
            <SubTitle title="8. Technesch Déngschtleeschter" />

            <p>
              Fir de Betrib vun der Auktiounsplattform
              ginn extern technesch
              Déngschtleeschter agesat.
              Dozou gehéieren aktuell:
            </p>

            <ul>
              <li>
                <strong>Vercel</strong> –
                Hosting an Ausliwwerung vun der
                Webapplikatioun;
              </li>
              <li>
                <strong>Supabase</strong> –
                Datebank, Authentifikatioun an
                Realtime-Funktiounen;
              </li>
              <li>
                <strong>Brevo</strong> –
                Versand vun technesch néidegen
                E-Mailen;
              </li>
              <li>
                <strong>ipify</strong> –
                technesch Ermittlung vun der
                ëffentlecher IP-Adress beim
                Online-Gebot.
              </li>
            </ul>

            <p>
              Am Kader vun dësen Déngschter kënne
              perséinlech an technesch Donnéeë
              verschafft ginn, souwäit dat fir
              d&apos;Bereetstellung vum jeeweilegen
              Déngscht néideg ass.
            </p>

            <p>
              D&apos;Kondschafter verkafe keng
              perséinlech Donnéeën a benotzen
              d&apos;Donnéeë vun de Participanten
              net fir onofhängeg kommerziell
              Werbezwecker.
            </p>
          </Card>

          <Card>
            <SubTitle title="9. International Donnéeëveraarbechtung" />

            <p>
              Bei der Notzung vun internationalen
              Cloud-, Hosting- oder
              Infrastruktur-Déngschtleeschter kann
              et dozou kommen, datt Donnéeën och
              ausserhalb vu Lëtzebuerg oder dem
              Europäesche Wirtschaftsraum
              verschafft ginn.
            </p>

            <p>
              Souwäit dat applicabelt
              Dateschutzrecht dofir speziell
              Viraussetzunge virgesäit, soll esou
              eng Veraarbechtung nëmmen ënner
              de gesetzlech virgesinne Konditiounen
              a mat den néidege Garantien
              stattfannen.
            </p>
          </Card>

          <Card>
            <SubTitle title="10. Späicherdauer" />

            <p>
              Perséinlech Donnéeë ginn nëmme sou
              laang gespäichert, wéi et fir
              d&apos;Duerchféierung an
              d&apos;Ofwécklung vun der Auktioun,
              d&apos;Dokumentatioun vun de Geboter,
              d&apos;Klärung vu méigleche
              Sträitfäll oder d&apos;Erfëllung vu
              gesetzlechen Obligatiounen néideg ass.
            </p>

            <p>
              Wann de Grond fir eng weider
              Späicherung entfällt a keng
              gesetzlech Opbewahrungsflicht oder
              aner zulässeg Ursaach méi besteet,
              ginn déi betraffen Donnéeë geläscht
              oder anonymiséiert.
            </p>
          </Card>

          <Card>
            <SubTitle title="11. Rechter vun de betraffene Persounen" />

            <p>
              Participanten an aner betraffe
              Persoune kënnen am Kader vum
              applicabele Lëtzebuerger an
              europäeschen Dateschutzrecht
              insbesondere d&apos;Recht hunn:
            </p>

            <ul>
              <li>
                Informatioun iwwer hir Donnéeën
                ze kréien
              </li>
              <li>
                Zougang zu hire gespäicherten
                Donnéeën ze verlaangen
              </li>
              <li>
                onkorrekt Donnéeën berichtigen
                ze loossen
              </li>
              <li>
                ënner de gesetzleche
                Viraussetzungen eng Läschung oder
                Aschränkung vun der Veraarbechtung
                ze verlaangen
              </li>
              <li>
                ënner de gesetzleche
                Viraussetzungen Donnéeëportabilitéit
                ze verlaangen
              </li>
              <li>
                géint bestëmmte Veraarbechtungen
                Widdersproch anzeleeën
              </li>
            </ul>

            <p>
              Eng Demande kann un
              <strong> kondschafter@gmail.com</strong>
              geriicht ginn.
            </p>

            <p>
              Dës Rechter kënnen duerch gesetzlech
              Obligatiounen oder aner zulässeg
              Grënn limitéiert sinn, insbesondere
              wann Donnéeën nach fir d&apos;Ofwécklung
              vun der Auktioun, d&apos;Erfëllung
              vun enger gesetzlecher Flicht oder
              d&apos;Verdeedegung vu rechtlechen
              Uspréch gebraucht ginn.
            </p>
          </Card>

          <Card>
            <SubTitle title="12. Beschwerderecht" />

            <p>
              Eng betraffe Persoun huet d&apos;Recht,
              sech bei der zoustänneger
              Dateschutzautoritéit ze beschwéieren,
              wann si der Meenung ass, datt hir
              Donnéeën net am Aklang mam
              applicabele Dateschutzrecht
              verschafft ginn.
            </p>

            <p>
              Déi zoustänneg Autoritéit zu
              Lëtzebuerg ass:
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

          <SectionTitle title="Lëtzebuergesch – Auktiounsbedingungen" />

          <Card>
            <SubTitle title="13. Uwendungsberäich an Akzeptanz" />

            <p>
              Dës Auktiounsbedingungen gëlle fir
              d&apos;Participatioun un der
              Kondschafter Auktioun, souwuel online
              wéi och am Kader vun der Live-Auktioun.
            </p>

            <p>
              Mat der Ofginn vun engem Gebot
              akzeptéiert de Participant dës
              Auktiounsbedingungen an déi
              Dateschutzinformatioun an där Fassung,
              déi zum Zäitpunkt vum Gebot op der
              Auktiounssäit disponibel ass.
            </p>

            <p>
              D&apos;Participatioun ass nëmme
              Persounen erlaabt, déi no dem
              applicabele Recht berechtegt sinn,
              e verbindlecht Gebot ofzeginn an
              e Kafvertrag ofzeschléissen.
            </p>
          </Card>

          <Card>
            <SubTitle title="14. Konschtwierk" />

            <p>
              Géigestand vun der Auktioun ass
              d&apos;Konschtwierk
              <strong> „Kondschafter“</strong>,
              eng Reinterpretatioun vum
              André Scholtes.
            </p>

            <p>
              D&apos;Konschtwierk huet eng Gréisst
              vun ongeféier
              <strong> 160 cm × 120 cm</strong>.
            </p>

            <p>
              Fotoen, digital Reproduktiounen an
              Duerstellungen um Bildschierm déngen
              der Illustratioun. Faarf, Hellegkeet,
              Kontrast an Detailer kënnen
              technesch bedéngt vum Original
              ofwäichen.
            </p>
          </Card>

          <Card>
            <SubTitle title="15. Startgebot a Gebotsreegelen" />

            <p>
              D&apos;Startgebot ass
              <strong> 2.500 €</strong>.
            </p>

            <p>
              Wann nach kee valabelt Gebot
              enregistréiert ass, muss dat éischt
              Gebot tëscht
              <strong> 2.500 € an 3.000 €</strong>
              leien.
            </p>

            <p>
              Duerno muss all neit valabelt Gebot
              dat aktuell héchst Gebot ëm
              mindestens
              <strong> 50 €</strong> an ëm
              maximal <strong>500 €</strong>
              iwwerschreiden.
            </p>

            <p>
              E Gebot, dat dës technesch oder
              materiell Konditiounen net erfëllt
              oder vum Auktiounssystem ofgeleent
              gëtt, gëllt net als valabel
              enregistréiert Gebot.
            </p>
          </Card>

          <Card>
            <SubTitle title="16. Verbindlechkeet vun engem Gebot" />

            <p>
              All valabelt Gebot ass
              <strong> verbindlech</strong>.
            </p>

            <p>
              De Participant ass verantwortlech
              dofir, d&apos;Héicht vum Gebot an
              d&apos;ugewise Informatiounen ze
              kontrolléieren, ier hien d&apos;Gebot
              definitiv ofgëtt.
            </p>

            <p>
              Eng Meenungsännerung oder en einfache
              Feeler beim Aginn féiert net
              automatesch dozou, datt e valabelt
              Gebot zeréckgezu ka ginn.
            </p>

            <p>
              Bei engem offensichtleche Feeler,
              enger technescher Anomalie oder
              enger anerer aussergewéinlecher
              Situatioun kann d&apos;Organisatioun
              de Fall iwwerpréiwen an eng
              raisonnabel Entscheedung treffen.
            </p>

            <p>
              Zwingend Rechter, déi engem
              Participant no dem applicabele
              Lëtzebuerger Recht zoustinn, bleiwen
              onberéiert.
            </p>
          </Card>

          <Card>
            <SubTitle title="17. Online- a Live-Geboter" />

            <p>
              Online-Geboter a Geboter, déi am
              Kader vun der Live-Auktioun vun der
              Organisatioun enregistréiert ginn,
              kënnen Deel vun der selwechter
              Auktioun an der selwechter
              Gebotsreiefolleg sinn.
            </p>

            <p>
              Fir d&apos;Bestëmmung vum aktuelle
              Gebotsstand ass grondsätzlech de
              valabel am Auktiounssystem
              enregistréierte Gebotsstand
              ausschlaggebend.
            </p>
          </Card>

          <Card>
            <SubTitle title="18. Enn vun der Auktioun" />

            <p>
              D&apos;Auktioun endet
              <strong>
                {' '}den 13. September 2026
                um 19:26 Auer Lëtzebuerger Zäit
              </strong>
              .
            </p>

            <p>
              No dësem Zäitpunkt ginn iwwer déi
              regulär Online-Gebotsfunktioun keng
              nei Geboter méi ugeholl.
            </p>

            <p>
              Fir d&apos;Zäitbestëmmung ass déi
              technesch Zäit vum Auktiounssystem
              ausschlaggebend an net d&apos;Auer
              um Endgerät vum Participant.
            </p>
          </Card>

          <Card>
            <SubTitle title="19. Héichst valabelt Gebot" />

            <p>
              Grondsätzlech ass dat héchst valabelt
              Gebot, dat virum Enn vun der Auktioun
              vum System enregistréiert gouf,
              ausschlaggebend.
            </p>

            <p>
              D&apos;Organisatioun kann e Gebot
              iwwerpréiwen an, wann et sachlech
              gerechtfäerdegt ass, net
              berücksichtegen oder annuléieren,
              insbesondere wann konkret Indizien
              bestinn fir:
            </p>

            <ul>
              <li>Manipulatioun oder Bedruch</li>
              <li>eng falsch oder erfonnte Identitéit</li>
              <li>
                bewosst falsch Kontaktdonnéeën
              </li>
              <li>
                automatiséierten oder technesche
                Mëssbrauch
              </li>
              <li>
                en offensichtlechen technesche Feeler
              </li>
              <li>
                eng wesentlech Onregelméissegkeet
                beim Gebot
              </li>
            </ul>

            <p>
              Esou Entscheedunge sollen op engem
              sachleche Grond baséieren an net
              willkürlech getraff ginn.
            </p>
          </Card>

          <Card>
            <SubTitle title="20. Gewënner an Ofschloss vum Verkaf" />

            <p>
              Nom Enn vun der Auktioun gëtt de
              Participant mam héchste valabele
              Gebot vun der Organisatioun
              kontaktéiert.
            </p>

            <p>
              D&apos;Organisatioun kann d&apos;Identitéit
              an d&apos;Kontaktdonnéeë vum
              potenzielle Gewënner kontrolléieren,
              ier d&apos;Ofwécklung vum Verkaf
              definitiv duerchgefouert gëtt.
            </p>

            <p>
              D&apos;rechtlech Wierkung vum Gebot,
              vum Zouschlag an dem Verkaf riicht
              sech no dem zu Lëtzebuerg
              applicabele Recht.
            </p>
          </Card>

          <Card>
            <SubTitle title="21. Bezuelung an Iwwergab" />

            <p>
              De Gewënner ass verpflicht, de
              Kafpräis no den Instruktioune vun
              der Organisatioun ze bezuelen.
            </p>

            <p>
              D&apos;Konschtwierk gëtt
              grondsätzlech eréischt no kompletter
              Bezuelung iwwerreecht.
            </p>

            <p>
              Wann de Gewënner seng
              Bezuelungsverpflichtung net erfëllt,
              kann d&apos;Organisatioun déi
              Moossnamen huelen, déi no dem
              applicabele Lëtzebuerger Recht
              zulässeg sinn.
            </p>

            <p>
              Dëst kann, wann déi rechtlech
              Viraussetzungen erfëllt sinn,
              insbesondere dozou féieren, datt de
              Verkaf net weidergefouert gëtt an
              d&apos;Konschtwierk engem anere
              Participant oder op eng aner Manéier
              ugebuede gëtt.
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
              Participante ginn opgefuerdert,
              sech, wann dat méiglech ass, virum
              Gebot selwer en Androck vum
              Konschtwierk ze maachen.
            </p>

            <p>
              D&apos;Kondschafter ginn iwwer déi
              eventuell vum applicabele Recht
              virgeschriwwe Rechter eraus keng
              zousätzlech fräiwëlleg kommerziell
              Garantie.
            </p>

            <p>
              Zwingend Rechter vum Keefer no dem
              applicabele Lëtzebuerger Recht
              bleiwen onberéiert.
            </p>
          </Card>

          <Card>
            <SubTitle title="23. Annulatioun, Retour a Remboursement" />

            <p>
              Wéinst dem verbindlech Charakter vun
              engem valabele Gebot ass eng
              fräiwëlleg Annulatioun vum Gebot oder
              vum Verkaf duerch de Participant
              grondsätzlech net virgesinn.
            </p>

            <p>
              Och e fräiwëllege Retour oder
              Remboursement gëtt vun der
              Organisatioun net generell ugebueden.
            </p>

            <p>
              Dës Bestëmmung limitéiert awer keng
              Rechter, déi engem Participant oder
              Keefer no zwingendem applicabelem
              Lëtzebuerger Recht zoustinn.
            </p>

            <p>
              Wann am konkrete Fall eng zwingend
              gesetzlech Schutzbestëmmung
              applicabel ass, huet dës Virrang virun
              enger entgéintstoender Bestëmmung vun
              dësen Auktiounsbedingungen.
            </p>
          </Card>

          <Card>
            <SubTitle title="24. Technesch Disponibilitéit" />

            <p>
              D&apos;Funktioun vun enger
              Online-Auktioun hänkt ënner anerem
              vun Internetverbindungen, Browseren,
              Endgeräter an externe
              Infrastrukturservicer of.
            </p>

            <p>
              Eng permanent an absolut
              ënnerbriechungsfräi Disponibilitéit
              vun der Plattform kann net garantéiert
              ginn.
            </p>

            <p>
              De Participant ass dofir
              verantwortlech, säi Gebot mat
              genuch Zäit virum Enn vun der
              Auktioun ofzeginn.
            </p>

            <p>
              E Betrag, deen nëmmen um Endgerät vum
              Participant aginn oder ugewise gouf,
              awer net valabel vum Auktiounssystem
              enregistréiert gouf, gëllt net als
              valabelt Gebot.
            </p>
          </Card>

          <Card>
            <SubTitle title="25. Haftung" />

            <p>
              D&apos;Organisatioun beméit sech ëm
              eng sécher an ordnungsgeméiss
              Duerchféierung vun der Auktioun.
            </p>

            <p>
              Souwäit dat nom applicabele
              Lëtzebuerger Recht zulässeg ass,
              iwwerhëlt d&apos;Organisatioun keng
              Verantwortung fir Problemer, déi
              ausschliisslech duerch extern
              Internetverbindungen,
              Telekommunikatiounsnetzer,
              Endgeräter vum Participant,
              extern Déngschtleeschter oder aner
              Ëmstänn verursaacht ginn, op déi
              d&apos;Organisatioun kee raisonnabelen
              Afloss huet.
            </p>

            <p>
              Näischt an dësen
              Auktiounsbedingungen schléisst eng
              Haftung aus oder limitéiert se, wann
              esou en Ausschloss oder esou eng
              Begrenzung no dem applicabele
              Lëtzebuerger Recht net zulässeg ass.
            </p>
          </Card>

          <Card>
            <SubTitle title="26. Manipulatioun a Mëssbrauch" />

            <p>
              All Versuch, d&apos;Auktioun oder den
              technesche System ze manipuléieren,
              ass verbueden.
            </p>

            <p>
              Dëst betrëfft insbesondere:
            </p>

            <ul>
              <li>
                Geboter ënner enger falscher
                Identitéit
              </li>
              <li>
                bewosst falsch Kontaktdonnéeën
              </li>
              <li>
                automatiséiert oder massenhaft
                technesch Ufroen, déi d&apos;Plattform
                stéieren
              </li>
              <li>
                Manipulatioun vun der
                Authentifikatioun
              </li>
              <li>
                bewosst Ausnotzung vun technesche
                Feeler
              </li>
              <li>
                aner Handlungen, déi eng fair
                Duerchféierung vun der Auktioun
                beeinträchtegen
              </li>
            </ul>

            <p>
              Bei engem begrënnte Verdacht kann
              d&apos;Organisatioun déi betraffe
              Geboter iwwerpréiwen an déi
              Moossnamen huelen, déi fir eng fair
              an ordnungsgeméiss Duerchféierung
              néideg a rechtlech zulässeg sinn.
            </p>
          </Card>

          <Card>
            <SubTitle title="27. Ënnerbriechung, Verlängerung oder Ofbroch" />

            <p>
              Bei engem schwéieren technesche
              Problem, engem Sécherheetsincident,
              Manipulatioun, engem Ausfall vu
              wesentlecher Infrastruktur,
              Force majeure oder engem anere
              wesentleche Grond kann
              d&apos;Organisatioun d&apos;Auktioun
              temporär ënnerbriechen, verlängeren,
              korrigéieren oder ofbriechen, wann
              dëst fir eng fair an ordnungsgeméiss
              Duerchféierung néideg ass.
            </p>

            <p>
              Eng esou Entscheedung soll nëmmen aus
              engem sachleche Grond an am
              néidegen Ëmfang getraff ginn.
            </p>
          </Card>

          <Card>
            <SubTitle title="28. Applicabelt Recht" />

            <p>
              Fir dës Auktioun an dës
              Auktiounsbedingungen gëllt, souwäit
              rechtlech zulässeg,
              <strong> Lëtzebuerger Recht</strong>.
            </p>

            <p>
              Zwingend gesetzlech Bestëmmungen, déi
              am konkrete Fall applicabel sinn a
              vun deenen net duerch eng
              vertraglech Bestëmmung ofgewise ka
              ginn, bleiwen onberéiert.
            </p>
          </Card>

          <Card>
            <SubTitle title="29. Deelweis Ongëltegkeet" />

            <p>
              Wann eng Bestëmmung vun dësen
              Auktiounsbedingungen ganz oder
              deelweis net valabel oder net
              duerchsetzbar sollt sinn, soll dëst,
              souwäit nom applicabele Recht
              méiglech, net automatesch
              d&apos;Gëltegkeet vun deenen anere
              Bestëmmunge beaflossen.
            </p>

            <p>
              An esou engem Fall gëllen déi
              gesetzlech Reegelen.
            </p>
          </Card>

          <SectionTitle title="English – Privacy" />

          <Card>
            <SubTitle title="1. Controller and Organizer" />

            <p>
              The entity responsible for this
              website, the organization of the
              auction and the processing of personal
              data is:
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
              participation, data processed in
              connection with the auction may
              include:
            </p>

            <ul>
              <li>first and last name</li>
              <li>postal address</li>
              <li>email address</li>
              <li>telephone number</li>
              <li>user or account identifier</li>
              <li>bid amount</li>
              <li>date and time of the bid</li>
              <li>bid source, online or live</li>
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
              connection used for that bid is
              determined and stored together with
              the bid.
            </p>

            <p>
              The external technical service
              <strong> api.ipify.org</strong> is
              used to determine the public IP
              address. The participant&apos;s browser
              therefore makes a direct request to
              this service.
            </p>

            <p>
              The IP address is stored for
              documentation of the bid, protection
              of the integrity and security of the
              auction, detection of abuse or
              manipulation and the investigation of
              potential disputes concerning the
              submission or authenticity of a bid.
            </p>

            <p>
              Where a participant uses a VPN, proxy
              or similar service, the recorded IP
              address may be the address of that
              service rather than the participant&apos;s
              original internet connection.
            </p>
          </Card>

          <Card>
            <SubTitle title="4. Purposes and Legal Basis" />

            <p>
              Personal data is processed only where
              necessary for the organization,
              security and settlement of the
              auction or where processing is
              required by applicable law.
            </p>

            <p>
              Depending on the purpose, processing
              may be necessary for participation in
              the auction and performance of the
              resulting contractual relationship,
              compliance with legal obligations or
              protection of legitimate interests
              such as IT security, fraud prevention,
              bid documentation and the
              establishment or defence of legal
              claims.
            </p>

            <p>
              Processing is carried out in
              accordance with the data protection
              law applicable in Luxembourg,
              including applicable European data
              protection rules.
            </p>
          </Card>

          <Card>
            <SubTitle title="5. Technical Service Providers" />

            <p>
              The auction platform currently uses
              external technical service providers,
              including:
            </p>

            <ul>
              <li>
                <strong>Vercel</strong> for hosting
                and delivery of the web application;
              </li>
              <li>
                <strong>Supabase</strong> for
                database, authentication and
                realtime functionality;
              </li>
              <li>
                <strong>Brevo</strong> for
                technically necessary emails;
              </li>
              <li>
                <strong>ipify</strong> for
                determining the public IP address
                when an online bid is submitted.
              </li>
            </ul>

            <p>
              Personal or technical data may be
              processed by these providers to the
              extent necessary to provide the
              relevant technical service.
            </p>

            <p>
              Kondschafter does not sell
              participants&apos; personal data and
              does not use it for independent
              commercial advertising purposes.
            </p>
          </Card>

          <Card>
            <SubTitle title="6. International Processing" />

            <p>
              The use of international cloud,
              hosting or infrastructure providers
              may involve processing of data
              outside Luxembourg or the European
              Economic Area.
            </p>

            <p>
              Where applicable data protection law
              imposes specific requirements on such
              processing or transfers, the relevant
              legal requirements and safeguards
              apply.
            </p>
          </Card>

          <Card>
            <SubTitle title="7. Retention" />

            <p>
              Personal data is retained only for as
              long as necessary for conducting and
              settling the auction, documenting
              bids, resolving potential disputes or
              complying with applicable legal
              obligations.
            </p>

            <p>
              Where there is no longer a lawful
              reason for continued retention, the
              relevant data will be deleted or
              anonymised.
            </p>
          </Card>

          <Card>
            <SubTitle title="8. Data Protection Rights" />

            <p>
              Subject to the requirements and
              limitations of applicable Luxembourg
              and European data protection law,
              individuals may have rights including
              access, rectification, erasure,
              restriction, data portability and
              objection to certain forms of
              processing.
            </p>

            <p>
              Requests may be addressed to
              <strong> kondschafter@gmail.com</strong>.
            </p>

            <p>
              Individuals may also lodge a complaint
              with the competent data protection
              authority. In Luxembourg, the
              competent authority is the
              <strong>
                {' '}Commission nationale pour la
                protection des données (CNPD)
              </strong>
              .
            </p>
          </Card>

          <SectionTitle title="English – Auction Terms" />

          <Card>
            <SubTitle title="9. Scope and Acceptance" />

            <p>
              These auction terms apply to both
              online and live participation in the
              Kondschafter auction.
            </p>

            <p>
              By submitting a bid, the participant
              accepts these auction terms and the
              privacy information in the version
              available on the auction website at
              the time the bid is submitted.
            </p>

            <p>
              Participation is limited to persons
              legally capable of submitting a
              binding bid and entering into the
              resulting transaction under applicable
              law.
            </p>
          </Card>

          <Card>
            <SubTitle title="10. Starting Bid and Bid Rules" />

            <p>
              The starting bid is
              <strong> €2,500</strong>.
            </p>

            <p>
              Where no valid bid has yet been
              recorded, the first valid bid must be
              between
              <strong> €2,500 and €3,000</strong>.
            </p>

            <p>
              Each subsequent valid bid must exceed
              the current highest valid bid by at
              least <strong>€50</strong> and by no
              more than <strong>€500</strong>.
            </p>

            <p>
              A bid that does not comply with these
              requirements or is rejected by the
              auction system is not considered a
              valid recorded bid.
            </p>
          </Card>

          <Card>
            <SubTitle title="11. Binding Nature of Bids" />

            <p>
              Every valid bid is
              <strong> binding</strong>.
            </p>

            <p>
              Participants are responsible for
              checking the amount and information
              displayed before finally submitting
              their bid.
            </p>

            <p>
              A change of mind or a simple input
              error does not automatically entitle
              a participant to withdraw a valid bid.
            </p>

            <p>
              Any mandatory rights available to a
              participant under applicable
              Luxembourg law remain unaffected.
            </p>
          </Card>

          <Card>
            <SubTitle title="12. Online and Live Bids" />

            <p>
              Online bids and bids recorded by the
              organizer during the live auction may
              form part of the same auction and the
              same sequence of bids.
            </p>

            <p>
              As a general rule, the valid bid
              status recorded by the auction system
              is decisive.
            </p>
          </Card>

          <Card>
            <SubTitle title="13. Auction Closing" />

            <p>
              The auction closes on
              <strong>
                {' '}13 September 2026 at 19:26
                Luxembourg time
              </strong>
              .
            </p>

            <p>
              No further bids will be accepted
              through the regular online bidding
              function after that time.
            </p>

            <p>
              The technical time recorded by the
              auction system is decisive rather
              than the time displayed on the
              participant&apos;s device.
            </p>
          </Card>

          <Card>
            <SubTitle title="14. Highest Valid Bid" />

            <p>
              As a general rule, the highest valid
              bid recorded by the auction system
              before the closing time is decisive.
            </p>

            <p>
              The organizer may review and, where
              objectively justified, disregard or
              cancel a bid where there are concrete
              indications of fraud, manipulation,
              false identity, deliberately false
              contact details, technical abuse, an
              obvious technical error or another
              material irregularity.
            </p>

            <p>
              Such decisions must be based on an
              objective reason and must not be
              arbitrary.
            </p>
          </Card>

          <Card>
            <SubTitle title="15. Successful Bidder, Payment and Transfer" />

            <p>
              After the auction closes, the
              participant with the highest valid
              bid will be contacted by the
              organizer.
            </p>

            <p>
              The organizer may verify the identity
              and contact details of the potential
              successful bidder before final
              settlement.
            </p>

            <p>
              The successful bidder must pay the
              purchase price in accordance with the
              organizer&apos;s instructions.
            </p>

            <p>
              The artwork will normally be handed
              over only after payment in full.
            </p>

            <p>
              The legal effects of the bid, award,
              payment and sale are governed by the
              law applicable in Luxembourg.
            </p>
          </Card>

          <Card>
            <SubTitle title="16. Condition of the Artwork" />

            <p>
              The artwork will be transferred in
              its actual condition at the time of
              handover.
            </p>

            <p>
              Participants are encouraged, where
              possible, to inspect the artwork
              before bidding.
            </p>

            <p>
              Photographs and digital displays are
              provided for illustration. Colour,
              brightness, contrast and detail may
              differ from the original artwork.
            </p>

            <p>
              Kondschafter provides no additional
              voluntary commercial warranty beyond
              any rights that apply mandatorily
              under applicable law.
            </p>
          </Card>

          <Card>
            <SubTitle title="17. Cancellation, Return and Refund" />

            <p>
              Because valid bids are binding,
              voluntary cancellation of a valid bid
              or completed sale is not generally
              offered by the organizer.
            </p>

            <p>
              No general voluntary return or refund
              policy is offered.
            </p>

            <p>
              Nothing in these terms limits any
              mandatory right available to a
              participant or purchaser under
              applicable Luxembourg law.
            </p>
          </Card>

          <Card>
            <SubTitle title="18. Technical Availability" />

            <p>
              The operation of an online auction
              depends on internet connections,
              browsers, participant devices and
              external infrastructure providers.
            </p>

            <p>
              Continuous and completely
              interruption-free availability cannot
              be guaranteed.
            </p>

            <p>
              Participants are responsible for
              submitting their bids sufficiently
              before the closing time.
            </p>

            <p>
              An amount merely entered or displayed
              on a participant&apos;s device but not
              validly recorded by the auction
              system does not constitute a valid
              bid.
            </p>
          </Card>

          <Card>
            <SubTitle title="19. Liability" />

            <p>
              The organizer will use reasonable
              efforts to operate the auction in a
              secure and orderly manner.
            </p>

            <p>
              To the extent permitted under
              applicable Luxembourg law, the
              organizer is not responsible for
              problems caused exclusively by
              external internet connections,
              telecommunications networks,
              participant devices, external service
              providers or other circumstances
              outside the organizer&apos;s reasonable
              control.
            </p>

            <p>
              Nothing in these terms excludes or
              limits liability where such exclusion
              or limitation is not permitted under
              applicable Luxembourg law.
            </p>
          </Card>

          <Card>
            <SubTitle title="20. Manipulation and Abuse" />

            <p>
              Any attempt to manipulate the auction
              or its technical systems is
              prohibited.
            </p>

            <p>
              Where there is a reasonable suspicion
              of manipulation, fraud, false
              identity, deliberately false
              information or technical abuse, the
              organizer may investigate the
              affected bids and take such measures
              as are reasonably necessary and
              legally permissible to protect the
              integrity of the auction.
            </p>
          </Card>

          <Card>
            <SubTitle title="21. Suspension, Extension or Cancellation" />

            <p>
              In the event of a serious technical
              problem, security incident,
              manipulation, failure of essential
              infrastructure, force majeure or
              another material reason, the organizer
              may suspend, extend, correct or cancel
              the auction where reasonably necessary
              to ensure a fair and orderly process.
            </p>

            <p>
              Any such decision should be based on
              an objective reason and limited to
              what is reasonably necessary.
            </p>
          </Card>

          <Card>
            <SubTitle title="22. Applicable Law" />

            <p>
              To the extent legally permissible,
              this auction and these auction terms
              are governed by
              <strong> Luxembourg law</strong>.
            </p>

            <p>
              Mandatory statutory provisions that
              apply in a particular case and cannot
              lawfully be excluded by agreement
              remain unaffected.
            </p>
          </Card>

          <Card>
            <SubTitle title="23. Partial Invalidity" />

            <p>
              If any provision of these terms is
              found to be wholly or partly invalid
              or unenforceable, this shall, to the
              extent permitted by applicable law,
              not automatically affect the validity
              of the remaining provisions.
            </p>

            <p>
              Applicable statutory rules shall
              apply where necessary.
            </p>
          </Card>

          <div
            style={{
              marginTop: '40px',
              paddingTop: '24px',
              borderTop: '1px solid #d9e8ff',
              lineHeight: '1.8'
            }}
          >
            <h2 style={{ color: '#0f3d91' }}>
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
              <strong>Kënschtler / Artist</strong>
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
        borderBottom: '3px solid #6bb6ff',
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
        border: '1px solid #cfe5ff',
        borderRadius: '20px',
        padding: '24px',
        marginBottom: '22px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
      }}
    >
      {children}
    </div>
  )
}
