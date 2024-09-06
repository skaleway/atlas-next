"use server";

import { useUser } from "@/hooks/use-user";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createAttemptWithScore(quizId: string, score: number) {
  try {
    const user = await useUser();

    if (!user)
      return {
        message: "Unauthorized",
      };

    const quiz = await db.quiz.findFirst({ where: { id: quizId } });

    if (!quiz)
      return {
        message: "Quiz not found",
      };

    const newAttempt = await db.attempt.create({
      data: {
        quizId,
        score,
        studentId: user.id,
      },
    });

    if (!newAttempt)
      return {
        message: "Error attempting quiz",
      };

    revalidatePath(`/quizzes/${quizId}`);

    return {
      message: "Attemt recorded",
      attempt: newAttempt,
    };
  } catch (error) {
    console.log("ERROR_ATTEMPTING_QUIZ");
    throw new Error("Error attempting quiz");
  }
}
