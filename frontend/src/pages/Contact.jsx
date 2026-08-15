import { useState } from 'react'

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // No backend endpoint yet — this is a UI-only demo form
    setSent(true)
    setFormData({ name: '', email: '', message: '' })
    setTimeout(() => setSent(false), 4000)
  }

  const inputStyle = { border: '1px solid var(--border)' }
  const handleFocus = (e) => e.target.style.borderColor = '#f59e0b'
  const handleBlur = (e) => e.target.style.borderColor = 'var(--border)'

  return (
    <div style={{ background: 'var(--bg)' }}>

      <section className="py-14 sm:py-16" style={{ background: 'var(--primary)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#f59e0b' }}>
            Get in Touch
          </p>
          <h1 className="font-black text-white" style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', letterSpacing: '-0.02em' }}>
            Contact Us
          </h1>
        </div>
      </section>

      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Info */}
            <div className="md:col-span-1 space-y-5">
              <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>Email</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>support@mart.com</p>
              </div>
              <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>Phone</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>+234 800 000 0000</p>
              </div>
              <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid var(--border)' }}>
                <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: 'var(--muted)' }}>Hours</p>
                <p className="text-sm font-semibold" style={{ color: 'var(--primary)' }}>Mon – Sat, 8am – 8pm</p>
              </div>
            </div>

            {/* Form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-2xl p-6 sm:p-8" style={{ border: '1px solid var(--border)' }}>

                {sent && (
                  <div
                    className="rounded-xl p-4 mb-5 text-sm"
                    style={{ background: 'rgba(16,185,129,0.08)', color: '#059669', border: '1px solid rgba(16,185,129,0.2)' }}
                  >
                    Thank you! Your message has been received. We will get back to you shortly.
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Your Name</label>
                    <input
                      type="text" name="name" value={formData.name} onChange={handleChange}
                      required placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
                      style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Email Address</label>
                    <input
                      type="email" name="email" value={formData.email} onChange={handleChange}
                      required placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all"
                      style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text)' }}>Message</label>
                    <textarea
                      name="message" value={formData.message} onChange={handleChange}
                      required rows={5} placeholder="How can we help you?"
                      className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-all resize-none"
                      style={inputStyle} onFocus={handleFocus} onBlur={handleBlur}
                    />
                  </div>
                  <button
                    type="submit"
                    className="font-bold px-6 py-3 rounded-xl text-sm text-white transition-all"
                    style={{ background: '#f59e0b' }}
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}

export default Contact