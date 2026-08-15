import { Link } from 'react-router-dom'

function About() {
  return (
    <div style={{ background: 'var(--bg)' }}>

      {/* Hero */}
      <section className="py-16 sm:py-20" style={{ background: 'var(--primary)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#f59e0b' }}>
            About Us
          </p>
          <h1
            className="font-black text-white mb-5"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '-0.02em' }}
          >
            Built for Everyday Shopping
          </h1>
          <p className="text-base sm:text-lg" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Mart is a marketplace bringing together thousands of products across every category,
            delivered fast and priced fairly.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
            {[
              { number: '10k+', label: 'Products listed' },
              { number: '50k+', label: 'Happy customers' },
              { number: '24/7', label: 'Customer support' },
            ].map((stat, i) => (
              <div key={i} className="text-center bg-white rounded-2xl p-6" style={{ border: '1px solid var(--border)' }}>
                <p className="text-3xl font-black mb-1" style={{ color: '#f59e0b' }}>{stat.number}</p>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black mb-3" style={{ color: 'var(--primary)' }}>Our Mission</h2>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>
                We believe shopping should be simple, fast, and trustworthy. Mart brings together
                verified sellers and quality products across electronics, fashion, home essentials,
                beauty, sports, and food — all in one place. Every product is reviewed for quality
                before it reaches you.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-black mb-3" style={{ color: 'var(--primary)' }}>Why Choose Mart</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {[
                  { title: 'Fast Delivery', desc: 'Same-day delivery within Lagos, nationwide shipping available.' },
                  { title: 'Secure Payments', desc: 'All transactions processed securely through Paystack.' },
                  { title: 'Verified Products', desc: 'Every listing is checked for authenticity and quality.' },
                  { title: 'Easy Returns', desc: '7-day hassle-free return policy on eligible items.' },
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                    <p className="font-bold text-sm mb-1" style={{ color: 'var(--primary)' }}>{item.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: 'var(--primary)' }}>
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
            Ready to start shopping?
          </h2>
          <Link
            to="/products"
            className="inline-block font-bold px-8 py-4 rounded-xl text-sm text-white transition-all"
            style={{ background: '#f59e0b' }}
          >
            Browse Products
          </Link>
        </div>
      </section>

    </div>
  )
}

export default About