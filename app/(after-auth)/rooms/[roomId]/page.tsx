import { findRoomById } from "@/actions/room";
import { Card, CardHeader } from "@/components/ui/card";
import { useUser } from "@/hooks/use-user";
import { LucideIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { off } from "process";

const RoomPage = async ({ params }: { params: { roomId: string } }) => {
  const user = await useUser();

  if (!user) return null;

  const { room } = await findRoomById(params.roomId);
  if (!room) return notFound();

  console.log(room);

  const teacherCount = room.members?.filter(
    (member) => member.role === "MODERATORS"
  ).length;

  const studentCount = room.members?.filter(
    (member) => member.role === "GUEST"
  ).length;

  //onst totalQuizes =

  return <div></div>;
};

function TeacherCards() {
  return <div className="grid grid-cols-1 md:grid-cols-2"></div>;
}

interface CardProps {
  title: string;
  Icon: LucideIcon;
  description: string;
  number: number;
  status: boolean;
}

function TeacherCard({ title }: CardProps) {
  return (
    <Card>
      <CardHeader>{title}</CardHeader>
    </Card>
  );
}

export default RoomPage;
