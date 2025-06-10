// hooks/useUser.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "../types";

const fetchUser = async (id: string): Promise<User> => {
  // const res = await fetch(`/api/users/${id}`);
  // if (!res.ok) throw new Error("Failed to fetch user");
  // return res.json();
  return {
    id: "1",
    name: "John Doe",
    email: "murtaza@hs-fulda.de",
    contact_number: undefined,
    role: "admin",
    avatarUrl: undefined,
  };
};

const updateUser = async ({
  id,
  data,
}: {
  id: string;
  data: Partial<User>;
}) => {
  console.log("updateUser", id, data);
};

const deleteUser = async (id: string) => {
  console.log("deleteUser", id);
};

export function useUser(id: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUser(id),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) =>
      updateUser({ id, data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user", id] }),
  });

  const deletion = useMutation({
    mutationFn: () => deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["user", id] }),
  });

  return {
    user: data,
    isLoading,
    error,
    updateUser: update.mutate,
    deleteUser: deletion.mutate,
  };
}
