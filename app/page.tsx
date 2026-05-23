import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { Universe } from '@/components/universe'
import { Creations } from '@/components/creations'
import { Benefits } from '@/components/benefits'
import { Testimonials } from '@/components/testimonials'
import { Workshops } from '@/components/workshops'
import { Community } from '@/components/community'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <Hero />
      <Universe />
      <Creations />
      <Benefits />
      <Testimonials />
      <Workshops />
      <Community />
      <Footer />
    </main>
  )
}
