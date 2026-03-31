import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Coins,
  Lightbulb,
  XCircle,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";
import { QuestionType } from "../backend.d";
import {
  useLevelContent,
  useSaveProfile,
  useUserProfile,
} from "../hooks/useQueries";

const FALLBACK_QUESTIONS = [
  {
    questionType: QuestionType.mcq,
    questionText: "What will `print(type(42))` output?",
    options: ["<class 'int'>", "<class 'str'>", "<class 'float'>", "42"],
    correctAnswer: "<class 'int'>",
    explanation:
      "In Python, 42 is an integer literal. The `type()` function returns the class of an object.",
    wrongExplanations: [
      "42 is not a string — it has no quotes.",
      "42 is a whole number, not a float.",
      "print() shows the type, not the value.",
    ],
  },
  {
    questionType: QuestionType.fillBlank,
    questionText: "Complete the code to print 'Hello, World!': print(____)",
    options: [],
    correctAnswer: "'Hello, World!'",
    explanation: "Strings in Python use single or double quotes.",
    wrongExplanations: [],
  },
  {
    questionType: QuestionType.outputPredict,
    questionText: "What is the output of: `x = 5; x += 3; print(x)`?",
    options: ["8", "5", "3", "Error"],
    correctAnswer: "8",
    explanation: "`x += 3` is equivalent to `x = x + 3`, so 5 + 3 = 8.",
    wrongExplanations: [
      "x was modified by += 3.",
      "3 alone is not correct — it ignores x.",
      "This is valid Python syntax.",
    ],
  },
  {
    questionType: QuestionType.debugging,
    questionText: "Find the bug: `def greet(name)\n    print('Hello ' + name)`",
    options: [
      "Missing colon after def",
      "Wrong quotes",
      "Indentation error",
      "No bug",
    ],
    correctAnswer: "Missing colon after def",
    explanation: "In Python, function definitions must end with a colon `:`.",
    wrongExplanations: [
      "Quotes are fine here.",
      "Indentation is correct.",
      "There is indeed a bug — missing colon.",
    ],
  },
  {
    questionType: QuestionType.mcq,
    questionText: "Which of the following is a valid variable name in Python?",
    options: ["my_var", "2var", "my-var", "my var"],
    correctAnswer: "my_var",
    explanation:
      "Variable names can contain letters, digits, and underscores, but cannot start with a digit or contain spaces/hyphens.",
    wrongExplanations: [
      "Cannot start with a number.",
      "Hyphens are not allowed (subtraction operator).",
      "Spaces are not allowed in variable names.",
    ],
  },
];

const LEVEL_TITLES = [
  "",
  "Hello World!",
  "Variables & Types",
  "String Magic",
  "User Input",
  "Conditionals",
  "While Loops",
  "For Loops",
  "Lists",
  "Dictionaries",
  "Mini Calculator",
  "Functions 101",
  "Parameters & Returns",
  "Scope & Closures",
  "Lambda Functions",
  "List Comprehension",
  "File I/O",
  "Exception Handling",
  "Modules & Imports",
  "Classes & Objects",
  "OOP Inheritance",
  "Recursion",
  "Sorting Algorithms",
  "Sets & Tuples",
  "Regular Expressions",
  "Generators",
  "Decorators",
  "Async Python",
  "Data Structures",
  "API Integration",
  "Capstone Project",
];

const LEVEL_CONCEPTS = [
  "",
  "Python is a beginner-friendly language. `print()` is your first tool — it shows output to the screen. Every program starts with output!",
  "Variables store data. Python is dynamically typed: `x = 5` creates an integer, `name = 'Alice'` creates a string. No need to declare types!",
  "Strings are text wrapped in quotes. Concatenate with `+`, repeat with `*`, and access characters by index: `name[0]`.",
  "The `input()` function reads text from the user. Remember to convert to numbers with `int()` or `float()` when needed.",
  "if/elif/else blocks control program flow based on conditions. Indentation defines blocks in Python — no braces needed!",
  "While loops repeat as long as a condition is True. Always ensure the condition eventually becomes False to avoid infinite loops.",
  "For loops iterate over sequences. `for i in range(10)` runs 10 times. Combine with lists for powerful iteration.",
  "Lists store ordered collections: `[1, 2, 3]`. They are mutable — you can add, remove, and change items. Index from 0.",
  "Dictionaries store key-value pairs: `{'name': 'Alice', 'age': 25}`. Access values with keys, not indexes.",
  "Apply what you know to build a calculator! Get two numbers from the user and perform arithmetic operations.",
];

interface AnswerState {
  selected: string | null;
  submitted: boolean;
  correct: boolean;
  showExplanation: boolean;
}

export default function LevelScreen() {
  const { id } = useParams({ from: "/layout/level/$id" });
  const levelId = Number.parseInt(id || "1");
  const navigate = useNavigate();

  const { data: level, isLoading } = useLevelContent(levelId);
  const { data: profile } = useUserProfile();
  const saveProfile = useSaveProfile();

  const [questionIndex, setQuestionIndex] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>({
    selected: null,
    submitted: false,
    correct: false,
    showExplanation: false,
  });
  const [fillInput, setFillInput] = useState("");
  const [completed, setCompleted] = useState(false);
  const [xpEarned, setXpEarned] = useState(0);
  const [showXpFly, setShowXpFly] = useState(false);
  const xpFlyRef = useRef<HTMLDivElement>(null);

  const questions =
    (level?.miniQuiz?.length ?? 0) > 0 ? level!.miniQuiz : FALLBACK_QUESTIONS;
  const currentQ = questions[questionIndex];
  const totalQ = questions.length;
  const conceptText =
    level?.concept || LEVEL_CONCEPTS[levelId] || LEVEL_CONCEPTS[1];
  const levelTitle = level?.title || LEVEL_TITLES[levelId] || "Python Quest";
  const xpReward = Number(level?.xpReward ?? 50);
  const coinReward = Number(level?.coinReward ?? 10);

  function handleSelect(option: string) {
    if (answerState.submitted) return;
    setAnswerState((prev) => ({ ...prev, selected: option }));
  }

  function handleSubmit() {
    const answer =
      currentQ.questionType === QuestionType.fillBlank
        ? fillInput.trim()
        : answerState.selected;
    if (!answer) return;
    const correct =
      answer.toLowerCase().trim() ===
      currentQ.correctAnswer.toLowerCase().trim();
    setAnswerState({
      selected: answer,
      submitted: true,
      correct,
      showExplanation: true,
    });
    if (correct) {
      setXpEarned((prev) => prev + Math.round(xpReward / totalQ));
      setShowXpFly(true);
      setTimeout(() => setShowXpFly(false), 1500);
    }
  }

  function handleNext() {
    if (questionIndex + 1 >= totalQ) {
      setCompleted(true);
      if (profile) {
        const newXp = profile.xp + BigInt(xpEarned);
        const newCoins = profile.coins + BigInt(coinReward);
        const newCompleted = Array.from(
          new Set([...profile.completedLevels, BigInt(levelId)]),
        );
        const newLevel = BigInt(
          Math.max(levelId + 1, Number(profile.currentLevel)),
        );
        saveProfile.mutate({
          ...profile,
          xp: newXp,
          coins: newCoins,
          completedLevels: newCompleted,
          currentLevel: newLevel,
        });
      }
    } else {
      setQuestionIndex((prev) => prev + 1);
      setAnswerState({
        selected: null,
        submitted: false,
        correct: false,
        showExplanation: false,
      });
      setFillInput("");
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (completed) {
    return (
      <div
        className="max-w-2xl mx-auto px-4 py-20 text-center"
        data-ocid="level.success_state"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.4 }}
        >
          <div className="text-8xl mb-6">🎉</div>
          <h1 className="font-display text-4xl font-extrabold text-white mb-3">
            Level Complete!
          </h1>
          <p className="text-body text-lg mb-8">
            You conquered{" "}
            <span className="text-accent font-semibold">{levelTitle}</span>!
          </p>
          <div className="flex justify-center gap-6 mb-10">
            <div className="bg-card-surface rounded-2xl p-6 text-center">
              <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="font-display text-3xl font-bold text-white">
                +{xpEarned}
              </div>
              <div className="text-xs text-muted-custom mt-1">XP Earned</div>
            </div>
            <div className="bg-card-surface rounded-2xl p-6 text-center">
              <Coins className="w-8 h-8 text-warning mx-auto mb-2" />
              <div className="font-display text-3xl font-bold text-white">
                +{coinReward}
              </div>
              <div className="text-xs text-muted-custom mt-1">Coins Earned</div>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => navigate({ to: "/levels" })}
              variant="outline"
              className="border-border text-body hover:text-white"
              data-ocid="level.secondary_button"
            >
              Back to Map
            </Button>
            <Button
              onClick={() =>
                navigate({
                  to: "/level/$id",
                  params: { id: String(levelId + 1) },
                })
              }
              className="bg-primary hover:bg-primary/90 text-white glow-blue"
              data-ocid="level.primary_button"
            >
              Next Level <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8" data-ocid="level.panel">
      <div className="flex items-center justify-between mb-6">
        <Link
          to="/levels"
          className="flex items-center gap-2 text-body hover:text-white transition-colors"
          data-ocid="level.link"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Map
        </Link>
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/20 text-primary border-none">
            Level {levelId}
          </Badge>
          <span className="text-sm text-muted-custom">
            {questionIndex + 1}/{totalQ}
          </span>
        </div>
      </div>

      <Progress value={(questionIndex / totalQ) * 100} className="h-2 mb-6" />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card-surface rounded-2xl p-5 mb-6 border-l-4 border-l-primary"
      >
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-warning" />
          <h1 className="font-display text-lg font-bold text-white">
            {levelTitle}
          </h1>
        </div>
        <p className="text-body text-sm leading-relaxed">{conceptText}</p>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={questionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="bg-card-surface rounded-2xl p-6"
          data-ocid="level.card"
        >
          <div className="flex items-center gap-2 mb-4">
            <Badge
              className={`border-none text-xs ${
                currentQ.questionType === QuestionType.mcq
                  ? "bg-primary/20 text-primary"
                  : currentQ.questionType === QuestionType.fillBlank
                    ? "bg-success/20 text-success"
                    : currentQ.questionType === QuestionType.outputPredict
                      ? "bg-warning/20 text-warning"
                      : "bg-game-orange/20 text-game-orange"
              }`}
            >
              {currentQ.questionType === QuestionType.mcq && "Multiple Choice"}
              {currentQ.questionType === QuestionType.fillBlank &&
                "Fill in the Blank"}
              {currentQ.questionType === QuestionType.outputPredict &&
                "Output Prediction"}
              {currentQ.questionType === QuestionType.debugging &&
                "Debug the Code"}
            </Badge>
          </div>

          <h2 className="text-white font-semibold text-base sm:text-lg mb-6 leading-relaxed">
            {currentQ.questionText}
          </h2>

          {currentQ.questionType !== QuestionType.fillBlank &&
            currentQ.options.length > 0 && (
              <div className="space-y-3 mb-6">
                {currentQ.options.map((option) => {
                  const isSelected = answerState.selected === option;
                  const isCorrect = option === currentQ.correctAnswer;
                  const optIndex = currentQ.options.indexOf(option);
                  let cls =
                    "border-border text-body hover:border-primary/40 hover:text-white";
                  if (answerState.submitted) {
                    if (isCorrect)
                      cls = "border-success bg-success/10 text-success";
                    else if (isSelected && !isCorrect)
                      cls =
                        "border-destructive bg-destructive/10 text-destructive animate-shake";
                    else cls = "border-border text-muted-custom opacity-50";
                  } else if (isSelected) {
                    cls = "border-primary bg-primary/10 text-white";
                  }
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleSelect(option)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 font-medium ${cls}`}
                      disabled={answerState.submitted}
                      data-ocid={`level.option.${optIndex + 1}`}
                    >
                      <span className="text-muted-custom mr-3 font-mono text-sm">
                        {String.fromCharCode(65 + optIndex)}.
                      </span>
                      {option}
                      {answerState.submitted && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 float-right mt-0.5" />
                      )}
                      {answerState.submitted && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 float-right mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

          {currentQ.questionType === QuestionType.fillBlank && (
            <div className="mb-6">
              <Input
                value={fillInput}
                onChange={(e) => setFillInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !answerState.submitted && handleSubmit()
                }
                placeholder="Type your answer..."
                disabled={answerState.submitted}
                className={`font-mono bg-secondary/50 border-border text-white ${
                  answerState.submitted
                    ? answerState.correct
                      ? "border-success bg-success/10"
                      : "border-destructive bg-destructive/10 animate-shake"
                    : ""
                }`}
                data-ocid="level.input"
              />
              {answerState.submitted && !answerState.correct && (
                <p className="text-sm text-success mt-2">
                  Correct answer: {currentQ.correctAnswer}
                </p>
              )}
            </div>
          )}

          <AnimatePresence>
            {answerState.showExplanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`rounded-xl p-4 mb-4 border ${
                  answerState.correct
                    ? "bg-success/10 border-success/30"
                    : "bg-destructive/10 border-destructive/30"
                }`}
                data-ocid={
                  answerState.correct
                    ? "level.success_state"
                    : "level.error_state"
                }
              >
                <div className="flex items-center gap-2 mb-2">
                  {answerState.correct ? (
                    <CheckCircle2 className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                  <span
                    className={`font-semibold text-sm ${answerState.correct ? "text-success" : "text-destructive"}`}
                  >
                    {answerState.correct ? "Correct! 🎉" : "Not quite..."}
                  </span>
                </div>
                <p className="text-sm text-body">{currentQ.explanation}</p>
                {!answerState.correct &&
                  currentQ.wrongExplanations.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {currentQ.options.map(
                        (opt) =>
                          opt !== currentQ.correctAnswer &&
                          currentQ.wrongExplanations[
                            currentQ.options.indexOf(opt)
                          ] && (
                            <p key={opt} className="text-xs text-muted-custom">
                              ✗{" "}
                              <span className="font-mono text-destructive">
                                {opt}
                              </span>
                              :{" "}
                              {
                                currentQ.wrongExplanations[
                                  currentQ.options.indexOf(opt)
                                ]
                              }
                            </p>
                          ),
                      )}
                    </div>
                  )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center">
            <div className="text-xs text-muted-custom">
              Question {questionIndex + 1} of {totalQ}
            </div>
            {!answerState.submitted ? (
              <Button
                onClick={handleSubmit}
                disabled={!answerState.selected && !fillInput.trim()}
                className="bg-primary hover:bg-primary/90 text-white"
                data-ocid="level.submit_button"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                data-ocid="level.primary_button"
              >
                {questionIndex + 1 >= totalQ
                  ? "Complete Level 🎉"
                  : "Next Question"}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showXpFly && (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -80 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            ref={xpFlyRef}
            className="fixed top-1/2 right-8 z-50 font-display text-2xl font-bold text-primary pointer-events-none"
          >
            +{Math.round(xpReward / totalQ)} XP ⚡
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
