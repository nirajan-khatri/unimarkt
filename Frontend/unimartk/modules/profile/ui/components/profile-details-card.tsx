import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Trash } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { profileSchema } from "../../schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface Props {
  avatarUrl?: string;
  name: string;
  email: string;
  contact_number?: string;
  role: string;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: (values: z.infer<typeof profileSchema>) => void;
  onDelete: () => void;
  loading?: boolean;
}

const ProfileDetailsCard = ({
  avatarUrl,
  name,
  email,
  contact_number,
  role,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  onDelete,
  loading,
}: Props) => {
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    mode: "all",
    defaultValues: {
      name,
      email,
      contact_number: contact_number ?? "",
    },
  });

  React.useEffect(() => {
    form.reset({ name, email, contact_number });
  }, [name, email, contact_number, form]);

  const handleSubmit = (values: z.infer<typeof profileSchema>) => {
    onSave(values);
  };
  return (
    <Card className="flex flex-row items-center p-6 gap-6 w-full mx-auto shadow-md">
      {/* Left: Avatar + Role */}
      <div className="flex flex-col items-center gap-4 w-1/4">
        <Avatar className="w-40 h-40">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="text-xl">{name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="border px-4 py-1 rounded-full text-muted-foreground text-sm capitalize">
          {role}
        </span>
      </div>

      <div className="w-full flex flex-col gap-3">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col w-full gap-3"
          >
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Name</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="contact_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base">
                    Contact Number (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input {...field} disabled={!isEditing} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Only show buttons when editing */}
            {isEditing && (
              <div className="flex justify-end gap-4 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    onCancel();
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  Save
                </Button>
              </div>
            )}
          </form>
        </Form>

        {/* When NOT editing, show Edit/Delete buttons */}
        {!isEditing && (
          <div className="flex justify-end gap-4 pt-2">
            <Button variant="destructive" onClick={onDelete} disabled={loading}>
              Delete Account
            </Button>
            <Button
              onClick={() => onEdit()} // We can call onCancel to trigger "edit" toggle in parent
              className="bg-violet-600 hover:bg-violet-700"
            >
              Edit details
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProfileDetailsCard;
