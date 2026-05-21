export default function Home() {
  return (
    <main style={{
      maxWidth:'1000px',
      margin:'0 auto',
      padding:'40px',
      fontFamily:'Arial',
      backgroundImage:'url(https://raw.githubusercontent.com/pleinbob-arch/kondschafter-auktion/main/background.jpeg)',
      backgroundSize:'cover',
      backgroundPosition:'center',
      backgroundRepeat:'no-repeat',
      minHeight:'100vh'
    }}>

      <div style={{
        background:'rgba(255,255,255,0.88)',
        padding:'30px',
        borderRadius:'20px',
        maxWidth:'100%',
        boxSizing:'border-box',
        overflow:'hidden'
      }}>

        <h1 style={{
          fontSize:'clamp(30px, 7vw, 48px)',
          lineHeight:'1.15',
          wordBreak:'break-word',
          overflowWrap:'anywhere'
        }}>
          Kondschafter Auktioun<br />
          76. Gréiwemaacher Drauwen- A Wäifest
        </h1>

        <h2>Kënschtler: André Scholtes</h2>

        <p>
          <strong>Auktioun Enn:</strong> 13 September 2026 - 19:00
        </p>

        <img
          src="https://raw.githubusercontent.com/pleinbob-arch/kondschafter-auktion/main/kondschafter.jpg"
          alt="Kondschafter"
          style={{
            width:'100%',
            maxWidth:'700px',
            borderRadius:'14px',
            marginTop:'20px'
          }}
        />

        <section style={{
          marginTop:'40px',
          padding:'20px',
          border:'1px solid #ccc',
          borderRadius:'12px'
        }}>
          <h2>Aktuellt Héichstgebot / Current Highest Bid</h2>

          <p style={{
            fontSize:'36px',
            fontWeight:'bold'
          }}>
            1.500 €
          </p>
        </section>

        <section style={{marginTop:'40px'}}>
          <h2>Lëtzebuergesch</h2>

          <p>
            Wëllkomm op der offizieller Auktiounssäit vun de Kondschafter.
          </p>
        </section>

        <section style={{marginTop:'30px'}}>
          <h2>English</h2>

          <p>
            Welcome to the official auction page of the "Kondschafter".
          </p>
        </section>
<section style={{
  marginTop:'50px',
  paddingTop:'25px',
  borderTop:'1px solid #999',
  fontSize:'14px',
  lineHeight:'1.6'
}}>

  <h3>Organisatioun / Organization</h3>

  <p>
    Dës Auktioun gëtt organiséiert vun der:
  </p>

  <p>
    This auction is organized by:
  </p>

  <p>
    <strong>Kondschafter – association sans but lucratif</strong><br />
    F10056
  </p>

  <p>
    <strong>Adress / Address:</strong><br />
    1A, Rue Kummert<br />
    6743 Grevenmacher<br />
    Luxembourg
  </p>

  <p>
    <strong>Kënschtler / Artist:</strong><br />
    André Scholtes
  </p>

  <p>
    <strong>Websäit / Website:</strong><br />
    https://kondschafter-auktion.vercel.app
  </p>

</section>
      </div>

    </main>
  )
}
