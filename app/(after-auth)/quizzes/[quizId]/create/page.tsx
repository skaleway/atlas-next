import { getQuizById } from "@/actions/quiz";
import CreateQuizClient from "@/app/(after-auth)/_components/create-quiz-client";
import QuetionList from "@/app/(after-auth)/_components/question-list";
import UserNotFound from "@/components/shared/user-not-found";
import { useUser } from "@/hooks/use-user";
import { notFound } from "next/navigation";

const CreateQuestionsPage = async ({
  params,
}: {
  params: { quizId: string };
}) => {
  const user = await useUser();

  if (!user) return <UserNotFound />;

  const quiz = await getQuizById(params.quizId);

  if (!quiz) return notFound();

  //console.log(quiz);

  return (
    <div className="py-20 min-h-screen max-w-5xl mx-auto">
      <CreateQuizClient user={user} quiz={quiz} />
      <div className="">
        {quiz.questions.length === 0 && (
          <div className="mt-10 h-96 flex items-center justify-center border border-border rounded-3xl font-semibold text-3xl">
            No Quiz for this questions yet
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateQuestionsPage;
