"use client";

import React from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormItem,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RoomSchemaType } from "@/types";
import { RoomSchema } from "@/schema";
import { createRoom } from "@/actions/room";
import { Loading } from "../shared/loading";
import { cn } from "@/lib/utils";

const CreateRoom = () => {
  const router = useRouter();
  const form = useForm<RoomSchemaType>({
    resolver: zodResolver(RoomSchema),
  });

  const {
    formState: { isSubmitting, isValid },
    setValue,
  } = form;

  async function onSubmit(params: RoomSchemaType) {
    try {
      const room = await createRoom(params);
      if (room.message === "Unathorized") {
        toast.error("Unauthorized Access");
      }

      if (room.room) {
        setValue("name", "");
        setValue("description", "");
        router.refresh();
        toast.success("Room created successfully");
      }
    } catch (error: any) {
      toast.error("Something happened");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid gap-4 w-[90%]  md:w-[500px]"
      >
        <div className="flex flex-col items-center justify-center gap-4 text-center mb-12">
          <h1 className="text-3xl font-semibold ">Create a room</h1>
          <p className="text-sm text-gray-600">
            Please provide a name and description for your new room.
          </p>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Room Name"
                  {...field}
                  disabled={isSubmitting}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="What are you going to be cooking in this room?"
                  {...field}
                  disabled={isSubmitting}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting || !isValid}>
          {isSubmitting && <Loading />}{" "}
          <span className={cn(isSubmitting && "ml-2")}>
            {isSubmitting ? "Creating room..." : "Create room"}
          </span>
        </Button>
      </form>
    </Form>
  );
};

export default CreateRoom;
