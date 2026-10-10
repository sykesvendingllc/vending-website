'use client'

import { Activity, useEffect, useState, type FormEvent, type ReactNode } from 'react'
import Image from 'next/image'
import {
  ArrowRight,
  BarChart3,
  Brain,
  CalendarClock,
  Check,
  ChevronDown,
  CircleDollarSign,
  Eye,
  Hand,
  Mail,
  MapPin,
  Menu,
  Repeat,
  ShoppingBasket,
  Sparkles,
  Target,
  Wrench,
  X,
  Zap,
} from 'lucide-react'

type View = 'home' | 'request' | 'advertise'

const NAV_LINKS = [
  { label: 'Smart Markets', id: 'smart-market' },
  { label: 'Host Benefits', id: 'host' },
  { label: 'Who We Serve', id: 'locations' },
  { label: 'Advertise', id: 'advertise' },
  { label: 'FAQ', id: 'faq' },
]

const FOOTER_CITIES =
  'Denver · Aurora · Lakewood · Centennial · Highlands Ranch · Littleton · Englewood · Golden · Castle Rock · Ken Caryl'

const SERVICE_AREA_CITIES = [
  'Denver',
  'Aurora',
  'Lakewood',
  'Castle Rock',
  'Centennial',
  'Highlands Ranch',
  'Littleton',
  'Englewood',
  'Greenwood Village',
  'Golden',
  'Wheat Ridge',
  'Ken Caryl',
  'Parker',
]

const pillPrimary =
  'group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-primary-foreground transition-all duration-300 hover:shadow-[0_0_40px_-8px_var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'
const pillOutline =
  'inline-flex items-center justify-center gap-2 rounded-full border border-border px-7 py-4 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground transition-all duration-300 hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring'
const eyebrow = 'font-mono text-[11px] uppercase tracking-[0.28em] text-accent'

export default function SykesVendingSite() {
  const [view, setView] = useState<View>('home')
  const [menuOpen, setMenuOpen] = useState(false)

  const goTo = (next: View) => {
    setMenuOpen(false)
    setView(next)
    window.scrollTo({ top: 0 })
  }

  const [pendingSection, setPendingSection] = useState<{ id: string } | null>(null)

  // Scroll after the home view is visible; Activity keeps hidden views at display:none,
  // so measuring before the commit lands would scroll nowhere.
  useEffect(() => {
    if (view !== 'home' || !pendingSection) return
    const target = document.getElementById(pendingSection.id)
    if (!target) return
    const headerOffset = 72
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset
    window.scrollTo({ top, behavior: 'smooth' })
    setPendingSection(null)
  }, [view, pendingSection])

  const goToSection = (id: string) => {
    setMenuOpen(false)
    setView('home')
    setPendingSection({ id })
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
        onHome={() => goTo('home')}
        onSection={goToSection}
        onRequest={() => goTo('request')}
        onAdvertise={() => goTo('advertise')}
      />
      <main>
        <Activity mode={view === 'home' ? 'visible' : 'hidden'}>
          <HomePage onRequest={() => goTo('request')} onAdvertise={() => goTo('advertise')} />
        </Activity>
        <Activity mode={view === 'request' ? 'visible' : 'hidden'}>
          <RequestMachinePage onAdvertise={() => goTo('advertise')} />
        </Activity>
        <Activity mode={view === 'advertise' ? 'visible' : 'hidden'}>
          <AdvertisePage onRequest={() => goTo('request')} />
        </Activity>
      </main>
      <SiteFooter
        onRequest={() => goTo('request')}
        onAdvertise={() => goTo('advertise')}
        onFaq={() => goToSection('faq')}
      />
    </div>
  )
}

/* ---------------------------------- Header --------------------------------- */

function SiteHeader({
  menuOpen,
  onToggleMenu,
  onHome,
  onSection,
  onRequest,
  onAdvertise,
}: {
  menuOpen: boolean
  onToggleMenu: () => void
  onHome: () => void
  onSection: (id: string) => void
  onRequest: () => void
  onAdvertise: () => void
}) {
  const linkClass =
    'font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground'
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            onHome()
          }}
          className="flex items-center gap-3"
        >
          <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          <span className="font-heading text-sm font-semibold uppercase tracking-[0.22em] text-foreground">
            Sykes Vending
          </span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`/#${link.id}`}
              onClick={(e) => {
                e.preventDefault()
                onSection(link.id)
              }}
              className={linkClass}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/request-a-machine"
            onClick={(e) => {
              e.preventDefault()
              onRequest()
            }}
            className="rounded-full bg-primary px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground transition-all duration-300 hover:shadow-[0_0_30px_-6px_var(--primary)]"
          >
            Get a Machine
          </a>
        </nav>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          onClick={onToggleMenu}
          className="text-foreground lg:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="flex flex-col gap-5 border-t border-border/60 bg-background px-6 py-6 lg:hidden"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`/#${link.id}`}
              onClick={(e) => {
                e.preventDefault()
                onSection(link.id)
              }}
              className={linkClass}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/request-a-machine"
            onClick={(e) => {
              e.preventDefault()
              onRequest()
            }}
            className="self-start rounded-full bg-primary px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-primary-foreground"
          >
            Get a Machine
          </a>
        </nav>
      )}
    </header>
  )
}

/* --------------------------------- Shared UI -------------------------------- */

function SectionIntro({ label, title, children }: { label: string; title: string; children?: ReactNode }) {
  return (
    <div className="max-w-3xl">
      <span className={eyebrow}>{label}</span>
      <h2 className="mt-5 text-balance font-heading text-4xl font-bold leading-tight tracking-tight text-foreground lg:text-5xl">
        {title}
      </h2>
      {children && <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">{children}</p>}
    </div>
  )
}

function FeatureCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-7 transition-colors hover:border-primary/50">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/15 text-primary">{icon}</div>
      <h3 className="mt-6 font-heading text-xl font-semibold text-foreground">{title}</h3>
      <p className="mt-3 leading-relaxed text-muted-foreground">{children}</p>
    </div>
  )
}

function Section({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-border/60 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">{children}</div>
    </section>
  )
}

/* ---------------------------------- Home ---------------------------------- */

function HomePage({ onRequest, onAdvertise }: { onRequest: () => void; onAdvertise: () => void }) {
  return (
    <>
      <Hero onRequest={onRequest} onAdvertise={onAdvertise} />
      <SmartMarketSection />
      <HostSection />
      <LocationsSection />
      <HowItWorksSection />
      <AdvertiseSection onAdvertise={onAdvertise} />
      <ServiceAreaSection />
      <FaqSection />
      <CtaSection onRequest={onRequest} onAdvertise={onAdvertise} />
    </>
  )
}

function Hero({ onRequest, onAdvertise }: { onRequest: () => void; onAdvertise: () => void }) {
  return (
    <section className="relative overflow-hidden pb-24 pt-32 lg:pb-32 lg:pt-44">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-primary/20 blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-48 -left-40 h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-[140px]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <span className={eyebrow}>Smart Market AI · Denver Metro</span>
          <h1 className="mt-7 font-heading text-[clamp(3rem,8vw,5.5rem)] font-extrabold leading-[0.92] tracking-tight text-foreground">
            Smart.
            <br />
            <span className="text-primary">Market.</span>
            <br />
            AI.
          </h1>
          <p className="mt-8 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Sykes Vending installs and runs AI-powered smart markets for Denver-area businesses, apartment communities
            and warehouses — a 24/7 amenity your people actually use, at zero cost to you.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button type="button" onClick={onRequest} className={pillPrimary}>
              Request a Machine
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
            <button type="button" onClick={onAdvertise} className={pillOutline}>
              Advertise With Us
            </button>
          </div>
          <div className="mt-12 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            <MapPin className="h-4 w-4 text-accent" aria-hidden="true" />
            Denver · Aurora · Lakewood · Highlands Ranch
          </div>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-b from-card to-background">
            <Image
              src="/images/smart-market-cabinet.png"
              alt="The AI micro-store cabinet Sykes Vending installs — glass front, lit shelves of fresh food and drinks, and a contactless tap terminal"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-contain p-8"
            />
            <div className="absolute left-5 top-5 flex items-center gap-2 rounded-full border border-border/60 bg-background/80 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
              Status · Online
            </div>
          </div>
          <div className="absolute -bottom-6 left-6 right-6 rounded-2xl border border-border/60 bg-card/90 p-5 backdrop-blur sm:left-auto sm:w-72">
            <p className="font-heading text-3xl font-bold text-foreground">24 / 7</p>
            <p className="mt-1 text-sm text-muted-foreground">Cashless checkout with AI-tracked inventory</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function SmartMarketSection() {
  return (
    <Section id="smart-market">
      <SectionIntro label="What It Is" title="A smart market, not a snack machine">
        A Smart Market AI machine is an unattended self-checkout market. Your people walk up, grab lunch or a late-night
        snack and pay in seconds — while the system runs the inventory, the data and the ads on the screen behind it.
      </SectionIntro>
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <FeatureCard icon={<Brain className="h-5 w-5" />} title="AI-managed inventory">
          The machine learns what your people buy and restocks itself around real demand — the right products, never
          empty shelves.
        </FeatureCard>
        <FeatureCard icon={<Hand className="h-5 w-5" />} title="Fully unattended">
          Open the glass, take what you want, tap to pay. No cash, no attendant, no checkout line, no staff time from
          your team.
        </FeatureCard>
        <FeatureCard icon={<ShoppingBasket className="h-5 w-5" />} title="Better than a vending machine">
          Fresh food, premium snacks and drinks — a curated mini-market, not a row of dusty candy bars.
        </FeatureCard>
        <FeatureCard icon={<BarChart3 className="h-5 w-5" />} title="Reports you never have to read">
          {"Sales, stock levels and usage are tracked automatically. We watch it so you don't have to."}
        </FeatureCard>
      </div>
    </Section>
  )
}

function HostSection() {
  const terms = [
    'Six-month minimum placement, so the location has time to prove itself.',
    "60 days' notice after that if you'd like the machine removed.",
    'All maintenance, restocking and service stays with us — hosts never service or move the machine.',
  ]
  return (
    <Section id="host">
      <SectionIntro label="For Host Locations" title="You give us a corner. We give you the whole thing.">
        All we need is roughly five feet of wall and a standard outlet near a spot your people already walk past. We
        handle everything else, permanently.
      </SectionIntro>

      <div className="mt-16 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="flex flex-col justify-between gap-10 rounded-3xl border border-primary/40 bg-primary/10 p-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              What hosting costs you
            </p>
            <p className="mt-4 font-heading text-7xl font-extrabold text-foreground">$0</p>
            <p className="mt-3 text-muted-foreground">No lease, no commission, no monthly fee — ever.</p>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">The placement agreement</p>
            <ul className="mt-4 flex flex-col gap-3">
              {terms.map((term) => (
                <li key={term} className="flex gap-3 text-sm leading-relaxed text-foreground/90">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
                  {term}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <FeatureCard icon={<CircleDollarSign className="h-5 w-5" />} title="Zero cost to host">
            No purchase, no lease, no install fee. Sykes Vending owns the machine and everything that runs it.
          </FeatureCard>
          <FeatureCard icon={<Wrench className="h-5 w-5" />} title="We do all the work">
            Delivery, installation, stocking, cleaning and service calls are on us — start to finish.
          </FeatureCard>
          <FeatureCard icon={<Zap className="h-5 w-5" />} title="Live in days, not months">
            Most locations go from first walkthrough to installed smart market in about 2-3 weeks.
          </FeatureCard>
          <FeatureCard icon={<Sparkles className="h-5 w-5" />} title="An amenity people notice">
            24/7 food and drink access is a real perk for tenants, staff and crews on late shifts.
          </FeatureCard>
        </div>
      </div>
    </Section>
  )
}

function LocationsSection() {
  const featured = [
    {
      tag: 'Living',
      title: 'Apartment communities',
      body: 'Residents grab dinner, drinks and essentials without leaving the building — a leasing-office talking point that works on every tour.',
      src: '/images/apartment-lobby.png',
      alt: 'A glass-front AI micro-store cabinet in a modern apartment lobby at dusk',
    },
    {
      tag: 'Production',
      title: 'Warehouses & manufacturing',
      body: 'Second and third shifts need real food at 2am. Smart markets keep crews on site instead of sending them out for a run.',
      src: '/images/warehouse-breakroom.png',
      alt: 'A glass-front AI micro-store cabinet in a warehouse breakroom with industrial racking',
    },
    {
      tag: 'Corporate',
      title: 'Offices & coworking',
      body: 'Replace the under-used snack closet with something your team actually uses — no restocking duty for the office manager.',
      src: '/images/office-breakroom.png',
      alt: 'A glass-front AI micro-store cabinet beside a polished concrete wall in an office breakroom',
    },
  ]
  const more = [
    'Gyms & fitness studios',
    'Hotels & hospitality',
    'Medical & dental clinics',
    'Car dealerships & service bays',
    'Schools & training campuses',
    'Distribution & logistics hubs',
    'Self-storage facilities',
    'Retail & service shops',
  ]
  return (
    <Section id="locations">
      <SectionIntro label="Who We Serve" title="Built for high-traffic locations">
        Anywhere people spend a full day — or a full shift — is a place a smart market earns its keep.
      </SectionIntro>
      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {featured.map((item) => (
          <article key={item.title} className="overflow-hidden rounded-3xl border border-border/60 bg-card/60">
            <div className="relative aspect-[4/3]">
              <Image src={item.src} alt={item.alt} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" />
              <span className="absolute left-4 top-4 rounded-full bg-background/80 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-accent backdrop-blur">
                {item.tag}
              </span>
            </div>
            <div className="p-7">
              <h3 className="font-heading text-xl font-semibold text-foreground">{item.title}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{item.body}</p>
            </div>
          </article>
        ))}
      </div>
      <ul className="mt-10 flex flex-wrap gap-3">
        {more.map((place) => (
          <li
            key={place}
            className="rounded-full border border-border/60 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground"
          >
            {place}
          </li>
        ))}
      </ul>
    </Section>
  )
}

function HowItWorksSection() {
  const steps = [
    {
      title: 'Tell us about your space',
      body: 'Send the request form with your property type and rough traffic. We reply within one business day.',
    },
    {
      title: 'Free site walkthrough',
      body: 'We visit, find the highest-traffic spot, and confirm power and placement. No charge, no obligation.',
    },
    {
      title: 'We install and stock it',
      body: 'Delivery, set-up and first fill are ours. Typical turnaround from walkthrough to live machine is about 2-3 weeks.',
    },
    {
      title: 'We keep it running',
      body: "Restocking, cleaning, service and product changes stay on our side of the table — for as long as it's there.",
    },
  ]
  return (
    <Section id="how-it-works">
      <SectionIntro label="How It Works" title="Four steps from first message to first sale" />
      <ol className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <li key={step.title} className="rounded-2xl border border-border/60 bg-card/60 p-7">
            <span className="font-mono text-sm text-primary">{String(i + 1).padStart(2, '0')}</span>
            <h3 className="mt-6 font-heading text-xl font-semibold text-foreground">{step.title}</h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  )
}

function AdvertiseSection({ onAdvertise }: { onAdvertise: () => void }) {
  return (
    <Section id="advertise">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div>
          <SectionIntro label="Advertise With Us" title="Your business, lit up on Denver's smart markets">
            Every Sykes smart market has a backlit header panel — the lit sign above the shelves that every customer
            reads while they shop. Your branding runs there, inside busy offices, apartment communities and warehouses,
            in front of the same local audience all week long.
          </SectionIntro>
          <div className="mt-10 flex flex-col gap-6">
            {[
              {
                icon: <Eye className="h-5 w-5" />,
                title: 'Captive attention',
                body: 'Your ad sits in the backlit header panel people read while they choose what to buy — no scrolling past it.',
              },
              {
                icon: <Repeat className="h-5 w-5" />,
                title: 'Repeated daily views',
                body: 'The same audience walks past several times a day, every day. Familiarity builds fast.',
              },
              {
                icon: <Target className="h-5 w-5" />,
                title: 'Local by design',
                body: 'Reach people who live, work and shop in your part of the metro — the customers you can actually serve.',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={onAdvertise} className={`${pillPrimary} mt-10`}>
            Claim Your Airtime
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </button>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-border/60">
          <div className="relative aspect-[4/5]">
            <Image
              src="/images/backlit-ad-panel.png"
              alt="The backlit advertising panel and glowing handle of a smart market cabinet at night"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            <span className="absolute left-1/2 top-6 -translate-x-1/2 whitespace-nowrap rounded-full border border-accent/50 bg-background/80 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent backdrop-blur">
              Backlit header panel · your ad here
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 border-t border-border/60 bg-card/80 px-6 py-5">
            <p className="font-heading font-semibold text-foreground">Backlit header panel</p>
            <p className="text-right text-sm text-muted-foreground">Available across the Denver network</p>
          </div>
        </div>
      </div>
    </Section>
  )
}

function ServiceAreaSection() {
  return (
    <Section id="service-area">
      <div className="grid gap-12 lg:grid-cols-2">
        <SectionIntro label="Service Area" title="Based in Denver. Working the whole metro.">
          {
            "Sykes Vending LLC serves high-traffic locations throughout the Denver metro area. If your property is on the edge of our coverage, ask anyway — we'll tell you straight."
          }
        </SectionIntro>
        <div className="rounded-3xl border border-border/60 bg-card/60 p-8">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            Denver, Colorado
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
            {SERVICE_AREA_CITIES.map((city) => (
              <li key={city} className="text-foreground/90">
                {city}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  )
}

const FAQS = [
  {
    q: 'What does it cost to have a smart market in my building?',
    a: 'Nothing. Sykes Vending LLC owns, installs, stocks and services the machine at our expense. You provide the space and a standard outlet.',
  },
  {
    q: 'How much space do we need?',
    a: 'All we need is roughly five feet of wall and a standard outlet near a spot your people already walk past.',
  },
  {
    q: 'Who handles stocking and repairs?',
    a: 'We do. All maintenance, restocking and service stays with us — hosts never service or move the machine.',
  },
  {
    q: 'Can our staff pay with a card or phone?',
    a: 'Yes. Checkout is fully cashless — open the glass, take what you want, tap to pay.',
  },
  {
    q: 'How does advertising on the machines work?',
    a: 'Every Sykes smart market has a backlit header panel above the shelves. Your branding runs there, in front of the same local audience all week long. Send an ad request and we will come back with available placements and rates.',
  },
  {
    q: 'How quickly can a machine be installed?',
    a: 'Most locations go from first walkthrough to installed smart market in about 2-3 weeks.',
  },
  {
    q: 'Do we have to sign a contract?',
    a: "Hosting starts with one short placement agreement: a six-month minimum placement, then 60 days' notice if you'd like the machine removed.",
  },
]

function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  return (
    <Section id="faq">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <SectionIntro label="Questions" title="Straight answers" />
        <div className="divide-y divide-border/60 border-y border-border/60">
          {FAQS.map((item, i) => {
            const open = openIndex === i
            return (
              <div key={item.q}>
                <h3>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={`faq-panel-${i}`}
                    id={`faq-button-${i}`}
                    onClick={() => setOpenIndex(open ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left font-heading text-lg font-medium text-foreground transition-colors hover:text-primary"
                  >
                    {item.q}
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                {open && (
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-button-${i}`}
                    className="pb-6 pr-10 leading-relaxed text-muted-foreground"
                  >
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </Section>
  )
}

function CtaSection({ onRequest, onAdvertise }: { onRequest: () => void; onAdvertise: () => void }) {
  return (
    <section className="border-t border-border/60 py-24 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-2">
        <div className="flex flex-col items-start rounded-3xl border border-primary/40 bg-primary/10 p-10">
          <span className={eyebrow}>For Properties</span>
          <h3 className="mt-5 font-heading text-3xl font-bold text-foreground">Bring a smart market to your location</h3>
          <p className="mt-4 text-muted-foreground">Free installation, free service, no cost to your business.</p>
          <button type="button" onClick={onRequest} className={`${pillPrimary} mt-8`}>
            Request a Machine
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </button>
        </div>
        <div className="flex flex-col items-start rounded-3xl border border-border/60 bg-card/60 p-10">
          <span className={eyebrow}>For Advertisers</span>
          <h3 className="mt-5 font-heading text-3xl font-bold text-foreground">Put your business on our screens</h3>
          <p className="mt-4 text-muted-foreground">
            Reach a repeat local audience inside high-traffic Denver locations.
          </p>
          <button type="button" onClick={onAdvertise} className={`${pillOutline} mt-8`}>
            Advertise With Us
          </button>
        </div>
      </div>
    </section>
  )
}

/* ------------------------------- Form pieces ------------------------------- */

type FieldErrors = Record<string, string>

const inputClass =
  'w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 aria-[invalid=true]:border-destructive'

function Field({
  id,
  label,
  required,
  error,
  className,
  children,
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  className?: string
  children: ReactNode
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-foreground">
        {label}
        {required && (
          <span className="text-primary" aria-hidden="true">
            {' *'}
          </span>
        )}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

function SelectInput({
  id,
  value,
  onChange,
  options,
  invalid,
  required,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  options: string[]
  invalid?: boolean
  required?: boolean
}) {
  return (
    <div className="relative">
      <select
        id={id}
        name={id}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${id}-error` : undefined}
        className={`${inputClass} appearance-none pr-10 ${value ? '' : 'text-muted-foreground/70'}`}
      >
        <option value="">Select one</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-foreground">
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden="true"
      />
    </div>
  )
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function useInquiryForm<T extends Record<string, string>>(
  initial: T,
  validate: (values: T) => FieldErrors,
  idPrefix = '',
) {
  const [values, setValues] = useState<T>(initial)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')

  const set = (key: keyof T) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }))
    if (errors[key as string]) setErrors((e) => ({ ...e, [key as string]: '' }))
  }

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (status === 'sending') return
    const found = validate(values)
    const firstInvalid = Object.keys(found).find((k) => found[k])
    setErrors(found)
    if (firstInvalid) {
      document.getElementById(`${idPrefix}${firstInvalid}`)?.focus()
      return
    }
    setStatus('sending')
    setTimeout(() => setStatus('sent'), 900)
  }

  const reset = () => {
    setValues(initial)
    setErrors({})
    setStatus('idle')
  }

  return { values, errors, status, set, submit, reset }
}

function FormShell({
  title,
  submitLabel,
  status,
  onSubmit,
  children,
}: {
  title: string
  submitLabel: string
  status: 'idle' | 'sending' | 'sent'
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  children: ReactNode
}) {
  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-label={title}
      className="rounded-3xl border border-border/60 bg-card/70 p-6 sm:p-10"
    >
      <div className="grid gap-6 sm:grid-cols-2">{children}</div>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === 'sending'}
          className={`${pillPrimary} disabled:cursor-not-allowed disabled:opacity-70`}
        >
          {status === 'sending' ? 'Sending...' : submitLabel}
          {status !== 'sending' && (
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          )}
        </button>
        <p className="text-sm text-muted-foreground">We use your details only to reply about your request.</p>
      </div>
    </form>
  )
}

function SuccessPanel({
  heading,
  rows,
  onReset,
}: {
  heading: string
  rows: { label: string; value: string }[]
  onReset: () => void
}) {
  return (
    <div role="status" className="rounded-3xl border border-accent/40 bg-card/70 p-6 sm:p-10">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15 text-accent">
        <Check className="h-6 w-6" aria-hidden="true" />
      </div>
      <h2 className="mt-6 font-heading text-2xl font-bold text-foreground">{heading}</h2>
      <p className="mt-2 text-muted-foreground">
        Thanks — here is what you sent. We reply within one business day.
      </p>
      <dl className="mt-8 divide-y divide-border/60 border-y border-border/60">
        {rows
          .filter((r) => r.value)
          .map((r) => (
            <div key={r.label} className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-6">
              <dt className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{r.label}</dt>
              <dd className="whitespace-pre-wrap break-words text-foreground">{r.value}</dd>
            </div>
          ))}
      </dl>
      <button type="button" onClick={onReset} className={`${pillOutline} mt-8`}>
        Send another request
      </button>
    </div>
  )
}

function PageHero({
  label,
  title,
  intro,
  points,
}: {
  label: string
  title: string
  intro: string
  points: { icon: ReactNode; title: string; body: string }[]
}) {
  return (
    <div>
      <span className={eyebrow}>{label}</span>
      <h1 className="mt-6 text-balance font-heading text-4xl font-extrabold leading-tight tracking-tight text-foreground lg:text-6xl">
        {title}
      </h1>
      <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">{intro}</p>
      <div className="mt-12 grid gap-6 sm:grid-cols-3 lg:grid-cols-1">
        {points.map((p) => (
          <div key={p.title} className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              {p.icon}
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground">{p.title}</h2>
              <p className="mt-1 leading-relaxed text-muted-foreground">{p.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PageLayout({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <section className="relative overflow-hidden pb-24 pt-32 lg:pb-32 lg:pt-40">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-primary/15 blur-[140px]" />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div>{left}</div>
        <div>{right}</div>
      </div>
    </section>
  )
}

/* --------------------------- Request a Machine page -------------------------- */

const PROPERTY_TYPES = [
  'Office / Corporate',
  'Apartment Community',
  'Warehouse / Distribution',
  'Manufacturing',
  'Gym / Fitness Studio',
  'Hotel / Hospitality',
  'Medical / Dental Clinic',
  'School / Campus',
  'Retail / Service Shop',
  'Other',
]

const FOOT_TRAFFIC = [
  'Under 25 people a day',
  '25 - 75 people a day',
  '75 - 200 people a day',
  '200 - 500 people a day',
  '500+ people a day',
]

function RequestMachinePage({ onAdvertise }: { onAdvertise: () => void }) {
  const form = useInquiryForm(
    {
      contact_name: '',
      business_name: '',
      email: '',
      phone: '',
      location_type: '',
      location_address: '',
      foot_traffic: '',
      message: '',
    },
    (v) => ({
      contact_name: v.contact_name.trim() ? '' : 'Please enter your name.',
      email: !v.email.trim()
        ? 'Please enter your email.'
        : EMAIL_PATTERN.test(v.email.trim())
          ? ''
          : 'Please enter a valid email address.',
      location_type: v.location_type ? '' : 'Please select a property type.',
    }),
  )
  const { values: v, errors, set } = form

  return (
    <PageLayout
      left={
        <>
          <PageHero
            label="Host a Smart Market"
            title="Request a machine for your location"
            intro="Free installation, free stocking, free service — a 24/7 amenity for the people in your building at zero cost to your business."
            points={[
              {
                icon: <MapPin className="h-5 w-5" />,
                title: 'We review your space',
                body: 'Send your property type and rough traffic — we reply within one business day.',
              },
              {
                icon: <CalendarClock className="h-5 w-5" />,
                title: 'Free site walkthrough',
                body: 'We visit, pick the highest-traffic placement and confirm power access. No charge.',
              },
              {
                icon: <CircleDollarSign className="h-5 w-5" />,
                title: 'Installed at no cost',
                body: 'We deliver, install, stock and maintain the smart market. You pay nothing.',
              },
            ]}
          />
          <div className="mt-12 rounded-2xl border border-border/60 bg-card/60 p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">The placement agreement</p>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {
                "Hosting is free and starts with one short agreement: a six-month minimum placement, 60 days' notice after that if you'd like the machine removed, and all maintenance, restocking and servicing staying with us. The machine is ours to care for — hosts never service or move it."
              }
            </p>
          </div>
          <p className="mt-8 text-muted-foreground">
            Looking to advertise instead?{' '}
            <a
              href="/advertise"
              onClick={(e) => {
                e.preventDefault()
                onAdvertise()
              }}
              className="text-primary underline-offset-4 hover:underline"
            >
              Send an advertising request
            </a>
            .
          </p>
        </>
      }
      right={
        form.status === 'sent' ? (
          <SuccessPanel
            heading="Your machine request is in"
            onReset={form.reset}
            rows={[
              { label: 'Name', value: v.contact_name },
              { label: 'Business / property', value: v.business_name },
              { label: 'Email', value: v.email },
              { label: 'Phone', value: v.phone },
              { label: 'Property type', value: v.location_type },
              { label: 'City / neighborhood', value: v.location_address },
              { label: 'Daily foot traffic', value: v.foot_traffic },
              { label: 'Notes', value: v.message },
            ]}
          />
        ) : (
          <FormShell
            title="Request a machine"
            submitLabel="Send My Request"
            status={form.status}
            onSubmit={form.submit}
          >
            <Field id="contact_name" label="Your name" required error={errors.contact_name}>
              <input
                id="contact_name"
                type="text"
                autoComplete="name"
                placeholder="Full name"
                value={v.contact_name}
                onChange={(e) => set('contact_name')(e.target.value)}
                aria-invalid={!!errors.contact_name}
                aria-describedby={errors.contact_name ? 'contact_name-error' : undefined}
                className={inputClass}
              />
            </Field>
            <Field id="business_name" label="Business or property name">
              <input
                id="business_name"
                type="text"
                autoComplete="organization"
                placeholder="e.g. Union Station Lofts"
                value={v.business_name}
                onChange={(e) => set('business_name')(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field id="email" label="Email" required error={errors.email}>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={v.email}
                onChange={(e) => set('email')(e.target.value)}
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
                className={inputClass}
              />
            </Field>
            <Field id="phone" label="Phone">
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="(720) 555-0134"
                value={v.phone}
                onChange={(e) => set('phone')(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field id="location_type" label="Property type" required error={errors.location_type}>
              <SelectInput
                id="location_type"
                value={v.location_type}
                onChange={set('location_type')}
                options={PROPERTY_TYPES}
                invalid={!!errors.location_type}
                required
              />
            </Field>
            <Field id="location_address" label="City / neighborhood">
              <input
                id="location_address"
                type="text"
                placeholder="e.g. Aurora, near I-225"
                value={v.location_address}
                onChange={(e) => set('location_address')(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field id="foot_traffic" label="Daily foot traffic" className="sm:col-span-2">
              <SelectInput id="foot_traffic" value={v.foot_traffic} onChange={set('foot_traffic')} options={FOOT_TRAFFIC} />
            </Field>
            <Field id="message" label="Anything else we should know?" className="sm:col-span-2">
              <textarea
                id="message"
                rows={5}
                placeholder="Breakroom location, shift schedules, power access, timing..."
                value={v.message}
                onChange={(e) => set('message')(e.target.value)}
                className={`${inputClass} resize-y`}
              />
            </Field>
          </FormShell>
        )
      }
    />
  )
}

/* ------------------------------- Advertise page ------------------------------ */

const BUSINESS_CATEGORIES = [
  'Restaurant / Food',
  'Fitness / Wellness',
  'Real Estate',
  'Home Services',
  'Auto / Dealership',
  'Retail Store',
  'Health / Dental / Medical',
  'Financial / Insurance',
  'Entertainment / Events',
  'Other',
]

function AdvertisePage({ onRequest }: { onRequest: () => void }) {
  const form = useInquiryForm(
    {
      contact_name: '',
      business_name: '',
      email: '',
      phone: '',
      business_category: '',
      target_areas: '',
      campaign_goals: '',
    },
    (v) => ({
      contact_name: v.contact_name.trim() ? '' : 'Please enter your name.',
      business_name: v.business_name.trim() ? '' : 'Please enter your business name.',
      email: !v.email.trim()
        ? 'Please enter your email.'
        : EMAIL_PATTERN.test(v.email.trim())
          ? ''
          : 'Please enter a valid email address.',
      business_category: v.business_category ? '' : 'Please select a business category.',
    }),
    'ad_',
  )
  const { values: v, errors, set } = form
  const id = (name: string) => `ad_${name}`
  const err = (name: string) => errors[name]

  return (
    <PageLayout
      left={
        <>
          <PageHero
            label="Advertise With Us"
            title="Put your business on our backlit header panels"
            intro="The backlit header panel is the lit sign at the top of every machine — prime ad space inside high-traffic Denver locations: offices, apartment communities, warehouses and more. Tell us about your business and we'll come back with available placements and rates."
            points={[
              {
                icon: <Eye className="h-5 w-5" />,
                title: 'Seen at the moment of decision',
                body: 'Your message runs on the backlit header panel customers read while they choose what to buy.',
              },
              {
                icon: <Repeat className="h-5 w-5" />,
                title: 'Same audience, every day',
                body: 'Offices, apartment communities and warehouses are repeat-traffic locations — not one-time passers-by.',
              },
              {
                icon: <Target className="h-5 w-5" />,
                title: 'Targeted to your service area',
                body: "Tell us which parts of the metro matter to you and we'll match placements to those locations.",
              },
            ]}
          />
          <p className="mt-12 text-muted-foreground">
            Own a location and want a machine of your own?{' '}
            <a
              href="/request-a-machine"
              onClick={(e) => {
                e.preventDefault()
                onRequest()
              }}
              className="text-primary underline-offset-4 hover:underline"
            >
              Request a smart market
            </a>
            .
          </p>
        </>
      }
      right={
        form.status === 'sent' ? (
          <SuccessPanel
            heading="Your ad request is in"
            onReset={form.reset}
            rows={[
              { label: 'Name', value: v.contact_name },
              { label: 'Business', value: v.business_name },
              { label: 'Email', value: v.email },
              { label: 'Phone', value: v.phone },
              { label: 'Category', value: v.business_category },
              { label: 'Areas to reach', value: v.target_areas },
              { label: 'Campaign goals', value: v.campaign_goals },
            ]}
          />
        ) : (
          <FormShell
            title="Advertising request"
            submitLabel="Send Ad Request"
            status={form.status}
            onSubmit={form.submit}
          >
            <Field id={id('contact_name')} label="Your name" required error={err('contact_name')}>
              <input
                id={id('contact_name')}
                type="text"
                autoComplete="name"
                placeholder="Full name"
                value={v.contact_name}
                onChange={(e) => set('contact_name')(e.target.value)}
                aria-invalid={!!err('contact_name')}
                aria-describedby={err('contact_name') ? `${id('contact_name')}-error` : undefined}
                className={inputClass}
              />
            </Field>
            <Field id={id('business_name')} label="Business name" required error={err('business_name')}>
              <input
                id={id('business_name')}
                type="text"
                autoComplete="organization"
                placeholder="e.g. Mile High Dental"
                value={v.business_name}
                onChange={(e) => set('business_name')(e.target.value)}
                aria-invalid={!!err('business_name')}
                aria-describedby={err('business_name') ? `${id('business_name')}-error` : undefined}
                className={inputClass}
              />
            </Field>
            <Field id={id('email')} label="Email" required error={err('email')}>
              <input
                id={id('email')}
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                value={v.email}
                onChange={(e) => set('email')(e.target.value)}
                aria-invalid={!!err('email')}
                aria-describedby={err('email') ? `${id('email')}-error` : undefined}
                className={inputClass}
              />
            </Field>
            <Field id={id('phone')} label="Phone">
              <input
                id={id('phone')}
                type="tel"
                autoComplete="tel"
                placeholder="(720) 555-0134"
                value={v.phone}
                onChange={(e) => set('phone')(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field id={id('business_category')} label="Business category" required error={err('business_category')}>
              <SelectInput
                id={id('business_category')}
                value={v.business_category}
                onChange={(val) => set('business_category')(val)}
                options={BUSINESS_CATEGORIES}
                invalid={!!err('business_category')}
                required
              />
            </Field>
            <Field id={id('target_areas')} label="Areas you want to reach">
              <input
                id={id('target_areas')}
                type="text"
                placeholder="e.g. Highlands Ranch and Littleton"
                value={v.target_areas}
                onChange={(e) => set('target_areas')(e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field id={id('campaign_goals')} label="What should the ads achieve?" className="sm:col-span-2">
              <textarea
                id={id('campaign_goals')}
                rows={5}
                placeholder="Promote a new location, fill appointment slots, weekend specials..."
                value={v.campaign_goals}
                onChange={(e) => set('campaign_goals')(e.target.value)}
                className={`${inputClass} resize-y`}
              />
            </Field>
          </FormShell>
        )
      }
    />
  )
}

/* ---------------------------------- Footer --------------------------------- */

function SiteFooter({
  onRequest,
  onAdvertise,
  onFaq,
}: {
  onRequest: () => void
  onAdvertise: () => void
  onFaq: () => void
}) {
  const linkClass = 'text-muted-foreground transition-colors hover:text-foreground'
  const headingClass = 'font-mono text-[11px] uppercase tracking-[0.22em] text-accent'
  return (
    <footer className="border-t border-border/60 bg-card/30">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-heading text-lg font-semibold uppercase tracking-[0.18em] text-foreground">
            Sykes Vending LLC
          </p>
          <p className="mt-4 max-w-sm leading-relaxed text-muted-foreground">
            AI-powered smart markets and in-machine advertising for high-traffic locations across the Denver metro
            area.
          </p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            Serving the Denver Metro Area
          </p>
        </div>
        <div>
          <p className={headingClass}>Get Started</p>
          <ul className="mt-5 flex flex-col gap-3">
            <li>
              <a href="/request-a-machine" onClick={(e) => (e.preventDefault(), onRequest())} className={linkClass}>
                Request a Machine
              </a>
            </li>
            <li>
              <a href="/advertise" onClick={(e) => (e.preventDefault(), onAdvertise())} className={linkClass}>
                Advertise On Our Screens
              </a>
            </li>
            <li>
              <a href="/#faq" onClick={(e) => (e.preventDefault(), onFaq())} className={linkClass}>
                Frequently Asked Questions
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className={headingClass}>Contact</p>
          <ul className="mt-5 flex flex-col gap-3">
            <li>
              <a href="mailto:sykesvendingllc@gmail.com" className={`${linkClass} inline-flex items-center gap-2 break-all`}>
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                sykesvendingllc@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              Denver metro service area
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-sm text-muted-foreground">
          <p>{FOOTER_CITIES}</p>
          <p>© 2026 Sykes Vending LLC · Denver, Colorado</p>
        </div>
      </div>
    </footer>
  )
}
