"use client";

import React from "react";
import { Question as Quest } from "@prisma/client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

const Questions = ({ questions }: { questions: Quest[] }) => {
  return (
    <div className="grid grid-cols-1 gap-2">
      {questions.map((question, index) => (
        <Question key={index} question={question} index={index} />
      ))}
    </div>
  );
};

function Question({ question, index }: { question: Quest; index: number }) {
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full border px-5 rounded-lg"
    >
      <AccordionItem value={question.id}>
        <AccordionTrigger>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <span className="font-normal text-lg">{index + 1}.</span>
            <span>{question.question}</span>
          </h2>
        </AccordionTrigger>
        <AccordionContent className="w-[98%] ml-auto">
          {question.options.map((option, index) => (
            <div key={index} className="mt-2"></div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
export default Questions;
