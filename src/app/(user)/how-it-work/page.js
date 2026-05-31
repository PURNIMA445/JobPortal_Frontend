import HowHero from "@/components/how-it-work/HowHero";
import StepsTabs from "@/components/how-it-work/StepsTabs";
import StatsBar from "@/components/how-it-work/StatsBar";
import Testimonials from "@/components/how-it-work/Testimonials";
import FAQ from "@/components/how-it-work/FAQ";
import CTA from "@/components/how-it-work/CTA";

export const metadata = {
  title: "How It Works | hirespark",
  description: "Learn how hirespark connects job seekers and recruiters effortlessly.",
};

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-white">
      <HowHero />
      <StepsTabs />
      <StatsBar />
      <Testimonials />
      <FAQ />
      <CTA />
      <div className="h-12" />
    </main>
  );
}