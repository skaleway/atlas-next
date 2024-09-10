"use client";

import { cn } from "@/lib/utils";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { Question } from "@prisma/client";
import { Grip, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
interface quetionListProps {
  items: Question[];
  onReorder: (updatedList: { id: string; position: number }[]) => void;
}

const QuetionList = ({ items, onReorder }: quetionListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [questions, setQuestions] = useState<Question[] | []>();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setQuestions(items);
  }, [items]);

  if (!isMounted) return null;

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(questions ?? []);

    const [movedquetion] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, movedquetion);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedquetions = items.slice(startIndex, endIndex + 1);

    setQuestions(items);

    const bulkUpdateData = updatedquetions.map((chapter) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id),
    }));

    onReorder(bulkUpdateData);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="questions">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {questions &&
              questions.length > 0 &&
              questions.map((question, index) => (
                <Draggable
                  key={question.id}
                  draggableId={question.id}
                  index={index}
                >
                  {(provided) => (
                    <div
                      {...provided.draggableProps}
                      ref={provided.innerRef}
                      className={cn(
                        "flex gap-3 border-border border rounded-md mb-4"
                      )}
                    >
                      <div className="">
                        <div
                          {...provided.dragHandleProps}
                          className="px-5 border-r h-full flex items-center justify-center border-slate-200 hover:bg-slate-300 rounded-l-md transition"
                        >
                          <Grip className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-3 flex-1 py-4">
                        <h2 className="text-2xl font-semibold flex items-center gap-2 h-full w-full">
                          <span className="font-normal text-base first-letter:capitalize">
                            {index + 1}.
                          </span>
                          <span>{question.question}</span>
                        </h2>
                        <div className="w-[98%] ml-auto flex flex-col gap-2">
                          {question.options.map((option, index) => {
                            // some code here

                            const optionLetters = ["A", "B", "C", "D"];

                            return (
                              <p
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <span className="text-sm">
                                  {optionLetters[index]}.
                                </span>
                                <span className="font-medium text-lg first-letter:capitalize">
                                  {option}
                                </span>
                              </p>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default QuetionList;
