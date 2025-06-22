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
import { Badge } from "@/components/ui/badge";

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
    <Card className="flex flex-row items-start p-6 gap-6 w-full mx-auto shadow-md">
      {/* Left: Avatar + Role */}
      <div className="flex items-start space-x-8">
        <Avatar className="h-32 w-32">
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback className="text-xl">{name.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 space-y-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <div className="h-10 flex items-center">
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 h-10 px-8">
                  {role}
                </Badge>
              </div>
            </div>
            {/* Only show buttons when editing */}
            {isEditing && (
              <div className="flex justify-end gap-4 pt-2 col-span-1 md:col-span-2">
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
            {!isEditing && (
              <div className="flex justify-end gap-4 pt-2 col-span-1 md:col-span-2">
                <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white" onClick={onDelete} disabled={loading}>
                  Delete Account
                </Button>
                <Button
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                  onClick={() => onEdit()} // We can call onCancel to trigger "edit" toggle in parent
                >
                  Edit details
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </Card>
  );
};

export default ProfileDetailsCard;