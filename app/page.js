import Background from '@/components/Background';
import SiteEffects from '@/components/SiteEffects';
import Loader from '@/components/Loader';
import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import ReelWall from '@/components/ReelWall';
import Brands from '@/components/Brands';
import Cinema from '@/components/Cinema';
import BookShoots from '@/components/BookShoots';
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
        <Marquee />
        <ReelWall />
        <Brands />
        <Cinema />
        <BookShoots />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
