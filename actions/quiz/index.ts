"use server";

import { useUser } from "@/hooks/use-user";
import { db } from "@/lib/db";
import { createQuizSchema } from "@/schema";
import { QuizSchemaType } from "@/types";
import { Question, Quiz, Room } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { title } from "process";

export async function createNewQuiz(values: QuizSchemaType, roomId: string) {
  const user = await useUser();

  if (!user) {
    return {
      message: "Unauthorized",
    };
  }

  const validData = createQuizSchema.safeParse(values);

  if (!validData.success)
    return {
      message: "Invalid request body",
    };

  if (!process.env.OPENAI_API_KEY) {
    return {
      message: "No OpenAI API key found",
    };
  }

  const data = validData.data;
  const promptExplanation =
    "Generate a quiz object with 3 fields: name (string) representing the form title, description (string) representing the form's purpose, and a questions array. Each question object should have four fields: question , options (an array of possible answers (in a multiple-choice format)), answer (the correct option), and ansDesc (optional explanation for the correct answer). Return the survey object in JSON format.";

  try {
    ///    using ai

    ///    const response = await fetch("https://api.openai.com/v1/chat/completions", {
    ///      headers: {
    ///        "Content-Type": "application/json",
    ///        Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
    ///      },
    ///      method: "POST",
    ///      body: JSON.stringify({
    ///        model: "gpt-3.5-turbo",
    ///        messages: [
    ///          {
    ///            role: "system",
    ///            content: `${data.description} ${promptExplanation}`,
    ///          },
    ///        ],
    ///      }),
    ///    });
    ///    const json = await response.json();
    ///
    ///    console.log(json);

    const quiz = await db.quiz.create({
      data: {
        createdBy: user.id,
        title: data.name,
        description: data.description,
        roomId,
      },
    });

    revalidatePath("/");

    return {
      message: "success",
      data: { formId: quiz },
    };
  } catch (error: any) {
    console.error(error.message);
  }
}

export async function getQuizById(quizId: string) {
  try {
    const quiz = await db.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          orderBy: {
            position: "asc",
          },
        },
        attempts: {
          include: {
            student: true,
          },
        },
      },
    });

    return quiz;
  } catch (error: any) {
    console.log("ERROR_GETTING_A_PARTICULAR_QUIZ");
    throw new Error("Nothing");
  }
}

export async function deleteQuiz(quizId: string) {
  const user = await useUser();
  if (!user) return;

  try {
    await db.quiz.delete({ where: { id: quizId, createdBy: user.id } });
    revalidatePath("/dashboard");
    return { message: "Quiz deleted successfully" };
  } catch (error: any) {
    console.log("ERROR_DELETING_QUIZ");
    throw new Error("Error deleting quiz");
  }
}
