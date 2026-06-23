import Background from '@/components/Background';
import SiteEffects from '@/components/SiteEffects';
import Loader from '@/components/Loader';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import WorksGrid from '@/components/WorksGrid';
import Cinema from '@/components/Cinema';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Background />
      <SiteEffects />
      <Loader />
      <Nav />
      <main className="page">
        <Hero />
        <WorksGrid />
        <Cinema />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
