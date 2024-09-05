import { Attempt, Quiz } from "@prisma/client";
import { Book, GraduationCap, LucideIcon, Users } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

import { findRoomById } from "@/actions/room";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";
import { db } from "@/lib/db";

interface CardProps {
  title: string;
  Icon: LucideIcon;
  description: string;
  number: number;
  status: boolean;
}

const RoomPage = async ({ params }: { params: { roomId: string } }) => {
  const user = await useUser();

  if (!user) return null;

  const { room } = await findRoomById(params.roomId);
  if (!room) return notFound();

  const studentCount = room.members?.filter(
    (member) => member.role === "GUEST"
  ).length;

  const totalQuizes = room.quizzes.length;

  const teacherCards: CardProps[] = [
    {
      title: "Students",
      Icon: GraduationCap,
      description: "Number of students in the room",
      number: studentCount,
      status: true,
    },
    {
      title: "Quizes",
      Icon: Book,
      description: "Total number of quizes in the room",
      number: totalQuizes,
      status: true,
    },
  ];

  const studentCards: CardProps[] = [
    {
      title: "Quizes",
      Icon: Book,
      description: "Total number of quizes in the room",
      number: totalQuizes,
      status: true,
    },

    {
      title: "Total Quiz taken",
      Icon: Users,
      description: "Number of students in the room",
      number: studentCount,
      status: true,
    },
  ];

  //get most recent quizzes
  const threeMostRecentQuizzes = room.quizzes.slice(0, 3);

  //const getMostrect quiz
  const mostRecentQuiz = room.quizzes[0];

  const usersInRecentQuiz = await Promise.all(
    mostRecentQuiz.attempts.map(async (attempt) => {
      const user = await db.user.findUnique({
        where: {
          id: attempt.studentId,
        },
      });
      return {
        ...user,
        score: attempt.score,
        grade: attempt.grade,
      };
    })
  );

  return (
    <div className="flex flex-col gap-10">
      <OverallCards
        cards={user.usertype === "TEACHER" ? teacherCards : studentCards}
      />

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-2xl">Recent quizzes</h1>
          {room.quizzes.length > 3 && (
            <Link
              className={buttonVariants({ variant: "link" })}
              href={`/rooms/${room.id}/quizzes`}
            >
              View all
            </Link>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {threeMostRecentQuizzes.map((quiz) => {
            ///  console.log(quiz);
            return <QuizCard key={quiz.id} quiz={quiz} />;
          })}
        </div>
      </div>
      <div className="space-y-5">
        <h1 className="font-semibold text-2xl">Leaders board</h1>
        <div className="h-96 bg-white">
          {usersInRecentQuiz.length === 0 && (
            <div className="w-full h-full flex items-center justify-center">
              <h1 className="text-2xl font-semibold">
                No one has attempted the quiz yet.
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function OverallCards({ cards }: { cards: CardProps[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {cards.map((card, index) => (
        <OverallCard key={index} {...card} />
      ))}
    </div>
  );
}

function OverallCard({ title, Icon, description, number, status }: CardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Icon className="size-5" />
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 text-lg font-semibold">
          <Icon className="h-5 w-5 text-gray-400" />
          <span>{number}</span>
        </div>
        <div className="text-sm text-gray-600">
          {title} ({number})
        </div>
      </CardContent>
    </Card>
  );
}

interface QuizCardProps {
  quiz: Quiz & { attempts: Attempt[] };
}

function QuizCard({ quiz }: QuizCardProps) {
  return (
    <Link
      href={`/quizzes/${quiz.id}/`}
      className="flex gap-3 flex-col bg-white rounded-lg p-2"
    >
      <div className="flex items-center justify-between">
        <span className="font-semibold text-xl truncate">{quiz.title}</span>
        <span className="text-sm text-gray-600">
          {quiz.attempts.length} attempts
        </span>
      </div>
      <div>
        <div>
          <span className="text-sm text-gray-600">
            {new Date(quiz.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default RoomPage;
