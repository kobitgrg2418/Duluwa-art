import Hero from '@/components/sections/Hero';
import ShopSection from '@/components/sections/ShopSection';
import CommissionDark from '@/components/sections/CommissionDark';
import Series from '@/components/sections/Series';
import SplitCTA from '@/components/sections/SplitCTA';
import Quote from '@/components/sections/Quote';

export default function Home() {
  return (
    <>
      <Hero />
      <ShopSection />
      <CommissionDark />
      <Series />
      <SplitCTA />
      <Quote />
    </>
  );
}
