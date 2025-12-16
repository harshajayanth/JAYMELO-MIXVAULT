import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DataProvider } from "@/context/DataContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { MainLayout } from "@/components/layout/main-layout";
import NotFound from "@/pages/not-found";

// Pages
import HomePage from "@/pages/home";
import CategoryPage from "@/pages/category";
import ChainDetailPage from "@/pages/chain-detail";
import LoginPage from "@/pages/login";

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Component {...rest} /> : <Redirect to="/login" />;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      
      <Route path="/">
        <ProtectedRoute component={HomePage} />
      </Route>
      
      <Route path="/category/:id">
        <ProtectedRoute component={CategoryPage} />
      </Route>
      
      <Route path="/chain/:categoryId/:chainId">
        <ProtectedRoute component={ChainDetailPage} />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <DataProvider>
            <MainLayout>
              <Router />
            </MainLayout>
            <Toaster />
          </DataProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
