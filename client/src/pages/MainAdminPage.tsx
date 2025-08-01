import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, Database, Video, Grid3X3 } from "lucide-react";
import GroupAdminPage from "./GroupAdminPage";
import FavorAdminPage from "./FavorAdminPage";
import CategoriesPage from "./CategoriesPage";

export default function MainAdminPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Administration Panel</h1>
        <p className="text-gray-600">Manage groups and favorite videos for your MyVideo application.</p>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="categories" data-testid="tab-categories">
            <Grid3X3 className="w-4 h-4 mr-2" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="groups" data-testid="tab-groups">
            <Database className="w-4 h-4 mr-2" />
            Group Management
          </TabsTrigger>
          <TabsTrigger value="favor-videos" data-testid="tab-favor-videos">
            <Video className="w-4 h-4 mr-2" />
            Favor Video Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Grid3X3 className="w-5 h-5 mr-2" />
                Categories
              </CardTitle>
              <CardDescription>
                Browse and view video categories organized by type.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategoriesPage />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Group Management
              </CardTitle>
              <CardDescription>
                Manage categories and types for organizing your video content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GroupAdminPage />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="favor-videos" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Video className="w-5 h-5 mr-2" />
                Favor Video Management
              </CardTitle>
              <CardDescription>
                Manage your favorite videos with categories and types.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FavorAdminPage />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}