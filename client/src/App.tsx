import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import CategoriesPage from "@/pages/CategoriesPage";
import FavorPage from "@/pages/FavorPage";
import MainAdminPage from "@/pages/MainAdminPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={FavorPage} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/categories" component={CategoriesPage} />
        <Route path="/favor" component={FavorPage} />
        <Route path="/admin" component={MainAdminPage} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
