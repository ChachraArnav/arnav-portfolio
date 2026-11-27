import Link from "next/link";
import { ScrollStatement } from "@/components/effects/scroll-statement";
import { SectionHeading } from "@/components/ui/section-heading";
import { education } from "@/data/experience";
import { getProject } from "@/data/projects";
import { skillGroups } from "@/data/skills";

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="section border-t border-line">
      <div className="container-page">
        <SectionHeading id="about-title" title="About" index="01">
          <p>
            A Computer Science student who likes practical problems: the kind where the data is
            messy, the users are real and the result has to work every time.
          </p>
        </SectionHeading>

        <div className="mb-20 md:mb-28">
          <ScrollStatement text="I like practical problems: *messy data,* real users, and software that has to *work every time.*" />
        </div>

        <div className="grid gap-14 md:grid-cols-12 md:gap-x-8">
          <div className="space-y-5 text-base text-muted md:col-span-7 md:col-start-6 md:row-start-1">
            <p>
              I started in Computer Programming at Georgian College, graduating with honours, then
              moved into the Honours Computer Science degree at Lakehead University through the
              Georgian–Lakehead pathway. I&apos;m now in my final year and graduate in April 2027.
            </p>
            <p>
              My co-op with York Region&apos;s Paramedic and Senior Services was where the
              coursework met real operations. I pulled operational data with SQL, looked for where
              time was being lost, built Power BI dashboards that supported staffing decisions and
              automated reports that used to be put together by hand. It also showed me how much
              reliability matters when other people act on your numbers.
            </p>
            <p>
              Since then I&apos;ve been building in three directions: full-stack web applications,
              data analysis and machine learning, and AI tools, most recently an interview coach that
              runs speech, language and vision models entirely in the browser. I enjoy
              picking up unfamiliar technology quickly, and I pay attention to the parts that make
              software dependable: validation, testing and clear structure.
            </p>
          </div>

          <aside aria-labelledby="education-title" className="md:col-span-4 md:row-start-1">
            <h3 id="education-title" className="mb-4 text-sm font-medium text-text">
              Education
            </h3>
            <ol className="border-l border-line">
              {education.map((entry) => (
                <li key={entry.id} className="relative pb-6 pl-5 last:pb-0">
                  <span
                    aria-hidden="true"
                    className="absolute top-2 -left-[3.5px] size-1.5 rounded-full bg-accent"
                  />
                  <p className="text-sm font-medium text-text">{entry.institution}</p>
                  <p className="text-sm text-muted">{entry.credential}</p>
                  <p className="mt-1 text-xs text-subtle">{entry.status}</p>
                </li>
              ))}
            </ol>
          </aside>
        </div>

        <div className="mt-20">
          <h3 id="skills-title" className="mb-2 text-lg font-semibold tracking-tight text-text">
            Toolkit
          </h3>
          <p className="mb-8 max-w-[60ch] text-sm text-muted">
            Grouped by what I use them for. Where a skill shows up in a project, it links there.
          </p>
          <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {skillGroups.map((group) => (
              <section key={group.id} aria-labelledby={`skills-${group.id}`} className="reveal">
                <h4
                  id={`skills-${group.id}`}
                  className="mb-3 border-b border-line pb-2 text-sm font-medium text-text"
                >
                  {group.label}
                </h4>
                <ul className="space-y-1.5">
                  {group.skills.map((skill) => {
                    const first = skill.projects?.[0];
                    const project = first ? getProject(first) : undefined;
                    return (
                      <li
                        key={skill.name}
                        className="flex items-baseline justify-between gap-4 text-sm"
                      >
                        <span className="text-muted">{skill.name}</span>
                        {project ? (
                          <Link
                            href={`/projects/${project.slug}`}
                            className="shrink-0 text-xs text-subtle hover:text-accent"
                            aria-label={`${skill.name} used in ${project.title}`}
                          >
                            {project.title}
                          </Link>
                        ) : skill.experience?.includes("york-region") ? (
                          <span className="shrink-0 text-xs text-subtle">York Region co-op</span>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
