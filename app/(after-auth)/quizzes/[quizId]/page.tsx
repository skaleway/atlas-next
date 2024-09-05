import { getQuizById } from "@/actions/quiz";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { Question as Quest } from "@prisma/client";
import { notFound } from "next/navigation";
import React from "react";
import QuizClient from "../../_components/quiz-client";

const Quizzes = async ({ params }: { params: { quizId: string } }) => {
  const user = await useUser();

  if (!user) return null;

  const quiz = await getQuizById(params.quizId);

  if (!quiz) return notFound();

  return (
    <div className="py-20 min-h-screen max-w-5xl mx-auto">
      <QuizClient quiz={quiz} user={user} />
      <div className="">
        {quiz.questions.length === 0 && (
          <div className="mt-10 h-96 flex items-center justify-center border border-border rounded-3xl font-semibold text-3xl">
            No Quiz for this questions yet
          </div>
        )}
        <div className="mt-10">
          {quiz.questions.length > 0 && (
            <Questions questions={quiz.questions} />
          )}
        </div>
      </div>
    </div>
  );
};

function Questions({ questions }: { questions: Quest[] }) {
  return (
    <div className="grid grid-cols-1 gap-2">
      {questions.map((question, index) => (
        <Question key={index} question={question} />
      ))}
    </div>
  );
}

function Question({ question }: { question: Quest }) {
  return (
    <div className="border border-border rounded-3xl p-6">
      <h2 className="text-xl font-semibold">{question.question}</h2>
      <div className="ml-5 space-y-2">
        {question.options.map((option, index) => (
          <div key={index} className="mt-2">
            <input type="radio" name={`question-${question.id}`} /> {option}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Quizzes;
