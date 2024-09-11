"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Question as Quest } from "@prisma/client";
import { FormProvider, useForm, Controller, Control } from "react-hook-form";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createAttemptWithScore } from "@/actions/attempts";
import { Loading } from "@/components/shared/loading";
import { cn } from "@/lib/utils";

const Questions = ({ questions }: { questions: Quest[] }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [duration, setDuration] = useState(0); // Timer in seconds
  const [quizStarted, setQuizStarted] = useState(false); // Track if quiz has started
  const form = useForm();
  const router = useRouter();

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizStarted && !isSubmitted) {
      timer = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, [quizStarted, isSubmitted]);

  useEffect(() => {
    // Reset form when moving to the next/previous question
    form.reset({
      [`question-${currentQuestionIndex}`]:
        answers[`question-${currentQuestionIndex}`] || "",
    });
  }, [currentQuestionIndex]);

  const startQuiz = () => {
    setIsSubmitted(false);
    setQuizStarted(true);
  };

  const onSubmit = async (data: { [key: string]: string[] }) => {
    const percentage = (score / questions.length) * 100;

    setIsSubmitted(true);

    try {
      const data = await createAttemptWithScore(
        questions[0].quizId,
        percentage,
        duration
      );

      if (!data.attempt) return toast.error(data.message);

      toast.success(data.message);
      form.reset();
    } catch (error: any) {
      console.log(error.message);
      toast.error("Something went wrong");
    }
  };

  const handleAnswerChange = (value: string) => {
    const questionId = `question-${currentQuestionIndex}`;

    // Check if the selected answer is correct
    const isCorrect = value === questions[currentQuestionIndex].answer;

    // Update score based on whether the selected answer is correct
    if (
      isCorrect &&
      answers[questionId] !== questions[currentQuestionIndex].answer
    ) {
      setScore((prevScore) => prevScore + 1);
    } else if (
      !isCorrect &&
      answers[questionId] === questions[currentQuestionIndex].answer
    ) {
      setScore((prevScore) => prevScore - 1);
    }

    // Update answers state
    setAnswers({
      ...answers,
      [questionId]: value,
    });
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const questionsAndUserSelectedRes = questions.map(
    ({ question, answer }, index) => {
      const userSelected = answers[`question-${index}`];

      return {
        question,
        userSelected: userSelected,
        answer,
      };
    }
  );

  const {
    formState: { isSubmitting, isValid },
  } = form;

  return (
    <div>
      {!quizStarted && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-semibold mb-4">Start the Quiz</h2>
            <Button onClick={startQuiz}>Start</Button>
          </div>
        </div>
      )}

      {quizStarted && !isSubmitted && (
        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-10"
          >
            <div className="flex justify-center mb-4">
              <p className="text-lg font-semibold">
                {Math.floor(duration / 60)}:{duration % 60}
              </p>
            </div>
            <div className="relative flex items-center justify-center">
              <Button
                onClick={goToPreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="absolute left-0"
                type="button"
              >
                Prev
              </Button>
              <Question
                question={questions[currentQuestionIndex]}
                index={currentQuestionIndex}
                control={form.control}
                onAnswerChange={handleAnswerChange}
                userAnswer={answers[`question-${currentQuestionIndex}`]}
                isSubmitted={isSubmitted}
              />
              <Button
                onClick={goToNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
                className="absolute right-0"
                type="button"
              >
                Next
              </Button>
            </div>

            {currentQuestionIndex === questions.length - 1 && (
              <Button disabled={isSubmitting || !isValid}>
                {isSubmitting && <Loading />}{" "}
                <span className={cn(isSubmitting && "ml-2")}>
                  {isSubmitting ? "Submitting quiz..." : "Submit quiz"}
                </span>
              </Button>
            )}
          </form>
        </FormProvider>
      )}

      {isSubmitted && (
        <div className="flex items-center flex-col gap-2">
          <h2 className="text-2xl font-semibold mb-4">Quiz Results</h2>
          <p className="text-lg font-semibold">
            Percentage: {Math.floor(score / questions.length) * 100}%
          </p>
          <p className="text-lg font-semibold">
            Duration: {Math.floor(duration / 60)}:{duration % 60}
          </p>
          {questionsAndUserSelectedRes.map((question, index) => (
            <div key={index} className="border px-5 rounded-lg pb-4 w-[80%]">
              <h2 className="text-xl font-semibold flex items-center gap-2 h-full w-full py-4">
                <span className="font-normal text-base">{index + 1}.</span>
                <span>{question.question}</span>
              </h2>
              <div>
                {question.userSelected === question.answer ? (
                  <p className="text-green-500 flex gap-3">
                    <span>{question.userSelected}</span>
                    <span className="border border-border py-0.5 px-2 rounded text-xs">
                      Correct!
                    </span>
                  </p>
                ) : (
                  <p className="text-red-500 flex gap-3">
                    <span>{question.userSelected}</span>
                    <span className="border border-border py-0.5 px-2 rounded text-xs">
                      {question.answer}
                    </span>
                  </p>
                )}
              </div>
            </div>
          ))}

          <Button onClick={() => router.back()}>Go see on leaders board</Button>
        </div>
      )}
    </div>
  );
};

function Question({
  question,
  index,
  control,
  onAnswerChange,
}: {
  question: Quest;
  index: number;
  control: Control<
    {
      [key: string]: string[];
    },
    any
  >;
  onAnswerChange: (value: string) => void;
  userAnswer: string;
  isSubmitted: boolean;
}) {
  return (
    <div className="border px-5 rounded-lg pb-4 w-[80%]">
      <div className="outline-none p-0">
        <h2 className="text-xl font-semibold flex items-center gap-2 h-full w-full py-4">
          <span className="font-normal text-base">{index + 1}.</span>
          <span>{question.question}</span>
        </h2>
      </div>
      <div className="w-[98%] ml-auto flex flex-col gap-2">
        <Controller
          control={control}
          name={`question-${index}`}
          rules={{ validate: (value) => value?.length > 0 }}
          render={({ field }) => (
            <RadioGroup
              //@ts-ignore
              value={field.value}
              onValueChange={(value) => {
                field.onChange(value);
                onAnswerChange(value); // Store the answer for current question
              }}
              className="flex flex-col space-y-1"
            >
              {question.options.map((option, optIndex) => (
                <div className="flex items-center space-x-2" key={optIndex}>
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}
        />
      </div>
    </div>
  );
}

export default Questions;
