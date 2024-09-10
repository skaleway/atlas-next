"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Quiz } from "@prisma/client";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/navigation";

import { Loading } from "@/components/shared/loading";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createQuestionsSchema } from "@/schema";
import { createQuestionsSchemaType } from "@/types";
import { createQuestion } from "@/actions/questions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateQuestionsProps {
  quiz: Quiz;
  setIsCreating: Dispatch<SetStateAction<boolean>>;
}

const CreateQuestions = ({ quiz, setIsCreating }: CreateQuestionsProps) => {
  const router = useRouter();
  const form = useForm<createQuestionsSchemaType>({
    resolver: zodResolver(createQuestionsSchema),
    defaultValues: {
      question: "",
      options: [],
    },
  });

  const { fields, append } = useFieldArray({
    control: form.control,
    //@ts-ignore
    name: "options" as const,
  });

  const addOption = () => {
    append("");
  };

  async function onSubmit(values: createQuestionsSchemaType) {
    try {
      const data = await createQuestion(values, quiz.id);
      if (!data?.question) return toast.error(data.message);
      form.reset();
      setIsCreating(false);
      toast.success(data.message);
      router.refresh();
    } catch (error: any) {
      toast.error("Something happened");
    }
  }

  const {
    formState: { isSubmitting, isValid },
    watch,
  } = form;

  const options = watch("options");

  const lastOption = options[options.length - 1];

  return (
    <div className="flex items-center justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid gap-3 w-[90%]  md:w-[500px]"
        >
          <div className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      placeholder="Question"
                      {...field}
                      className="disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              onClick={addOption}
              disabled={isSubmitting || options.length >= 4}
              size="icon"
            >
              <Plus className="size-4" />
            </Button>
          </div>

          <div className="w-[95%] ml-auto  space-y-2">
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`options.${index}` as const} // Accessing options array
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        placeholder={`Option ${index + 1}`}
                        {...field}
                        className="disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>

          {options.length >= 4 && lastOption.length > 5 && (
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the correct answer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {options.map((option, index) => (
                        <SelectItem key={index} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button disabled={isSubmitting || !isValid}>
            {isSubmitting && <Loading />}
            <span className={cn(isSubmitting && "ml-2")}>
              {isSubmitting ? "Creating question..." : "Create question"}
            </span>
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateQuestions;
