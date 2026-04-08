import Footer from "@/components/Footer";
import NavOverlay from "@/components/NavOverlay";
import { Button } from "@/components/ui/button";
import { useActor } from "@/hooks/useActor";
import BrandStripSection from "@/sections/BrandStripSection";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const QUESTIONS = [
  {
    id: 1,
    question: "How would you describe your style?",
    options: [
      { label: "Minimalist", emoji: "◻️", desc: "Clean lines, neutral palette" },
      {
        label: "Bold",
        emoji: "🔴",
        desc: "Statement pieces, strong silhouettes",
      },
      {
        label: "Classic",
        emoji: "👔",
        desc: "Timeless cuts, enduring quality",
      },
      {
        label: "Eclectic",
        emoji: "🌀",
        desc: "Mixed textures, unexpected combinations",
      },
    ],
  },
  {
    id: 2,
    question: "What occasions do you dress for most?",
    options: [
      { label: "Work", emoji: "💼", desc: "Professional, polished" },
      { label: "Casual", emoji: "☀️", desc: "Everyday comfort with intention" },
      { label: "Events", emoji: "✨", desc: "Evenings, gatherings, occasions" },
      { label: "All of the above", emoji: "🌐", desc: "A full wardrobe life" },
    ],
  },
  {
    id: 3,
    question: "Which colors resonate with you?",
    options: [
      { label: "Neutrals", emoji: "🤍", desc: "Ivory, sand, stone, oat" },
      {
        label: "Earth Tones",
        emoji: "🍂",
        desc: "Terracotta, olive, rust, bark",
      },
      { label: "Bold Colors", emoji: "🟢", desc: "Emerald, cobalt, crimson" },
      {
        label: "Monochrome",
        emoji: "⬛",
        desc: "All black, all white, pure contrast",
      },
    ],
  },
  {
    id: 4,
    question: "What matters most when you shop?",
    options: [
      { label: "Quality", emoji: "💎", desc: "Craftsmanship over everything" },
      { label: "Price", emoji: "🏷️", desc: "Smart spending, real value" },
      {
        label: "Sustainability",
        emoji: "🌿",
        desc: "Ethical, conscious fashion",
      },
      { label: "Trendiness", emoji: "⚡", desc: "Fresh drops, what's now" },
    ],
  },
];

export default function QuizPage() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const progress =
    step < QUESTIONS.length ? (step / QUESTIONS.length) * 100 : 100;

  const handleSelect = (option: string) => {
    setSelected(option);
  };

  const handleNext = () => {
    if (!selected) return;
    const newAnswers = [...answers, selected];
    setAnswers(newAnswers);
    setSelected(null);
    if (step < QUESTIONS.length - 1) {
      setStep((s) => s + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleBack = () => {
    if (step === 0) return;
    setStep((s) => s - 1);
    setAnswers((prev) => prev.slice(0, -1));
    setSelected(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (actor) {
        await actor.submitQuiz(answers);
      }
      toast.success("Your style profile is ready!");
      setTimeout(() => navigate({ to: "/" }), 1000);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <NavOverlay />

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[oklch(var(--muted-foreground))] text-xs font-sans uppercase tracking-[0.3em] mb-3">
              Style Discovery
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-[oklch(var(--foreground))]">
              Find Your Story
            </h1>
          </div>

          <div className="mb-10" data-ocid="quiz.loading_state">
            <div className="flex justify-between items-center mb-2">
              <span className="font-sans text-xs text-[oklch(var(--muted-foreground))]">
                {isComplete
                  ? "Complete"
                  : `Step ${step + 1} of ${QUESTIONS.length}`}
              </span>
              <span className="font-sans text-xs text-[oklch(var(--foreground))]">
                {Math.round(isComplete ? 100 : progress)}%
              </span>
            </div>
            <div className="h-px bg-[oklch(var(--border))] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[oklch(var(--foreground))] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${isComplete ? 100 : progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!isComplete ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <h2 className="font-serif text-2xl md:text-3xl text-[oklch(var(--foreground))] text-center mb-8">
                  {QUESTIONS[step].question}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {QUESTIONS[step].options.map((opt) => (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => handleSelect(opt.label)}
                      className={`p-5 rounded-2xl border text-left transition-all duration-200 group ${
                        selected === opt.label
                          ? "border-[oklch(var(--foreground))] bg-[oklch(var(--foreground)/0.04)]"
                          : "border-[oklch(var(--border))] bg-white hover:border-[oklch(var(--foreground)/0.4)]"
                      }`}
                      data-ocid="quiz.toggle"
                    >
                      <span className="text-2xl mb-2 block">{opt.emoji}</span>
                      <p className="font-sans font-medium text-sm text-[oklch(var(--foreground))]">
                        {opt.label}
                      </p>
                      <p className="font-sans text-xs text-[oklch(var(--muted-foreground))] mt-1">
                        {opt.desc}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center mt-10">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={step === 0}
                    className="flex items-center gap-2 text-sm font-sans text-[oklch(var(--muted-foreground))] hover:text-[oklch(var(--foreground))] disabled:opacity-30 transition-colors"
                    data-ocid="quiz.secondary_button"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <Button
                    onClick={handleNext}
                    disabled={!selected}
                    className="rounded-full bg-[oklch(var(--foreground))] text-white px-8 py-3 font-sans text-xs uppercase tracking-widest hover:opacity-80 disabled:opacity-40 transition-all duration-300"
                    data-ocid="quiz.primary_button"
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-center"
                data-ocid="quiz.success_state"
              >
                <div className="w-20 h-20 rounded-full bg-[oklch(var(--pastel-blush))] flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">✨</span>
                </div>
                <h2 className="font-serif text-3xl md:text-4xl text-[oklch(var(--foreground))] mb-4">
                  Your Style Profile
                </h2>
                <p className="font-sans text-[oklch(var(--muted-foreground))] leading-relaxed mb-4">
                  Based on your answers, we've curated a personalized edit just
                  for you. Your style speaks of{" "}
                  <strong className="text-[oklch(var(--foreground))]">
                    {answers[0]}
                  </strong>
                  , with a preference for{" "}
                  <strong className="text-[oklch(var(--foreground))]">
                    {answers[2]}
                  </strong>{" "}
                  colors and a focus on{" "}
                  <strong className="text-[oklch(var(--foreground))]">
                    {answers[3]}
                  </strong>
                  .
                </p>

                <div className="grid grid-cols-2 gap-3 my-8 text-left">
                  {answers.map((answer, i) => (
                    <div
                      key={QUESTIONS[i].id}
                      className="bg-[oklch(var(--cream))] rounded-xl p-4 border border-[oklch(var(--border))]"
                      data-ocid={`quiz.item.${i + 1}`}
                    >
                      <p className="font-sans text-[10px] uppercase tracking-widest text-[oklch(var(--muted-foreground))] mb-1">
                        {QUESTIONS[i].question.split(" ").slice(0, 3).join(" ")}
                        ...
                      </p>
                      <p className="font-sans text-sm font-medium text-[oklch(var(--foreground))]">
                        {answer}
                      </p>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="rounded-full bg-[oklch(var(--foreground))] text-white px-10 py-4 h-auto font-sans text-xs uppercase tracking-[0.2em] hover:opacity-80 transition-opacity disabled:opacity-60"
                  data-ocid="quiz.submit_button"
                >
                  {isSubmitting ? "Saving..." : "Discover My Products"}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <BrandStripSection />
      <Footer />
    </main>
  );
}
