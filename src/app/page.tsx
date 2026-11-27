import { About } from "@/components/home/about";
import { Contact } from "@/components/home/contact";
import { Experience } from "@/components/home/experience";
import { Hero } from "@/components/home/hero";
import { PageTransition } from "@/components/effects/morph";
import { VelocityMarquee } from "@/components/effects/velocity-marquee";
import { skillGroups } from "@/data/skills";
import { ProjectsSection } from "@/components/home/projects-section";
import { Spotlight } from "@/components/home/spotlight";
import { jsonLd, personSchema } from "@/lib/structured-data";

/** Every skill from the Toolkit, so the ribbon never claims anything the list doesn't. */
const marqueeItems = skillGroups
  .flatMap((group) => group.skills.map((skill) => skill.name))
  .filter((name) => name.length <= 14);

export default function HomePage() {
  return (
    <PageTransition>
      <div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(personSchema()) }}
        />
        <Hero />
        <Spotlight />
        <VelocityMarquee items={marqueeItems} />
        <About />
        <Experience />
        <ProjectsSection />
        <Contact />
      </div>
    </PageTransition>
  );
}
