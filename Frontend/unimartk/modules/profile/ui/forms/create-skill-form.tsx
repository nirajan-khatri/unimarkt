"use client";

import React, { useEffect, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "../../../../components/ui/form";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DayEnum, skillSchema } from "../../schemas";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "@/lib/axios";
import { Button } from "../../../../components/ui/button";
import {
  Book,
  Code,
  DollarSign,
  Dumbbell,
  Languages,
  Lightbulb,
  Music,
  Palette,
  Plus,
  Trash2,
} from "lucide-react";
import { degrees, departments } from "@/constants/departments";
import { useAuth } from "@/modules/auth/contexts/authContext";
import { redirect } from "next/navigation";
import { fetchSkillById } from "@/services/products";

type SkillFormData = z.infer<typeof skillSchema>;

interface Props {
  skillId?: string;
}

const CreateSkillForm = ({ skillId }: Props) => {
  const { isAuthenticated, user, isInitialized } = useAuth();

  if ((!isAuthenticated || !user) && isInitialized) {
    redirect("/sign-in");
  }

  const {
    data: skill,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["skill", skillId],
    queryFn: () => fetchSkillById(skillId!),
    enabled: !!skillId, // Only run when skillId exists
  });

  const queryClient = useQueryClient();

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      department_id: "",
      degree_id: "",
      available_time_week: [
        { day: "Monday", start_time: "", end_time: "", status: "open" },
      ],
      skill_category_id: "",
      module: "",
      description: "",
      charge_per_hour: "",
    },
  });

  useEffect(() => {
    if (skill) {
      // Map the skill data to form structure
      const formData: Partial<SkillFormData> = {
        name: skill.module || "", // Use skill.name if it exists, otherwise fall back to module
        department_id: skill.degree?.department?.id?.toString() || "",
        degree_id: skill.degree?.id?.toString() || "",
        skill_category_id: skill.skill_category?.id?.toString() || "",
        module: skill.module || "",
        description: skill.description || "",
        charge_per_hour: skill.charge_per_hour || "",
        available_time_week:
          skill.available_time_week?.length > 0
            ? skill.available_time_week.map((slot) => ({
                day: slot.day as
                  | "Monday"
                  | "Tuesday"
                  | "Wednesday"
                  | "Thursday"
                  | "Friday"
                  | "Saturday"
                  | "Sunday",
                start_time: slot.start_time?.substring(0, 5) || "", // Convert "18:00:00" to "18:00"
                end_time: slot.end_time?.substring(0, 5) || "", // Convert "19:30:00" to "19:30"
                status: (slot.status as "open" | "booked") || "open",
              }))
            : [{ day: "Monday", start_time: "", end_time: "", status: "open" }],
      };

      form.reset(formData);
    }
  }, [skill, form]);

  // const mutation = useMutation({
  //   mutationFn: (newSkill: SkillFormData) => {
  //     return axios.post("/skills/", newSkill);
  //   },
  //   onError: () => {
  //     // An error happened!
  //     toast.error("Something went wrong!");
  //   },
  //   onSuccess: () => {
  //     toast.success("Skill created successfully!");
  //     window.location.href = "/";
  //   },
  // });

  const mutation = useMutation({
    mutationFn: (newSkill: SkillFormData) => {
      if (skillId) {
        return axios.put(`/skills/${skillId}/`, newSkill);
      }
      return axios.post("/skills/", newSkill);
    },
    onError: () => {
      toast.error("Something went wrong!");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skill", "profileSkills"] });
      toast.success(
        skillId ? "Skill updated successfully!" : "Skill created successfully!"
      );
      // window.location.href = "/";
    },
  });

  const skillCovers = [
    { category_id: 1, value: "academic", label: "Academic", icon: Book },
    { category_id: 2, value: "programming", label: "Programming", icon: Code },
    { category_id: 3, value: "language", label: "Language", icon: Languages },
    { category_id: 4, value: "creative", label: "Creative", icon: Palette },
    { category_id: 5, value: "finance", label: "Finance", icon: DollarSign },
    { category_id: 6, value: "music", label: "Music", icon: Music },
  ];

  const filteredDegrees = useMemo(() => {
    return degrees.filter(
      (degree) =>
        degree.department_id === parseInt(form.getValues("department_id"))
    );
  }, [form.watch("department_id")]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "available_time_week",
  });

  const onSubmit = async (data: SkillFormData) => {
    try {
      const payload = {
        ...data,
        user_id: user!.id,
        status: "pending",
      };

      console.log("Submitting payload:", payload);

      mutation.mutate(payload);
      form.reset();
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Failed to submit product");
    }
  };

  const addNewSlot = () =>
    append({
      day: "Monday",
      start_time: "",
      end_time: "",
      status: "open",
    });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Product Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Skill Name<span className="text-red-500 -ml-1.5">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-3">
          <FormField
            control={form.control}
            name="department_id"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  Department<span className="text-red-500 -ml-1.5">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem
                        key={department.id}
                        value={department.id.toString()}
                      >
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sub Category */}
          <FormField
            control={form.control}
            name="degree_id"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>
                  Degree<span className="text-red-500 -ml-1.5">*</span>
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={form.watch("department_id") === ""}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a degree" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {filteredDegrees.map((degree) => (
                      <SelectItem key={degree.id} value={degree.id.toString()}>
                        {degree.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="module"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Module<span className="text-red-500 -ml-1.5">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter module" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Description<span className="text-red-500 -ml-1.5">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter product description"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Price */}
        <FormField
          control={form.control}
          name="charge_per_hour"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Price (€/hr)<span className="text-red-500 -ml-1.5">*</span>
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    €
                  </span>
                  <Input
                    type="text"
                    placeholder="0.00"
                    {...field}
                    className="pl-7"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="">
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Availability
            <span className="text-red-500 ml-1">*</span>
          </label>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex items-end gap-3 border border-border p-3 rounded-md"
            >
              {/* Day */}
              <FormField
                control={form.control}
                name={`available_time_week.${index}.day`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-sm">
                      Day<span className="text-red-500 -ml-1.5">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl className="w-full">
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Day" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DayEnum.options.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Start */}
              <FormField
                control={form.control}
                name={`available_time_week.${index}.start_time`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-sm">
                      Start<span className="text-red-500 -ml-1.5">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="time" className="text-sm" {...field} />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              {/* End */}
              <FormField
                control={form.control}
                name={`available_time_week.${index}.end_time`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="text-sm">
                      End<span className="text-red-500 -ml-1.5">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="time" className="text-sm" {...field} />
                    </FormControl>
                    {/* <FormMessage /> */}
                  </FormItem>
                )}
              />

              {/* Status */}
              {/* <FormField
              control={form.control}
              name={`available_time_week.${index}.status`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="text-sm">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="booked">Booked</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

              {/* Remove */}
              <div className="flex items-center justify-end">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
          {/* Add Slot Button */}
          <div className="flex items-center gap-4 mt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-border"
              onClick={addNewSlot}
            >
              <Plus className="h-4 w-4 mr-1" /> Add Availability
            </Button>
            {form.formState.errors.available_time_week && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.available_time_week?.root?.message}
              </p>
            )}

            {fields.length === 0 && (
              <span className="text-sm text-muted-foreground">
                No availability added yet.
              </span>
            )}
          </div>
        </div>

        <FormField
          control={form.control}
          name="skill_category_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Skill Cover<span className="text-red-500 -ml-1.5">*</span>
              </FormLabel>
              <FormControl>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {skillCovers.map((cover) => (
                    <label
                      key={cover.category_id}
                      className={`border rounded-lg p-4 text-center cursor-pointer transition ${
                        field.value === cover.category_id.toString()
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        value={cover.category_id}
                        checked={field.value === cover.category_id.toString()}
                        onChange={() =>
                          field.onChange(cover.category_id.toString())
                        }
                        className="hidden"
                      />
                      <cover.icon className="mx-auto mb-2 h-8 w-8" />
                      <span className="text-sm">{cover.label}</span>
                    </label>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="flex-1"
          >
            {form.formState.isSubmitting
              ? skillId
                ? "Updating Skill..."
                : "Creating Skill..."
              : skillId
                ? "Update Skill"
                : "Create Skill"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            className="flex-1"
          >
            Reset Form
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateSkillForm;
