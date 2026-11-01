import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Server, Users, Cloud, Wrench, Loader2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { submitLead } from "@/lib/leads";

function ManagedWaitlistForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    setErrorMsg("");

    try {
      const result = await submitLead(email, "get-started-managed");

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
        className="space-y-4"
      >
        <div className="flex items-center gap-3 text-primary">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Check className="w-4 h-4" />
          </div>
          <span className="font-mono text-sm">You're on the list.</span>
        </div>
        <a href="https://cal.com/aljaz/enclava" target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="w-full h-12 rounded-none text-sm border-white/10 hover:bg-white/5 hover:text-white transition-all font-mono">
            Schedule a Call (Optional)
          </Button>
        </a>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        type="email"
        placeholder="you@company.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={status === "loading"}
        className="h-12 px-4 rounded-none text-sm bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary focus:ring-primary font-mono"
      />
      <Button
        type="submit"
        disabled={status === "loading" || !email.trim()}
        className="w-full h-12 rounded-none text-sm bg-primary text-background hover:bg-primary/90 transition-all font-mono disabled:opacity-50"
      >
        {status === "loading" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            Join Waitlist <ArrowRight className="ml-2 w-4 h-4" />
          </>
        )}
      </Button>
      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-400 text-xs font-mono"
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}

const deploymentOptions = [
  {
    icon: Server,
    title: "Self-Hosted",
    subtitle: "I'll run it myself",
    description: "Deploy on your own infrastructure with full control. Open source, community supported.",
    features: [
      "Full control over your environment",
      "Your infrastructure, your rules",
      "Community support & documentation"
    ],
    accent: "from-emerald-500/10 to-green-500/10",
    borderAccent: "hover:border-emerald-500/30",
    cta: (
      <a href="https://docs.enclava.ai" target="_blank" rel="noopener noreferrer" className="block">
        <Button className="w-full h-12 rounded-none text-sm bg-emerald-500 text-white hover:bg-emerald-600 transition-all font-mono">
          View Documentation <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </a>
    )
  },
  {
    icon: Cloud,
    title: "Hosted",
    subtitle: "Host it for me",
    description: "Enclava as a service. We run the infrastructure, you focus on building. Coming soon.",
    features: [
      "No infrastructure to manage",
      "Self-serve checkout",
      "Usage-based pricing"
    ],
    accent: "from-blue-500/10 to-cyan-500/10",
    borderAccent: "hover:border-blue-500/30",
    cta: <ManagedWaitlistForm />
  },
  {
    icon: Users,
    title: "White Glove",
    subtitle: "Build it with me",
    description: "We work backwards from your needs to design and deploy the optimal solution for your organization.",
    features: [
      "Custom architecture design",
      "End-to-end implementation",
      "Ongoing partnership & support"
    ],
    accent: "from-purple-500/10 to-pink-500/10",
    borderAccent: "hover:border-purple-500/30",
    cta: (
      <a href="https://cal.com/aljaz/enclava" target="_blank" rel="noopener noreferrer" className="block">
        <Button className="w-full h-12 rounded-none text-sm bg-purple-500 text-white hover:bg-purple-600 transition-all font-mono">
          Schedule a Call <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </a>
    )
  }
];

export default function GetStarted() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden font-sans selection:bg-primary/30 selection:text-white">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight">
                How do you want to deploy?
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Choose the deployment model that fits your team and requirements.
              </p>
            </div>

            {/* Deployment Options */}
            <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {deploymentOptions.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`group relative bg-gradient-to-br ${option.accent} border border-white/10 p-8 ${option.borderAccent} transition-all duration-300`}
                >
                  <option.icon className="w-10 h-10 text-white/80 mb-6" strokeWidth={1.5} />

                  <h3 className="text-2xl font-display font-bold text-white mb-1">
                    {option.title}
                  </h3>
                  <p className="text-sm text-primary/80 mb-4 font-mono">
                    {option.subtitle}
                  </p>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {option.description}
                  </p>

                  <ul className="space-y-3 mb-8 border-t border-white/5 pt-6">
                    {option.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-xs text-gray-400">
                        <div className="w-1 h-1 bg-primary rounded-full mr-3 mt-1.5 flex-shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {option.cta}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Custom Work Section */}
        <section className="py-24 border-t border-white/5">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="p-10 border border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Wrench className="w-7 h-7 text-primary" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-4">
                      Need custom integrations?
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      Regardless of how you deploy, our engineering team works directly with you to build
                      the integrations and tools you need. We're here to help you unlock productivity
                      and automation across your organization.
                    </p>
                    <ul className="grid md:grid-cols-3 gap-4 mb-8">
                      {[
                        "Data connectors & ETL pipelines",
                        "Custom AI agents & workflows",
                        "Legacy system integration"
                      ].map((item, i) => (
                        <li key={i} className="flex items-center text-sm text-gray-300">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <a href="https://cal.com/aljaz/enclava" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="h-12 px-6 rounded-none text-sm border-white/20 hover:border-primary hover:text-primary transition-all font-mono">
                        Talk to Engineering <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
