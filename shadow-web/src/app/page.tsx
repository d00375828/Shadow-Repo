// app/page.tsx
import Link from "next/link";
import "./landing.css";

export default function LandingPage() {
  return (
    <>
      {/* Top nav */}
      <header className="nav">
        <div className="nav-left">
          <Link href="/" className="brand" aria-label="Shadow Home">
            <span className="logo-badge">S</span>
            <span className="wordmark">SHADOW</span>
          </Link>
        </div>

        <nav className="nav-center" aria-label="Primary">
          <Link href="/" className="nav-link active">
            Home
          </Link>
          <Link href="#product" className="nav-link">
            Product
          </Link>
          <Link href="#pricing" className="nav-link">
            Pricing
          </Link>
          <Link href="#testimonials" className="nav-link">
            Testimonials
          </Link>
          <Link href="#partnerships" className="nav-link">
            Partnerships
          </Link>
          <Link href="#about" className="nav-link">
            About
          </Link>
        </nav>

        <div className="nav-right">
          <Link
            href="/create"
            className="btn btn-accent"
            aria-label="Get Started"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="btn btn-outline"
            aria-label="Manager Login"
          >
            Manager Login
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="hero">
        <div className="hero-inner">
          <div className="pill">BUILT BY REPS. FOR REPS.</div>

          <h1 className="hero-title">
            <span className="hero-line">YOUR</span>
            <span className="hero-line accent">SHADOW</span>
            <span className="hero-line">IN THE FIELD</span>
          </h1>

          <p className="hero-sub">
            AI-powered training and safety for door-to-door reps.
          </p>
          <p className="hero-sub-strong">
            Master your pitch. Stay safe. Close more deals.
          </p>

          <div className="cta-row">
            <Link
              href="/create"
              className="btn btn-accent btn-lg"
              aria-label="Start Training Free"
            >
              Start Training Free
              <span className="arrow">→</span>
            </Link>
            <a
              href="#"
              className="btn btn-outline btn-lg"
              aria-label="Watch Demo"
            >
              Watch Demo
            </a>
          </div>
        </div>

        {/* Floating Start Free button (optional; shows on wide screens) */}
        <Link href="/create" className="floating-cta" aria-label="Start Free">
          START FREE <span className="arrow">→</span>
        </Link>
      </main>
    </>
  );
}
