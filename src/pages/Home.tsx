import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Target,
  Users,
  TrendingUp,
  Lightbulb,
  Handshake,
  BarChart3,
  Quote,
  RefreshCw,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

interface Service {
  icon: React.ElementType;
  title: string;
  description: string;
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  feedback: string;
  rating: number;
}

const SERVICES: Service[] = [
  {
    icon: Lightbulb,
    title: "Strategic Consulting",
    description:
      "Data-driven strategies tailored to accelerate growth and unlock new market opportunities.",
  },
  {
    icon: Handshake,
    title: "Relationship Management",
    description:
      "Build meaningful, lasting partnerships that drive loyalty and sustainable success.",
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description:
      "Actionable insights and reporting that turn raw data into maximum measurable results.",
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sarah Chen",
    role: "CEO",
    company: "Northwind Labs",
    feedback:
      "They transformed our go-to-market approach. Revenue grew 42% in two quarters — the smartest partner we've worked with.",
    rating: 5,
  },
  {
    name: "Marcus Bell",
    role: "VP Marketing",
    company: "Vertex Group",
    feedback:
      "Beyond strategy, they genuinely cared about our team and customers. The relationships they built are priceless.",
    rating: 5,
  },
  {
    name: "Priya Nair",
    role: "Founder",
    company: "BloomTech",
    feedback:
      "Clear, measurable results from day one. Their analytics dashboards gave us clarity we never had before.",
    rating: 5,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const load = () => {
    setLoading(true);
    const t = setTimeout(() => {
      setServices(SERVICES);
      setTestimonials(TESTIMONIALS);
      setLoading(false);
    }, 900);
    return () => clearTimeout(t);
  };

  useEffect(() => {
    const cleanup = load();
    return cleanup;
  }, []);

  const isEmpty = !loading && services.length === 0 && testimonials.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <div className="mx-auto w-full max-w-[1200px] px-4 py-10 md:px-6 md:py-16">
        {/* Hero Section */}
        {loading ? (
          <Card className="mb-12 overflow-hidden shadow-sm">
            <CardContent className="flex flex-col items-center gap-6 p-10 md:p-16">
              <Skeleton className="h-16 w-16 rounded-2xl" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-11 w-40 rounded-xl" />
            </CardContent>
          </Card>
        ) : isEmpty ? (
          <Card className="mb-12 shadow-sm">
            <CardContent className="flex flex-col items-center gap-4 p-16 text-center">
              <p className="text-lg font-medium text-muted-foreground">
                No content available
              </p>
              <Button onClick={load} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Retry
              </Button>
            </CardContent>
          </Card>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mb-16"
          >
            <motion.div variants={item}>
              <Card className="relative overflow-hidden border-none bg-primary text-primary-foreground shadow-lg">
                <div className="pointer-events-none absolute inset-0 opacity-20">
                  <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent blur-3xl" />
                  <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-accent blur-3xl" />
                </div>
                <CardContent className="relative z-10 flex flex-col items-center gap-6 p-10 text-center md:p-20">
                  <motion.div
                    initial={{ scale: 0.8, rotate: -8 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 160, damping: 12 }}
                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-accent text-accent-foreground shadow-md"
                  >
                    <Target className="h-9 w-9" />
                  </motion.div>
                  <Badge className="bg-accent/20 text-primary-foreground hover:bg-accent/30">
                    Apex Consulting
                  </Badge>
                  <h1 className="max-w-3xl text-3xl font-bold leading-tight tracking-tight md:text-5xl">
                    Smart Strategies, Meaningful Relationships, Maximum Results
                  </h1>
                  <p className="max-w-xl text-base text-primary-foreground/80 md:text-lg">
                    We help ambitious teams grow with clarity. Strategy that
                    moves, relationships that last, outcomes that matter.
                  </p>
                  <motion.div whileTap={{ scale: 0.96 }}>
                    <Button
                      size="lg"
                      className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
                    >
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Service Overview + Testimonials */}
        {!isEmpty && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                What We Do
              </h2>
              <p className="mt-1 text-muted-foreground">
                Focused services designed to deliver maximum impact.
              </p>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              animate={loading ? undefined : "show"}
              className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-3"
            >
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="shadow-sm">
                      <CardHeader>
                        <Skeleton className="h-12 w-12 rounded-xl" />
                        <Skeleton className="mt-4 h-6 w-2/3" />
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                      </CardContent>
                    </Card>
                  ))
                : services.map((s) => {
                    const Icon = s.icon;
                    return (
                      <motion.div
                        key={s.title}
                        variants={item}
                        whileHover={{ y: -6 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <Card className="h-full shadow-sm transition-shadow hover:shadow-md">
                          <CardHeader>
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                              <Icon className="h-6 w-6" />
                            </div>
                            <CardTitle className="mt-4">{s.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="text-sm leading-relaxed">
                              {s.description}
                            </CardDescription>
                          </CardContent>
                          <CardFooter>
                            <Button
                              variant="ghost"
                              className="gap-1 px-0 text-accent hover:bg-transparent hover:text-accent/80"
                            >
                              Learn more <ArrowRight className="h-4 w-4" />
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    );
                  })}
            </motion.div>

            <Separator className="mb-16" />

            <div className="mb-8 flex items-center gap-3">
              <Users className="h-6 w-6 text-accent" />
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Client Success Stories
                </h2>
                <p className="mt-1 text-muted-foreground">
                  Real results from partners who trust us.
                </p>
              </div>
            </div>

            <motion.div
              variants={container}
              initial="hidden"
              animate={loading ? undefined : "show"}
              className="grid grid-cols-1 gap-6 md:grid-cols-3"
            >
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} className="shadow-sm">
                      <CardContent className="space-y-3 p-6">
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-10 w-1/2" />
                      </CardContent>
                    </Card>
                  ))
                : testimonials.map((t) => (
                    <motion.div
                      key={t.name}
                      variants={item}
                      whileHover={{ y: -6 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Card className="flex h-full flex-col shadow-sm transition-shadow hover:shadow-md">
                        <CardContent className="flex flex-1 flex-col gap-4 p-6">
                          <Quote className="h-8 w-8 text-accent/40" />
                          <p className="flex-1 text-sm leading-relaxed text-foreground">
                            “{t.feedback}”
                          </p>
                          <div className="flex gap-0.5">
                            {Array.from({ length: t.rating }).map((_, i) => (
                              <Star
                                key={i}
                                className="h-4 w-4 fill-accent text-accent"
                              />
                            ))}
                          </div>
                          <Separator />
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                              {t.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {t.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {t.role}, {t.company}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}
