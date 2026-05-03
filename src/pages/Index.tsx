import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Services from "@/components/landing/Services";
import Gallery from "@/components/landing/Gallery";
import InstagramFeed from "@/components/landing/InstagramFeed";
import Contact from "@/components/landing/Contact";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Gallery />
        <InstagramFeed />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
