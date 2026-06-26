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

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

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
    ...Array.from(new Set(posts.map((p) => p.category))),
  ];

  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      activeCategory === "All" || post.category === activeCategory;
    const matchesQuery =
      query.trim() === "" ||
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
      post.author.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto w-full max-w-[1200px] px-4 py-10 md:px-8"
    >
      <PageHeader
        title="Insights & Resources"
        subtitle="Practical guidance, industry insights, and expert perspectives on audit, tax, and risk advisory."
      />

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
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="shadow-sm">
              <CardHeader className="space-y-3">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-4 w-24" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <Card className="mt-8 shadow-sm">
          <CardContent className="flex flex-col items-center gap-4 p-16 text-center">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <p className="text-lg font-medium text-muted-foreground">
              No articles found
            </p>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => {
                setQuery("");
                setActiveCategory("All");
                loadPosts();
              }}
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredPosts.map((post) => (
            <motion.div key={post.id} variants={item}>
              <Card className="flex h-full flex-col shadow-sm transition-shadow hover:shadow-md">
                <CardHeader className="space-y-3">
                  <Badge variant="secondary" className="w-fit">
                    {post.category}
                  </Badge>
                  <CardTitle className="text-lg leading-snug">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {formatDate(post.published_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.read_time}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="gap-1 px-0">
                    Read more
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
