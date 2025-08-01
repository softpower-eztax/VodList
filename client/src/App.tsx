import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import CategoriesPage from "@/pages/CategoriesPage";
import FavorPage from "@/pages/FavorPage";
import MainAdminPage from "@/pages/MainAdminPage";
import GroupAdminPage from "@/pages/GroupAdminPage";
import FavorAdminPage from "@/pages/FavorAdminPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={FavorPage} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/favor" component={FavorPage} />
        <Route path="/admin" component={MainAdminPage} />
        <Route path="/admin/categories" component={CategoriesPage} />
        <Route path="/admin/groups" component={GroupAdminPage} />
        <Route path="/admin/favor" component={FavorAdminPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
