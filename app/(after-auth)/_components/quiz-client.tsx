"use client";

import { Button } from "@/components/ui/button";
import { Attempt, Question, Quiz, User } from "@prisma/client";
import React, { useState } from "react";
import CreateQuestions from "./create-question";
import { Share2 } from "lucide-react";

interface QuizClientProps {
  quiz: Quiz & { attempts: Attempt[]; questions: Question[] };
  user: User;
}

const QuizClient = ({ quiz, user }: QuizClientProps) => {
  const [isCreating, setIsCreating] = useState(false);
  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold first-letter:capitalize">
          {quiz.title}
        </h1>
        {quiz.createdBy === user.id && (
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsCreating((prev) => !prev)}>
              Add Questions
            </Button>
            {quiz.questions.length > 0 && (
              <Button size="icon">
                <Share2 className="size-4" />
              </Button>
            )}
          </div>
        )}
      </div>
      {isCreating && (
        <CreateQuestions quiz={quiz} setIsCreating={setIsCreating} />
      )}
    </div>
  );
};

export default QuizClient;
