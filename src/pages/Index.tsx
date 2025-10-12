import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import DataCategories from "@/components/DataCategories";
import FeaturedDatasets from "@/components/FeaturedDatasets";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <DataCategories />
        <FeaturedDatasets />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
