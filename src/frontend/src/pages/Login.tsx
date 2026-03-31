import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { login, isLoggingIn, identity } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) {
      navigate({ to: "/" });
    }
  }, [identity, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.56 0.2 260 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.56 0.2 260 / 0.3) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-card-surface rounded-2xl p-10 text-center shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center glow-blue">
              <Zap className="w-7 h-7 text-white" fill="white" />
            </div>
            <span className="font-display text-3xl font-bold tracking-wide text-white">
              PY<span className="text-accent">QUEST</span>
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold text-white mb-3">
            Start Your Python Journey
          </h1>
          <p className="text-body mb-8 leading-relaxed">
            Level up your coding skills through gamified challenges, quests, and
            real-world Python projects.
          </p>
          <Button
            className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 glow-blue transition-all duration-300"
            onClick={() => login()}
            disabled={isLoggingIn}
            data-ocid="login.primary_button"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              "Begin Quest →"
            )}
          </Button>
          <p className="mt-6 text-sm text-muted-custom">
            Secure login powered by Internet Identity
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            {[
              { label: "Levels", value: "30+" },
              { label: "Challenges", value: "200+" },
              { label: "Learners", value: "10K+" },
            ].map((stat) => (
              <div key={stat.label} className="bg-secondary/50 rounded-xl p-3">
                <div className="font-display text-xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-custom mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
