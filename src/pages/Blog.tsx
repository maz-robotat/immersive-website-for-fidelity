import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { PageHeader } from "@/components/PageHeader";
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
import { Skeleton } from "@/components/ui/skeleton";
import {
  CalendarDays,
  Clock,
  Search,
  RefreshCw,
  ArrowRight,
  FileText,
  User,
} from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  read_time: string;
  published_at: string;
  cover_image?: string;
}

const FALLBACK_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "5 Red Flags Auditors Look For in Financial Statements",
    excerpt:
      "Understanding the common warning signs can help your business stay compliant and audit-ready year round. We break down the indicators that draw the most scrutiny.",
    category: "Audit",
    author: "Maria Chen",
    read_time: "6 min read",
    published_at: "2024-05-12",
  },
  {
    id: "2",
    title: "Preparing for Your First External Audit",
    excerpt:
      "A step-by-step playbook for small and mid-sized companies approaching their first independent financial audit, from documentation to stakeholder communication.",
    category: "Compliance",
    author: "David Okoro",
    read_time: "8 min read",
    published_at: "2024-04-28",
  },
  {
    id: "3",
    title: "Internal Controls That Actually Prevent Fraud",
    excerpt:
      "Not all controls are created equal. Learn which internal control frameworks deliver real protection and how to implement them without slowing your team down.",
    category: "Risk",
    author: "Priya Raman",
    read_time: "5 min read",
    published_at: "2024-04-10",
  },
  {
    id: "4",
    title: "The Future of Audit: AI and Continuous Monitoring",
    excerpt:
      "Technology is reshaping how audits are performed. We explore how AI-driven analytics and continuous monitoring are changing the assurance landscape.",
    category: "Insights",
    author: "Maria Chen",
    read_time: "7 min read",
    published_at: "2024-03-22",
  },
  {
    id: "5",
    title: "Tax Audit Survival Guide for Growing Businesses",
    excerpt:
      "Facing a tax audit can be stressful. This practical guide covers documentation, representation, and how to respond to common examiner requests.",
    category: "Tax",
    author: "David Okoro",
    read_time: "9 min read",
    published_at: "2024-03-05",
  },
  {
    id: "6",
    title: "Reading an Audit Report: A Stakeholder's Guide",
    excerpt:
      "Audit opinions carry weight far beyond the finance department. Learn to interpret qualified, adverse, and unqualified opinions and what they mean for you.",
    category: "Insights",
    author: "Priya Raman",
    read_time: "4 min read",
    published_at: "2024-02-18",
  },
];

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return value;
  }
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");

  async function loadPosts() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false });

      if (error || !data || data.length === 0) {
        setPosts(FALLBACK_POSTS);
      } else {
        setPosts(data as BlogPost[]);
      }
    } catch {
      setPosts(FALLBACK_POSTS);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  const categories = [
    "All",
    ...Array.from(new Set(posts.map((p) => p.category))).filter(Boolean),
  ];

  const filtered = posts.filter((post) => {
    const matchesCategory =
      activeCategory === "All" || post.category === activeCategory;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      post.title.toLowerCase().includes(q) ||
      post.excerpt.toLowerCase().includes(q) ||
      post.author.toLowerCase().includes(q);
    return matchesCategory && matchesQuery;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto w-full max-w-[1200px] px-4 py-8 md:px-6 md:py-12"
    >
      <PageHeader
        title="Insights & Articles"
        subtitle="Expert perspectives on finance audits, compliance, and risk management."
      />

      {/* Controls */}
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Badge
              key={cat}
              variant={activeCategory === cat ? "default" : "secondary"}
              onClick={() => setActiveCategory(cat)}
              className="cursor-pointer select-none px-3 py-1 transition-transform active:scale-95"
            >
              {cat}
            </Badge>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden shadow-sm">
              <Skeleton className="h-40 w-full" />
              <CardHeader className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && filtered.length === 0 && (
        <div className="mt-16 flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <FileText className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No content available</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            We couldn't find any articles matching your search. Try adjusting
            your filters or reload the page.
          </p>
          <Button
            onClick={() => {
              setQuery("");
              setActiveCategory("All");
              loadPosts();
            }}
            className="mt-6 transition-transform active:scale-95"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      )}

      {/* Content */}
      {!loading && filtered.length > 0 && (
        <div className="mt-8 space-y-8">
          {/* Featured post */}
          {featured && (
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Card className="overflow-hidden shadow-sm md:grid md:grid-cols-2">
                <div className="flex h-48 items-center justify-center bg-gradient-to-br from-primary/90 to-accent text-primary-foreground md:h-full">
                  <FileText className="h-16 w-16 opacity-80" />
                </div>
                <div className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Badge>{featured.category}</Badge>
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Featured
                      </span>
                    </div>
                    <CardTitle className="mt-2 text-2xl">
                      {featured.title}
                    </CardTitle>
                    <CardDescription className="mt-2 text-base">
                      {featured.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {featured.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-4 w-4" />
                        {formatDate(featured.published_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {featured.read_time}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="transition-transform active:scale-95">
                      Read article
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Grid of posts */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  whileHover={{ y: -6 }}
                >
                  <Card className="flex h-full flex-col overflow-hidden shadow-sm transition-shadow hover:shadow-md">
                    <div className="flex h-36 items-center justify-center bg-muted">
                      <FileText className="h-10 w-10 text-muted-foreground/50" />
                    </div>
                    <CardHeader>
                      <Badge variant="secondary" className="w-fit">
                        {post.category}
                      </Badge>
                      <CardTitle className="mt-2 text-lg leading-snug">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="mt-1 line-clamp-3">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {post.author}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {post.read_time}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex items-center justify-between border-t pt-4">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {formatDate(post.published_at)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="transition-transform active:scale-95"
                      >
                        Read
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
