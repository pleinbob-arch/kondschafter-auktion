export default function Home() {
  return (
    <main style={{
      maxWidth:'1000px',
      margin:'0 auto',
      padding:'40px',
      fontFamily:'Arial'
    }}>
      <h1 style={{fontSize:'48px'}}>Kondschafter</h1>
      <h2>André Scholtes</h2>

      <p><strong>Auktioun Enn:</strong> 13 September 2026 - 19:00</p>

      <img
        src="/kondschafter.jpg"
        alt="Kondschafter"
        style={{
          width:'100%',
          maxWidth:'700px',
          borderRadius:'14px',
          marginTop:'20px'
        }}
      />

      <section style={{marginTop:'40px'}}>
        <h2>Lëtzebuergesch</h2>
        <p>
          Wëllkomm op der offizieller Auktiounssäit vum Grevenmacher Wäifest.
        </p>
      </section>

      <section style={{marginTop:'30px'}}>
        <h2>English</h2>
        <p>
          Welcome to the official auction page of the Grevenmacher Wine Festival.
        </p>
      </section>

      <section style={{
        marginTop:'40px',
        padding:'20px',
        border:'1px solid #ccc',
        borderRadius:'12px'
      }}>
        <h2>Aktuellt Héichstgebot / Current Highest Bid</h2>
        <p style={{fontSize:'36px',fontWeight:'bold'}}>1.500 €</p>
      </section>
    </main>
  )
}
