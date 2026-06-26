import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Building2, Target, Heart, Lightbulb, Users, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/PageHeader";
import { supabase } from "@/lib/supabase";

interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
}

interface Value {
  id: string;
  title: string;
  description: string;
}

interface TeamMember {
  id: string;
  name: string;
  title: string;
  photo_url?: string;
  bio?: string;
}

const FALLBACK_MILESTONES: Milestone[] = [
  { id: "1", year: "1998", title: "Founded", description: "Fidelity was founded with a vision to build smart strategies and meaningful client relationships." },
  { id: "2", year: "2005", title: "National Expansion", description: "Opened offices across the country, growing our team to over 100 professionals." },
  { id: "3", year: "2013", title: "Digital Transformation", description: "Launched our award-winning client platform, bringing services online for thousands." },
  { id: "4", year: "2020", title: "$5B Under Management", description: "Surpassed five billion dollars in assets, earning industry-wide recognition." },
  { id: "5", year: "2024", title: "Global Reach", description: "Extended our presence internationally, serving clients on three continents." },
];

const FALLBACK_VALUES: Value[] = [
  { id: "1", title: "Integrity", description: "We act with honesty and transparency in every relationship we build." },
  { id: "2", title: "Excellence", description: "We pursue maximum results through disciplined, smart strategies." },
  { id: "3", title: "Partnership", description: "We cultivate meaningful relationships that stand the test of time." },
];

const FALLBACK_TEAM: TeamMember[] = [
  { id: "1", name: "Eleanor Whitfield", title: "Chief Executive Officer", bio: "25 years guiding strategic vision and growth." },
  { id: "2", name: "Marcus Chen", title: "Chief Investment Officer", bio: "Leads our portfolio strategy and research." },
  { id: "3", name: "Priya Nair", title: "Head of Client Relations", bio: "Champions meaningful client partnerships." },
  { id: "4", name: "David Okafor", title: "Chief Technology Officer", bio: "Drives our digital innovation roadmap." },
  { id: "5", name: "Sofia Romano", title: "Director of Operations", bio: "Ensures seamless service delivery." },
  { id: "6", name: "James Patterson", title: "Head of Compliance", bio: "Safeguards trust and regulatory excellence." },
];

const valueIcons = [Target, Lightbulb, Heart];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function About() {
  const [loading, setLoading] = useState(true);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [values, setValues] = useState<Value[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [m, v, t] = await Promise.all([
          supabase.from("company_milestones").select("*").order("year", { ascending: true }),
          supabase.from("company_values").select("*"),
          supabase.from("team_members").select("*"),
        ]);
        if (!active) return;
        setMilestones(m.data && m.data.length ? (m.data as Milestone[]) : FALLBACK_MILESTONES);
        setValues(v.data && v.data.length ? (v.data as Value[]) : FALLBACK_VALUES);
        setTeam(t.data && t.data.length ? (t.data as TeamMember[]) : FALLBACK_TEAM);
      } catch {
        if (!active) return;
        setMilestones(FALLBACK_MILESTONES);
        setValues(FALLBACK_VALUES);
        setTeam(FALLBACK_TEAM);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const hasContent = milestones.length || values.length || team.length;

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1200px] px-4 py-10 md:px-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="mt-3 h-5 w-96" />
        <div className="mt-12 space-y-12">
          {[0, 1, 2].map((s) => (
            <div key={s} className="space-y-4">
              <Skeleton className="h-7 w-48" />
              <div className="grid gap-6 md:grid-cols-3">
                {[0, 1, 2].map((c) => (
                  <Skeleton key={c} className="h-40 w-full rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!hasContent) {
    return (
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-center px-4 py-32 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-lg font-medium text-muted-foreground">Information not available</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="mx-auto w-full max-w-[1200px] px-4 py-10 md:px-8">
        <PageHeader
          title="About Us"
          subtitle="Smart Strategies, Meaningful Relationships, Maximum Results — the story behind Fidelity."
        />
      </div>

      {/* Company History */}
      <section className="w-full bg-background py-14">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
          <div className="mb-8 flex items-center gap-3">
            <Building2 className="h-6 w-6 text-accent" />
            <h2 className="text-2xl font-semibold tracking-tight">Our History</h2>
          </div>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="relative space-y-6 before:absolute before:left-4 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border md:before:left-[7.5rem]"
          >
            {milestones.map((ms) => (
              <motion.div key={ms.id} variants={item} className="relative pl-12 md:pl-40">
                <span className="absolute left-[0.6rem] top-2 h-3 w-3 -translate-x-1/2 rounded-full bg-accent ring-4 ring-background md:left-[7.5rem]" />
                <span className="absolute left-0 top-1 hidden w-24 text-right text-sm font-bold text-accent md:block">
                  {ms.year}
                </span>
                <Card className="shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
                  <CardHeader className="pb-2">
                    <Badge variant="secondary" className="mb-2 w-fit md:hidden">
                      {ms.year}
                    </Badge>
                    <CardTitle className="text-lg">{ms.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{ms.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="w-full bg-muted/40 py-14">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
          <div className="mb-8 flex items-center gap-3">
            <Target className="h-6 w-6 text-accent" />
            <h2 className="text-2xl font-semibold tracking-tight">Mission &amp; Values</h2>
          </div>
          <Card className="mb-8 border-l-4 border-l-accent shadow-sm">
            <CardContent className="p-6 md:p-8">
              <p className="text-lg leading-relaxed text-foreground md:text-xl">
                Our mission is to empower clients with smart, forward-thinking strategies while building
                meaningful relationships rooted in trust — delivering maximum results at every stage of
                their journey.
              </p>
            </CardContent>
          </Card>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-3"
          >
            {values.map((val, i) => {
              const Icon = valueIcons[i % valueIcons.length];
              return (
                <motion.div key={val.id} variants={item}>
                  <Card className="h-full shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
                    <CardHeader>
                      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10">
                        <Icon className="h-5 w-5 text-accent" />
                      </div>
                      <CardTitle className="text-lg">{val.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">{val.description}</CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="w-full bg-background py-14">
        <div className="mx-auto w-full max-w-[1200px] px-4 md:px-8">
          <div className="mb-8 flex items-center gap-3">
            <Users className="h-6 w-6 text-accent" />
            <h2 className="text-2xl font-semibold tracking-tight">Meet the Team</h2>
          </div>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {team.map((member) => (
              <motion.div key={member.id} variants={item}>
                <Card className="h-full text-center shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
                  <CardContent className="flex flex-col items-center p-6">
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                        {initials(member.name)}
                      </div>
                    )}
                    <h3 className="mt-4 text-base font-semibold">{member.name}</h3>
                    <Badge variant="secondary" className="mt-2">
                      {member.title}
                    </Badge>
                    {member.bio && (
                      <p className="mt-3 text-sm text-muted-foreground">{member.bio}</p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}
