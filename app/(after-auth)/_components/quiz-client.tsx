"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { useOrigin } from "@/hooks/user-origin";
import { Attempt, Question, Quiz, User } from "@prisma/client";
import { Check, Share2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import CreateQuestions from "./create-question";

interface QuizClientProps {
  quiz: Quiz & {
    attempts: (Attempt & { student: User })[];
    questions: Question[];
  };
  user: User;
}

const QuizClient = ({ quiz, user }: QuizClientProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isCopy, setIsCopy] = useState(false);
  const pathname = usePathname();
  const origin = useOrigin();

  const shareLink = `${origin}${pathname}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setIsCopy(true);

    setTimeout(() => {
      setIsCopy(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold first-letter:capitalize">
          {quiz.title}
        </h1>
        <div className="flex items-center gap-2">
          {user.id === quiz.createdBy && (
            <Link
              href={`/quizzes/${quiz.id}/create`}
              className={buttonVariants({ variant: "outline" })}
            >
              Add Questions
            </Link>
          )}
          <Button size="icon" onClick={handleCopy}>
            {isCopy ? (
              <Check className="size-4" />
            ) : (
              <Share2 className="size-4" />
            )}
          </Button>
        </div>
      </div>

      {isCreating && (
        <CreateQuestions quiz={quiz} setIsCreating={setIsCreating} />
      )}
    </div>
  );
};

export default QuizClient;
