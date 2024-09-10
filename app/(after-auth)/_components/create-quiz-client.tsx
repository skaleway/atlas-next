"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Attempt, Question, Quiz, User } from "@prisma/client";

import { reOrderQuestions } from "@/actions/questions";
import { Loading } from "@/components/shared/loading";
import { Button, buttonVariants } from "@/components/ui/button";
import CreateQuestions from "./create-question";
import QuetionList from "./question-list";
import Link from "next/link";

interface CreateQuizClientProps {
  quiz: Quiz & {
    attempts: (Attempt & { student: User })[];
    questions: Question[];
  };
  user: User;
}

const CreateQuizClient = ({ quiz, user }: CreateQuizClientProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const onReorder = async (updatedList: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      await reOrderQuestions(updatedList, quiz.id);
      toast.success("Quesions reordered");
    } catch (error: any) {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold first-letter:capitalize">
          {quiz.title}
        </h1>
        <div className="flex items-center gap-2">
          {user.id === quiz.createdBy && (
            <Button onClick={() => setIsCreating((prev) => !prev)}>
              Add Questions
            </Button>
          )}
          {user.id === quiz.createdBy && (
            <Link
              className={buttonVariants({ variant: "outline" })}
              href={`/quizzes/${quiz.id}`}
            >
              Add Questions
            </Link>
          )}
        </div>
      </div>

      {isCreating && (
        <CreateQuestions quiz={quiz} setIsCreating={setIsCreating} />
      )}
      <div className="w-full relative">
        <QuetionList
          items={quiz.questions}
          // onEdit={onEdit}
          onReorder={onReorder}
        />

        {isUpdating && (
          <div className="absolute w-full h-full bg-slate-500/20 top-0 left-0 rounded-md flex items-center justify-center">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateQuizClient;
