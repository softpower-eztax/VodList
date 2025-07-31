import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2, Edit, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type Group } from "@shared/schema";

const groupFormSchema = z.object({
  groupName: z.string().min(1, "Group name is required"),
  groupType: z.string().min(1, "Group type is required"),
  groupValue: z.number().min(1, "Group value must be at least 1"),
});

type GroupFormData = z.infer<typeof groupFormSchema>;

export default function GroupAdminPage() {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: groups, isLoading } = useQuery<Group[]>({
    queryKey: ["/api/groups"],
  });

  const form = useForm<GroupFormData>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      groupName: "",
      groupType: "",
      groupValue: 1,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: GroupFormData) => apiRequest("POST", "/api/groups", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/groups"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Group created successfully",
      });
    },
    onError: (error: any) => {
      console.error("Group creation error:", error);
      toast({
        title: "Error",
        description: `Failed to create group: ${error.message || "Unknown error"}`,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: GroupFormData }) =>
      apiRequest("PUT", `/api/groups/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/groups"] });
      setIsDialogOpen(false);
      setSelectedGroup(null);
      form.reset();
      toast({
        title: "Success",
        description: "Group updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update group",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/groups/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/groups"] });
      toast({
        title: "Success",
        description: "Group deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete group",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (group: Group) => {
    setSelectedGroup(group);
    form.reset({
      groupName: group.groupName,
      groupType: group.groupType,
      groupValue: group.groupValue,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this group?")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data: GroupFormData) => {
    if (selectedGroup) {
      updateMutation.mutate({ id: selectedGroup.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedGroup(null);
    form.reset();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading groups...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Group Administration</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-group">
              <Plus className="w-4 h-4 mr-2" />
              Add Group
            </Button>
          </DialogTrigger>
          <DialogContent aria-describedby="group-dialog-description">
            <DialogHeader>
              <DialogTitle>
                {selectedGroup ? "Edit Group" : "Add New Group"}
              </DialogTitle>
              <div id="group-dialog-description" className="sr-only">
                Form to {selectedGroup ? "edit existing" : "create new"} group with name, type and value
              </div>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="groupName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter group name"
                          data-testid="input-group-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="groupType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Type</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter group type"
                          data-testid="input-group-type"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="groupValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Group Value</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          min="1"
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                          placeholder="Enter group value"
                          data-testid="input-group-value"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleDialogClose}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-submit"
                  >
                    {selectedGroup ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {groups?.map((group) => (
          <Card key={group.id} data-testid={`card-group-${group.id}`}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{group.groupName}</span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(group)}
                    data-testid={`button-edit-${group.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(group.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-${group.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <p className="text-sm text-gray-600">{group.groupType}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Value</Label>
                  <p className="text-sm text-gray-600">{group.groupValue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {groups?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No groups found. Add your first group!</p>
        </div>
      )}
    </div>
  );
}