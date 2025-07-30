import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Download, RefreshCw } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { getTranslation, type Language } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface VideoPopulatorProps {
  language: Language;
  onPopulate?: () => void;
}

export default function VideoPopulator({
  language,
  onPopulate,
}: VideoPopulatorProps) {
  const { toast } = useToast();

  // Populate videos mutation
  const populateMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/videos/populate"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: getTranslation("success", language),
        description: "Videos have been populated from YouTube successfully!",
      });
    },
    onError: () => {
      toast({
        title: getTranslation("error", language),
        description: "Failed to populate videos from YouTube",
        variant: "destructive",
      });
    },
  });

  // Refresh stats mutation
  const refreshMutation = useMutation({
    mutationFn: () => apiRequest("POST", "/api/videos/refresh-stats"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: getTranslation("success", language),
        description: "Video statistics have been refreshed!",
      });
    },
    onError: () => {
      toast({
        title: getTranslation("error", language),
        description: "Failed to refresh video statistics",
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-lg">YouTube Video Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => {
              if (onPopulate) {
                onPopulate(); // Trigger real-time search
              } else {
                populateMutation.mutate(); // Fallback to database population
              }
            }}
            disabled={populateMutation.isPending}
            className="flex-1"
            data-testid="populate-videos-button"
          >
            <Download className="w-4 h-4 mr-2" />
            {populateMutation.isPending
              ? "Loading..."
              : "Load Videos for Category"}
          </Button>

          {/* <Button
            onClick={() => refreshMutation.mutate()}
            disabled={refreshMutation.isPending}
            variant="outline"
            className="flex-1"
            data-testid="refresh-stats-button"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            {refreshMutation.isPending ? "Refreshing..." : "Refresh Video Stats"}
          </Button> */}
        </div>

        <p className="text-sm text-gray-600 mt-3">
          Click "Load Videos for Category" to search YouTube in real-time using
          the selected category keywords. Search uses AND logic - videos must
          contain ALL keywords from the category.
        </p>
      </CardContent>
    </Card>
  );
}
