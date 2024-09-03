"use server";

import { useUser } from "@/hooks/use-user";
import { db } from "@/lib/db";
import { createQuizSchema } from "@/schema";
import { QuizSchemaType } from "@/types";
import { Question, Quiz, Room } from "@prisma/client";
import { revalidatePath } from "next/cache";

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
    "Generate a survey object with 3 fields: name (string) representing the form title, description (string) representing the form's purpose, and a questions array. Each question object should have four fields: question , options (an array of possible answers (in a multiple-choice format)), answer (the correct option), and ansDesc (optional explanation for the correct answer). Return the survey object in JSON format.";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
      },
      method: "POST",
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `${data.description} ${promptExplanation}`,
          },
        ],
      }),
    });
    const json = await response.json();

    const responseObj = JSON.parse(json.choices[0].message.content);

    console.log(responseObj);

    //    const newQuiz = await db.room.update({
    //      where: {
    //        id: roomId,
    //      },
    //      data: {
    //        quizes: {
    //          create: {
    //            title: data.name,
    //            description: data.description,
    //            createdBy: user.id,
    //            questions: {
    //              createMany: {
    //                data: [],
    //              },
    //            },
    //          },
    //        },
    //      },
    //    });
    //
    revalidatePath("/");
    return {
      message: "success",
      // data: { formId: dbFormId },
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to create quiz");
  }
}
