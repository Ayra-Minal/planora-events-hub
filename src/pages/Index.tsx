import { Layout } from '@/components/layout/Layout';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturedEvents } from '@/components/home/FeaturedEvents';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <FeaturedEvents />
    </Layout>
  );
};

export default Index;