import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/lib/supabase";

type FormState = {
  name: string;
  email: string;
  message: string;
};

const initialForm: FormState = { name: "", email: "", message: "" };

export default function Contact() {
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  const validate = (): boolean => {
    const next: Partial<FormState> = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!form.email.trim()) {
      next.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Please enter a valid email address.";
    }
    if (!form.message.trim()) next.message = "Please enter a message.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("contact_messages").insert([
        {
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
        },
      ]);
      if (error) throw error;
      setSubmitted(true);
      setForm(initialForm);
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-auto w-full max-w-[1200px] px-4 py-10 md:px-8"
    >
      <PageHeader
        title="Contact Us"
        subtitle="Have a question or want to work together? Send us a message and our team will get back to you shortly."
      />

      <div className="mt-8 grid grid-cols-1 gap-6">
        {/* Contact info strip */}
        {loading ? (
          <Card className="shadow-sm">
            <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Card className="shadow-sm transition-shadow hover:shadow-md">
              <CardContent className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      hello@company.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Office</p>
                    <p className="text-sm text-muted-foreground">
                      123 Market St, Suite 400
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Contact Form */}
        {loading ? (
          <Card className="shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-40" />
              <Skeleton className="mt-2 h-4 w-64" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-10 w-32" />
            </CardContent>
          </Card>
        ) : (
          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Card className="shadow-sm transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  Fill in the form below and we&apos;ll respond within 24 hours.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center gap-4 py-12 text-center"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                      <CheckCircle2 className="h-7 w-7" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-semibold">Message sent!</p>
                      <p className="text-sm text-muted-foreground">
                        Thanks for reaching out. We&apos;ll be in touch soon.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setSubmitted(false)}
                    >
                      Send another message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          htmlFor="name"
                          className="text-sm font-medium"
                        >
                          Name
                        </label>
                        <Input
                          id="name"
                          placeholder="Jane Doe"
                          value={form.name}
                          onChange={(e) => handleChange("name", e.target.value)}
                          aria-invalid={!!errors.name}
                        />
                        {errors.name && (
                          <p className="text-xs text-destructive">
                            {errors.name}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="text-sm font-medium"
                        >
                          Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="jane@example.com"
                          value={form.email}
                          onChange={(e) =>
                            handleChange("email", e.target.value)
                          }
                          aria-invalid={!!errors.email}
                        />
                        {errors.email && (
                          <p className="text-xs text-destructive">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="message"
                        className="text-sm font-medium"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        placeholder="Tell us how we can help..."
                        value={form.message}
                        onChange={(e) =>
                          handleChange("message", e.target.value)
                        }
                        aria-invalid={!!errors.message}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      {errors.message && (
                        <p className="text-xs text-destructive">
                          {errors.message}
                        </p>
                      )}
                    </div>

                    {submitError && (
                      <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        {submitError}
                      </p>
                    )}

                    <motion.div whileTap={{ scale: 0.97 }}>
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="gap-2"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Map */}
        {loading ? (
          <Card className="shadow-sm">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full rounded-lg" />
            </CardContent>
          </Card>
        ) : (
          <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
            <Card className="overflow-hidden shadow-sm transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle>Find us</CardTitle>
                <CardDescription>
                  123 Market St, Suite 400, San Francisco, CA
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border">
                  <iframe
                    title="Company location"
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-122.4194%2C37.7649%2C-122.3894%2C37.7849&layer=mapnik&marker=37.7749%2C-122.4044"
                    className="h-64 w-full border-0"
                    loading="lazy"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
