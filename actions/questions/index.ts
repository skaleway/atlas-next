"use server";

import { useUser } from "@/hooks/use-user";
import { db } from "@/lib/db";
import { createQuestionsSchema } from "@/schema";
import { createQuestionsSchemaType } from "@/types";
import { revalidatePath } from "next/cache";

export async function createQuestion(
  values: createQuestionsSchemaType,
  quizId: string
) {
  try {
    const user = await useUser();

    if (!user)
      return {
        message: "Unauthorized",
      };

    //checking if quiz exits
    const isQuizInDb = await db.quiz.findFirst({
      where: {
        id: quizId,
        createdBy: user.id,
      },
    });

    if (!isQuizInDb)
      return {
        message: `Quiz not found or not created by the ${user.username}`,
      };

    const validData = createQuestionsSchema.safeParse(values);

    if (!validData.success)
      return {
        message: "Invalid request body",
      };

    //extracting the values from the validData
    const { question: title, options, answer } = validData.data;

    const lastContent = await db.question.findFirst({
      where: {
        quizId,
      },
      orderBy: {
        position: "desc",
      },
    });

    //creating a new postion
    const newPosition = lastContent ? lastContent.position + 1 : 1;

    // Create question in the database
    const question = await db.question.create({
      data: {
        question: title,
        options,
        quizId,
        answer,
        position: newPosition,
      },
    });

    if (question)
      return {
        message: "Question Created successfully",
        question,
      };

    revalidatePath(`/quizzes/${quizId}`);

    return {
      message: "Internal Server Error",
    };
  } catch (error: any) {
    console.error(error.message);
    return {
      message: "Internal Server Error",
    };
  }
}
