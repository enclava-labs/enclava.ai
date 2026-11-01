import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Loader2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { submitLead } from "@/lib/leads";

interface WaitlistFormProps {
  className?: string;
  source?: string;
}

export default function WaitlistForm({ className, source = "hero" }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const result = await submitLead(email, source);

      if (result.status === "ok") {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
        setErrorMsg(result.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`flex items-center gap-3 text-primary ${className}`}
      >
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Check className="w-5 h-5" />
        </div>
        <span className="font-mono text-sm">You're on the list. We'll be in touch.</span>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading"}
            className="h-14 px-5 rounded-lg text-base bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary focus:ring-primary font-mono"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={status === "loading" || !email.trim()}
          className="h-14 px-8 rounded-lg text-base bg-primary text-background hover:bg-primary/90 transition-all font-mono tracking-tight disabled:opacity-50"
        >
          {status === "loading" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              Join Waitlist <ArrowRight className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
      </div>
      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-400 text-sm mt-2 font-mono"
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
