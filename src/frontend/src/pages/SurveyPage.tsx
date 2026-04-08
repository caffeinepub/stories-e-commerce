import Footer from "@/components/Footer";
import NavOverlay from "@/components/NavOverlay";
import { Button } from "@/components/ui/button";
import BrandStripSection from "@/sections/BrandStripSection";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface SurveyData {
  figure: string;
  proportions: string;
  skinTone: string;
  eyeColor: string;
  hairColor: string;
  hairTexture: string;
  stylePreference: string;
  colorPalette: string;
}

type StepOption = { label: string; icon: string };

interface BaseStep {
  id: number;
  title: string;
  subtitle: string;
}

interface RegularStep extends BaseStep {
  key: keyof SurveyData;
  options: StepOption[];
  isHair?: false;
}

interface HairStep extends BaseStep {
  isHair: true;
  hairColor: StepOption[];
  hairTexture: StepOption[];
}

type SurveyStep = RegularStep | HairStep;

const STEPS: SurveyStep[] = [
  {
    id: 1,
    key: "figure",
    title: "Your Figure",
    subtitle: "How would you describe your body shape?",
    options: [
      { label: "Petite", icon: "🌸" },
      { label: "Average / Standard", icon: "✦" },
      { label: "Tall", icon: "🌿" },
      { label: "Plus-Size", icon: "🌺" },
      { label: "Athletic / Muscular", icon: "⚡" },
      { label: "Curvy / Hourglass", icon: "🌙" },
    ],
  },
  {
    id: 2,
    key: "proportions",
    title: "Your Proportions",
    subtitle: "Where does your height tend to sit?",
    options: [
      { label: "Long Torso", icon: "↕" },
      { label: "Long Legs", icon: "↕" },
      { label: "Balanced", icon: "◈" },
      { label: "Short Torso", icon: "↕" },
      { label: "Short Legs", icon: "↕" },
    ],
  },
  {
    id: 3,
    key: "skinTone",
    title: "Skin Tone",
    subtitle: "Select the tone that best matches yours.",
    options: [
      { label: "Fair / Porcelain", icon: "🤍" },
      { label: "Light / Beige", icon: "🍑" },
      { label: "Medium / Olive", icon: "🌿" },
      { label: "Tan / Caramel", icon: "🍯" },
      { label: "Deep / Espresso", icon: "🍫" },
    ],
  },
  {
    id: 4,
    key: "eyeColor",
    title: "Eye Color",
    subtitle: "What color are your eyes?",
    options: [
      { label: "Blue", icon: "🔵" },
      { label: "Green", icon: "🟢" },
      { label: "Hazel", icon: "🌰" },
      { label: "Brown", icon: "🤎" },
      { label: "Dark Brown / Black", icon: "⚫" },
      { label: "Grey", icon: "🩶" },
    ],
  },
  {
    id: 5,
    isHair: true,
    title: "Your Hair",
    subtitle: "Select one option from each column.",
    hairColor: [
      { label: "Blonde", icon: "🌟" },
      { label: "Brunette", icon: "🍂" },
      { label: "Red / Auburn", icon: "🍁" },
      { label: "Black", icon: "🖤" },
      { label: "Grey / Silver", icon: "🩶" },
    ],
    hairTexture: [
      { label: "Straight", icon: "▬" },
      { label: "Wavy", icon: "〰" },
      { label: "Curly", icon: "🌀" },
      { label: "Coily", icon: "🌀" },
    ],
  },
  {
    id: 6,
    key: "stylePreference",
    title: "Style Vibe",
    subtitle: "Which aesthetic resonates most with you?",
    options: [
      { label: "Minimalist", icon: "◻" },
      { label: "Classic / Timeless", icon: "👔" },
      { label: "Romantic / Feminine", icon: "🌸" },
      { label: "Edgy / Bold", icon: "🔥" },
      { label: "Bohemian", icon: "🌿" },
      { label: "Streetwear", icon: "🏙" },
      { label: "Preppy / Smart", icon: "📚" },
    ],
  },
  {
    id: 7,
    key: "colorPalette",
    title: "Color Palette",
    subtitle: "Which palette feels most like your wardrobe?",
    options: [
      { label: "Neutrals & Earth Tones", icon: "🌾" },
      { label: "Pastels & Soft Hues", icon: "🌸" },
      { label: "Bold & Vibrant", icon: "🎨" },
      { label: "Monochrome & Dark", icon: "⬛" },
    ],
  },
];

const TOTAL_STEPS = STEPS.length;

export default function SurveyPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<SurveyData>>({});
  const [selectedHairColor, setSelectedHairColor] = useState<string | null>(
    null,
  );
  const [selectedHairTexture, setSelectedHairTexture] = useState<string | null>(
    null,
  );
  const [isComplete, setIsComplete] = useState(false);

  const currentStep = STEPS[step];
  const progress = ((step + 1) / TOTAL_STEPS) * 100;
  const isHairStep = "isHair" in currentStep && currentStep.isHair === true;
  const currentKey = !isHairStep ? (currentStep as RegularStep).key : null;
  const currentSelection = currentKey ? (answers[currentKey] ?? null) : null;
  const canProceed = isHairStep
    ? !!(selectedHairColor && selectedHairTexture)
    : !!currentSelection;

  const handleSelect = (value: string) => {
    if (!isHairStep && currentKey) {
      setAnswers((prev) => ({ ...prev, [currentKey]: value }));
    }
  };

  const handleNext = () => {
    if (!canProceed) return;
    let updatedAnswers = { ...answers };
    if (isHairStep) {
      updatedAnswers = {
        ...updatedAnswers,
        hairColor: selectedHairColor ?? "",
        hairTexture: selectedHairTexture ?? "",
      };
      setAnswers(updatedAnswers);
    }
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    } else {
      const finalData: SurveyData = {
        figure: updatedAnswers.figure ?? "",
        proportions: updatedAnswers.proportions ?? "",
        skinTone: updatedAnswers.skinTone ?? "",
        eyeColor: updatedAnswers.eyeColor ?? "",
        hairColor: updatedAnswers.hairColor ?? "",
        hairTexture: updatedAnswers.hairTexture ?? "",
        stylePreference: updatedAnswers.stylePreference ?? "",
        colorPalette: updatedAnswers.colorPalette ?? "",
      };
      localStorage.setItem("stories_style_survey", JSON.stringify(finalData));
      setIsComplete(true);
    }
  };

  const handleBack = () => {
    if (step === 0) return;
    setStep((s) => s - 1);
  };

  const summaryData = (() => {
    const stored = localStorage.getItem("stories_style_survey");
    if (!stored) return null;
    try {
      return JSON.parse(stored) as SurveyData;
    } catch {
      return null;
    }
  })();

  return (
    <main className="min-h-screen bg-white">
      <NavOverlay />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[oklch(var(--muted-foreground))] text-xs font-sans uppercase tracking-[0.3em] mb-3">
              Personal Style
            </p>
            <h1 className="font-serif text-4xl md:text-5xl text-[oklch(var(--foreground))]">
              Your Style Profile
            </h1>
            <p className="font-sans text-sm text-[oklch(var(--muted-foreground))] mt-3 leading-relaxed">
              Help us understand you so we can match pieces to your unique self.
            </p>
          </div>

          {!isComplete && (
            <div className="mb-10" data-ocid="survey.loading_state">
              <div className="flex justify-between items-center mb-3">
                <span className="font-sans text-xs text-[oklch(var(--muted-foreground))] uppercase tracking-widest">
                  Step {step + 1} of {TOTAL_STEPS}
                </span>
                <span className="font-sans text-xs text-[oklch(var(--foreground))]">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-px bg-[oklch(var(--border))] rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[oklch(var(--foreground))] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {!isComplete ? (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <div className="text-center mb-8">
                  <h2 className="font-serif text-2xl md:text-3xl text-[oklch(var(--foreground))] mb-2">
                    {currentStep.title}
                  </h2>
                  <p className="font-sans text-sm text-[oklch(var(--muted-foreground))]">
                    {currentStep.subtitle}
                  </p>
                </div>

                {isHairStep ? (
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="font-sans text-xs uppercase tracking-widest text-[oklch(var(--muted-foreground))] mb-3 text-center">
                        Color
                      </p>
                      <div className="flex flex-col gap-2">
                        {(currentStep as HairStep).hairColor.map((opt) => (
                          <button
                            key={opt.label}
                            type="button"
                            onClick={() => setSelectedHairColor(opt.label)}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                              selectedHairColor === opt.label
                                ? "border-[oklch(var(--foreground))] bg-[oklch(var(--foreground)/0.04)]"
                                : "border-[oklch(var(--border))] bg-white hover:border-[oklch(var(--foreground)/0.4)]"
                            }`}
                            data-ocid="survey.toggle"
                          >
                            <span className="text-lg">{opt.icon}</span>
                            <span className="font-sans text-xs text-[oklch(var(--foreground))]">
                              {opt.label}
                            </span>
                            {selectedHairColor === opt.label && (
                              <Check className="w-3 h-3 ml-auto text-[oklch(var(--foreground))]" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-sans text-xs uppercase tracking-widest text-[oklch(var(--muted-foreground))] mb-3 text-center">
                        Texture
                      </p>
                      <div className="flex flex-col gap-2">
                        {(currentStep as HairStep).hairTexture.map((opt) => (
                          <button
                            key={opt.label}
                            type="button"
                            onClick={() => setSelectedHairTexture(opt.label)}
                            className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 ${
                              selectedHairTexture === opt.label
                                ? "border-[oklch(var(--foreground))] bg-[oklch(var(--foreground)/0.04)]"
                                : "border-[oklch(var(--border))] bg-white hover:border-[oklch(var(--foreground)/0.4)]"
                            }`}
                            data-ocid="survey.toggle"
                          >
                            <span className="text-lg">{opt.icon}</span>
                            <span className="font-sans text-xs text-[oklch(var(--foreground))]">
                              {opt.label}
                            </span>
                            {selectedHairTexture === opt.label && (
                              <Check className="w-3 h-3 ml-auto text-[oklch(var(--foreground))]" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {"options" in currentStep &&
                      (currentStep as RegularStep).options.map((opt) => (
                        <button
                          key={opt.label}
                          type="button"
                          onClick={() => handleSelect(opt.label)}
                          className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                            currentSelection === opt.label
                              ? "border-[oklch(var(--foreground))] bg-[oklch(var(--foreground)/0.04)]"
                              : "border-[oklch(var(--border))] bg-white hover:border-[oklch(var(--foreground)/0.4)]"
                          }`}
                          data-ocid="survey.toggle"
                        >
                          <span className="text-xl mb-2 block">{opt.icon}</span>
                          <p className="font-sans text-xs text-[oklch(var(--foreground))] leading-snug">
                            {opt.label}
                          </p>
                        </button>
                      ))}
                  </div>
                )}

                <div className="flex justify-between items-center mt-10">
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={step === 0}
                    className="flex items-center gap-2 text-sm font-sans text-[oklch(var(--muted-foreground))] hover:text-[oklch(var(--foreground))] disabled:opacity-30 transition-colors"
                    data-ocid="survey.secondary_button"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed}
                    className="rounded-full bg-[oklch(var(--foreground))] text-white px-8 py-3 font-sans text-xs uppercase tracking-widest hover:opacity-80 disabled:opacity-40 transition-all duration-300"
                    data-ocid="survey.primary_button"
                  >
                    {step === TOTAL_STEPS - 1 ? "Complete" : "Continue"}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-center"
                data-ocid="survey.success_state"
              >
                <div className="w-20 h-20 rounded-full bg-[oklch(var(--pastel-sage))] flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-[oklch(var(--foreground))]" />
                </div>
                <h2 className="font-serif text-3xl md:text-4xl text-[oklch(var(--foreground))] mb-2">
                  Profile Complete
                </h2>
                <p className="font-sans text-sm text-[oklch(var(--muted-foreground))] mb-10 leading-relaxed">
                  Your style data is saved. We will use it to personalise every
                  product recommendation just for you.
                </p>

                {summaryData && (
                  <div className="grid grid-cols-2 gap-3 mb-10 text-left">
                    {(
                      [
                        ["Figure", summaryData.figure],
                        ["Proportions", summaryData.proportions],
                        ["Skin Tone", summaryData.skinTone],
                        ["Eye Color", summaryData.eyeColor],
                        ["Hair Color", summaryData.hairColor],
                        ["Hair Texture", summaryData.hairTexture],
                        ["Style Vibe", summaryData.stylePreference],
                        ["Color Palette", summaryData.colorPalette],
                      ] as [string, string][]
                    ).map(([label, value], i) => (
                      <div
                        key={label}
                        className="bg-[oklch(var(--cream))] rounded-xl p-4 border border-[oklch(var(--border))]"
                        data-ocid={`survey.item.${i + 1}`}
                      >
                        <p className="font-sans text-[10px] uppercase tracking-widest text-[oklch(var(--muted-foreground))] mb-1">
                          {label}
                        </p>
                        <p className="font-sans text-sm font-medium text-[oklch(var(--foreground))] truncate">
                          {value || "—"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  onClick={() => navigate({ to: "/" })}
                  className="rounded-full bg-[oklch(var(--foreground))] text-white px-10 py-4 h-auto font-sans text-xs uppercase tracking-[0.2em] hover:opacity-80 transition-opacity"
                  data-ocid="survey.submit_button"
                >
                  Shop My Edit
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
