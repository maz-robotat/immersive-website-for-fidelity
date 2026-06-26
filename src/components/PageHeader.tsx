import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-3"
    >
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground break-words">
        {title}
      </h1>
      {subtitle && (
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl break-words">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

export default PageHeader;
