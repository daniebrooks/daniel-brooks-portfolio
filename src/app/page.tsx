import { Providers } from "@/components/sites/sweandrew/providers";
import { Nav } from "@/components/sites/sweandrew/nav";
import { Particles } from "@/components/sites/sweandrew/particles";
import { PalettePicker } from "@/components/sites/sweandrew/palette-picker";
import { JsonLd } from "@/components/sites/sweandrew/json-ld";
import { Hero } from "@/components/sites/sweandrew/hero";
import { About, Stack, Experience, Work, Contact } from "@/components/sites/sweandrew/sections";

export default function Home() {
  return (
    <Providers>
      <a
        href="#about"
        className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-full bg-accent px-4 py-2 font-mono text-xs font-semibold text-on-accent transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <JsonLd />
      <Particles />
      <PalettePicker />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <About />
        <Stack />
        <Experience />
        <Work />
        <Contact />
      </main>
    </Providers>
  );
}
