import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  FileSearch,
  Calculator,
  TrendingUp,
  Building2,
  Scale,
  Search,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/PageHeader";
import { supabase } from "@/lib/supabase";

interface Service {
  id: string;
  title: string;
  category: string;
  short_description: string;
  description: string;
  features: string[];
  icon: string;
  duration?: string;
  starting_price?: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  FileSearch,
  Calculator,
  TrendingUp,
  Building2,
  Scale,
};

const fallbackServices: Service[] = [
  {
    id: "1",
    title: "Financial Statement Audit",
    category: "Assurance",
    short_description: "Independent examination of your financial statements.",
    description:
      "Our financial statement audit provides an independent opinion on whether your financial statements are presented fairly, in all material respects, in accordance with the applicable financial reporting framework. We deliver insight that builds confidence with investors, lenders, and stakeholders.",
    features: [
      "GAAP & IFRS compliance review",
      "Risk-based audit methodology",
      "Detailed management letter",
      "Stakeholder-ready opinion",
    ],
    icon: "FileSearch",
    duration: "4-8 weeks",
    starting_price: "$12,000",
  },
  {
    id: "2",
    title: "Internal Controls Review",
    category: "Assurance",
    short_description: "Evaluate and strengthen your control environment.",
    description:
      "We assess the design and operating effectiveness of your internal controls over financial reporting, identifying gaps and recommending practical improvements that reduce risk and improve operational efficiency.",
    features: [
      "SOX readiness assessment",
      "Control gap analysis",
      "Remediation roadmap",
      "Ongoing monitoring framework",
    ],
    icon: "ShieldCheck",
    duration: "3-6 weeks",
    starting_price: "$9,500",
  },
  {
    id: "3",
    title: "Tax Compliance & Advisory",
    category: "Tax",
    short_description: "Optimize tax position and ensure compliance.",
    description:
      "From corporate tax filings to strategic planning, our tax specialists help you minimize liabilities while staying fully compliant with evolving regulations across jurisdictions.",
    features: [
      "Corporate & individual filings",
      "Tax planning strategies",
      "Multi-jurisdiction support",
      "Audit defense representation",
    ],
    icon: "Calculator",
    duration: "Ongoing",
    starting_price: "$4,000",
  },
  {
    id: "4",
    title: "Risk Advisory",
    category: "Advisory",
    short_description: "Identify, assess, and mitigate business risk.",
    description:
      "Our risk advisory team helps you anticipate threats and build resilience. We provide enterprise risk assessments, fraud risk reviews, and tailored mitigation strategies aligned with your business objectives.",
    features: [
      "Enterprise risk assessment",
      "Fraud detection & prevention",
      "Cyber risk evaluation",
      "Business continuity planning",
    ],
    icon: "TrendingUp",
    duration: "2-5 weeks",
    starting_price: "$7,500",
  },
  {
    id: "5",
    title: "Forensic Accounting",
    category: "Advisory",
    short_description: "Investigate financial discrepancies and fraud.",
    description:
      "When the numbers don't add up, our forensic accountants uncover the truth. We provide litigation support, fraud investigation, and expert testimony backed by rigorous analysis.",
    features: [
      "Fraud investigation",
      "Litigation support",
      "Expert witness testimony",
      "Asset tracing",
    ],
    icon: "Scale",
    duration: "Varies",
    starting_price: "Custom",
  },
  {
    id: "6",
    title: "Corporate Governance",
    category: "Advisory",
    short_description: "Build strong, accountable governance structures.",
    description:
      "We help boards and executives establish governance frameworks that promote transparency, accountability, and long-term value creation, ensuring alignment with regulatory expectations.",
    features: [
      "Board effectiveness review",
      "Policy & charter development",
      "Compliance frameworks",
      "ESG reporting support",
    ],
    icon: "Building2",
    duration: "4-6 weeks",
    starting_price: "$8,000",
  },
];

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .order("title", { ascending: true });
        if (error) throw error;
        const result =
          data && data.length > 0 ? (data as Service[]) : fallbackServices;
        if (active) {
          setServices(result);
          setSelectedId(result[0]?.id ?? null);
        }
      } catch {
        if (active) {
          setServices(fallbackServices);
          setSelectedId(fallbackServices[0].id);
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const filtered = services.filter(
    (s) =>
      s.title.toLowerCase().includes(query.toLowerCase()) ||
      s.category.toLowerCase().includes(query.toLowerCase()) ||
      s.short_description.toLowerCase().includes(query.toLowerCase())
  );

  const selected =
    filtered.find((s) => s.id === selectedId) ?? filtered[0] ?? null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-[1200px] px-4 py-8 md:px-6"
    >
      <PageHeader
        title="Our Services"
        subtitle="Comprehensive audit, tax, and advisory services tailored to your business needs."
      />

      <div className="mt-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services..."
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-2/3 rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-40 w-full rounded-lg" />
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <Card className="mt-8 border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <Search className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="text-lg font-semibold">No services found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search terms.
              </p>
            </div>
            <Button variant="outline" onClick={() => setQuery("")}>
              Clear search
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
          {/* Service List */}
          <div className="space-y-4">
            {filtered.map((service, idx) => {
              const Icon = iconMap[service.icon] ?? FileSearch;
              const isActive = selected?.id === service.id;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                >
                  <button
                    onClick={() => setSelectedId(service.id)}
                    className="w-full text-left"
                  >
                    <Card
                      className={`cursor-pointer shadow-sm transition-colors ${
                        isActive
                          ? "border-primary ring-1 ring-primary"
                          : "hover:border-primary/40"
                      }`}
                    >
                      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <CardTitle className="truncate text-base">
                              {service.title}
                            </CardTitle>
                            <ArrowRight
                              className={`h-4 w-4 shrink-0 transition-opacity ${
                                isActive ? "opacity-100" : "opacity-0"
                              }`}
                            />
                          </div>
                          <CardDescription className="mt-1 line-clamp-2">
                            {service.short_description}
                          </CardDescription>
                          <Badge variant="secondary" className="mt-2">
                            {service.category}
                          </Badge>
                        </div>
                      </CardHeader>
                    </Card>
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Service Details */}
          <div>
            {selected && (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <Card className="shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        {(() => {
                          const Icon = iconMap[selected.icon] ?? FileSearch;
                          return <Icon className="h-7 w-7" />;
                        })()}
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {selected.category}
                        </Badge>
                        <CardTitle className="text-2xl">
                          {selected.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="leading-relaxed text-muted-foreground">
                      {selected.description}
                    </p>

                    <Separator />

                    <div>
                      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        What's included
                      </h3>
                      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {selected.features.map((f) => (
                          <li
                            key={f}
                            className="flex items-start gap-2 text-sm"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-lg border bg-muted/40 p-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          Typical Duration
                        </p>
                        <p className="mt-1 text-lg font-semibold">
                          {selected.duration ?? "Varies"}
                        </p>
                      </div>
                      <div className="rounded-lg border bg-muted/40 p-4">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          Starting From
                        </p>
                        <p className="mt-1 text-lg font-semibold">
                          {selected.starting_price ?? "Custom"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-3 sm:flex-row">
                    <Button className="w-full transition-transform active:scale-95 sm:w-auto">
                      Request a Consultation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full transition-transform active:scale-95 sm:w-auto"
                    >
                      Download Brochure
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
