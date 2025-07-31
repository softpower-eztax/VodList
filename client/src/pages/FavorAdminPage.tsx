import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2, Edit, Plus, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type FavorVideo, type Group } from "@shared/schema";

const favorVideoFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  youTubeLink: z.string().min(1, "YouTube link is required").max(100, "YouTube link must be less than 100 characters"),
  description: z.string().max(200, "Description must be less than 200 characters").optional(),
  category: z.string().min(1, "Category is required"),
  type: z.string().min(1, "Type is required"),
});

type FavorVideoFormData = z.infer<typeof favorVideoFormSchema>;

export default function FavorAdminPage() {
  const [selectedVideo, setSelectedVideo] = useState<FavorVideo | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: favorVideos, isLoading: videosLoading } = useQuery<FavorVideo[]>({
    queryKey: ["/api/favor-videos"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ["/api/groups", "Category"],
    queryFn: async () => {
      const response = await fetch("/api/groups/type/Category");
      return response.json() as Promise<Group[]>;
    },
  });

  const { data: types, isLoading: typesLoading } = useQuery({
    queryKey: ["/api/groups", "Type"],
    queryFn: async () => {
      const response = await fetch("/api/groups/type/Type");
      return response.json() as Promise<Group[]>;
    },
  });

  const form = useForm<FavorVideoFormData>({
    resolver: zodResolver(favorVideoFormSchema),
    defaultValues: {
      title: "",
      youTubeLink: "",
      description: "",
      category: "",
      type: "",
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: FavorVideoFormData) => apiRequest("/api/favor-videos", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favor-videos"] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: "Favor video created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create favor video",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: FavorVideoFormData }) =>
      apiRequest(`/api/favor-videos/${id}`, "PUT", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favor-videos"] });
      setIsDialogOpen(false);
      setSelectedVideo(null);
      form.reset();
      toast({
        title: "Success",
        description: "Favor video updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update favor video",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/favor-videos/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favor-videos"] });
      toast({
        title: "Success",
        description: "Favor video deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete favor video",
        variant: "destructive",
      });
    },
  });

  const handleEdit = (video: FavorVideo) => {
    setSelectedVideo(video);
    form.reset({
      title: video.title,
      youTubeLink: video.youTubeLink,
      description: video.description || "",
      category: video.category,
      type: video.type,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this favor video?")) {
      deleteMutation.mutate(id);
    }
  };

  const onSubmit = (data: FavorVideoFormData) => {
    if (selectedVideo) {
      updateMutation.mutate({ id: selectedVideo.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedVideo(null);
    form.reset();
  };

  if (videosLoading || categoriesLoading || typesLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">Loading favor videos...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Favor Video Administration</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-favor-video">
              <Plus className="w-4 h-4 mr-2" />
              Add Favor Video
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {selectedVideo ? "Edit Favor Video" : "Add New Favor Video"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter video title"
                          data-testid="input-title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="youTubeLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YouTube Link</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter YouTube URL"
                          data-testid="input-youtube-link"
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
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter video description"
                          data-testid="input-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-category">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem key={category.id} value={category.groupType}>
                              {category.groupType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-type">
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {types?.map((type) => (
                            <SelectItem key={type.id} value={type.groupType}>
                              {type.groupType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                    {selectedVideo ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {favorVideos?.map((video) => (
          <Card key={video.id} data-testid={`card-favor-video-${video.id}`}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span className="truncate">{video.title}</span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(video.youTubeLink, "_blank")}
                    data-testid={`button-view-${video.id}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(video)}
                    data-testid={`button-edit-${video.id}`}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(video.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-${video.id}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <p className="text-sm text-gray-600">{video.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Type</Label>
                  <p className="text-sm text-gray-600">{video.type}</p>
                </div>
              </div>
              {video.description && (
                <div>
                  <Label className="text-sm font-medium">Description</Label>
                  <p className="text-sm text-gray-600 mt-1">{video.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {favorVideos?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No favor videos found. Add your first favor video!</p>
        </div>
      )}
    </div>
  );
}