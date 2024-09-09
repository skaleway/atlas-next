"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Question as Quest } from "@prisma/client";
import { Control, Controller, FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createAttemptWithScore } from "@/actions/attempts";
import { Loading } from "@/components/shared/loading";
import { cn } from "@/lib/utils";

const Questions = ({ questions }: { questions: Quest[] }) => {
  const form = useForm();
  const router = useRouter();

  const onSubmit = async (data: { [key: string]: string[] }) => {
    let score = 0;
    // Transform the data into an array of objects
    questions.forEach((question, index) => {
      const correctAnswer = data[`question-${index}`] as unknown;
      const converted = correctAnswer as string;
      const isCorrect = converted === question.answer;
      if (isCorrect) {
        score++;
      }
    });

    const percentage = (score / questions.length) * 100;

    try {
      const data = await createAttemptWithScore(
        questions[0].quizId,
        percentage
      );

      if (!data.attempt) return toast.error(data.message);

      toast.success(data.message);
      form.reset();
      router.push(`/quizzes/${questions[0].quizId}`);
    } catch (error: any) {
      console.log(error.message);
      toast.error("Something went wrong");
    }
  };

  const {
    formState: { isSubmitting, isValid },
  } = form;

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-10"
      >
        <div className="grid grid-cols-1 gap-2">
          {questions.map((question, index) => (
            <Question
              key={index}
              question={question}
              index={index}
              control={form.control}
            />
          ))}
        </div>
        <Button disabled={isSubmitting || !isValid}>
          {isSubmitting && <Loading />}{" "}
          <span className={cn(isSubmitting && "ml-2")}>
            {isSubmitting ? "Submitting quiz..." : "Submit quiz"}
          </span>
        </Button>
      </form>
    </FormProvider>
  );
};

function Question({
  question,
  index,
  control,
}: {
  question: Quest;
  index: number;
  control: Control<
    {
      [key: string]: string[];
    },
    any
  >;
}) {
  return (
    <div className="border px-5 rounded-lg pb-4">
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
              onValueChange={field.onChange}
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
