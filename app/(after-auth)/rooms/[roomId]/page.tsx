import { findRoomById } from "@/actions/room";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";
import { Book, GraduationCap, LucideIcon, Users } from "lucide-react";
import { notFound } from "next/navigation";

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

  return (
    <div className="">
      <OverallCards
        cards={user.usertype === "TEACHER" ? teacherCards : studentCards}
      />
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

export default RoomPage;
