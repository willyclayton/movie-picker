import { HeroSection } from '@/components/landing/HeroSection';
import { EnterButton } from '@/components/landing/EnterButton';
import { PlatformPicker } from '@/components/landing/PlatformPicker';

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 60%, rgba(201, 168, 76, 0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-12">
        <HeroSection />
        <EnterButton />
        <PlatformPicker />
      </div>

      {/* Footer hint */}
      <p className="absolute bottom-8 text-muted text-xs font-sans tracking-wider">
        takes about 30 seconds
      </p>
    </main>
  );
}
