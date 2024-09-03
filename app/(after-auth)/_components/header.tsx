import { UserButton } from "@clerk/nextjs";
import { Room, RoomMember, User } from "@prisma/client";
import CreateQuiz from "./create-quiz";

interface RoomHeaderProps {
  room: Room & { members: RoomMember[] };
  user: User;
}

const RoomHeader = ({ room, user }: RoomHeaderProps) => {
  const creator = room.creatorId === user.id;

  return (
    <div className="flex h-14 bg-background items-center px-5 border-b justify-between">
      <h1 className="text-xl font-semibold text-gray-800">{room.name}</h1>
      <div className="flex items-center gap-2">
        <UserButton />
        {creator && <CreateQuiz roomId={room.id} />}
      </div>
    </div>
  );
};

export default RoomHeader;
