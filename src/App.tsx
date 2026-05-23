import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { ChainDataProvider } from "@/context/ChainDataContext";
import { PluginDataProvider } from "@/context/PluginDataContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { MainLayout } from "@/components/layout/main-layout";

import NotFound from "@/pages/not-found";

// ===== Pages =====

// Auth
import LoginPage from "@/pages/login";

// Home / Dashboard
import HomePage from "@/pages/home";

// Chains (existing)
import CategoryPage from "@/pages/category";
import ChainDetailPage from "@/pages/chain-detail";

// 🔌 Plugins (UPDATED PATHS)
import PluginsIndexPage from "@/pages/Plugins/index"; 
import PluginCategoriesPage from "@/pages/Plugins/PluginCategories";
import PluginSubCategoriesPage from "@/pages/Plugins/PluginSubCategories";
import PluginListPage from "@/pages/Plugins/PluginList";
import PluginDetailPage from "@/pages/PluginDetail/PluginDetail"; 

// ==================

// 🔒 Protected Route Wrapper
function ProtectedRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  return <Component {...rest} />;
}

// 🔁 Router
function Router() {
  return (
    <Switch>
      {/* ---------- AUTH ---------- */}
      <Route path="/login" component={LoginPage} />

      {/* ---------- HOME ---------- */}
      <Route path="/">
        <ProtectedRoute component={HomePage} />
      </Route>

      {/* ---------- CHAINS ---------- */}
      <Route path="/category/:id">
        <ProtectedRoute component={CategoryPage} />
      </Route>

      <Route path="/chain/:categoryId/:chainId">
        <ProtectedRoute component={ChainDetailPage} />
      </Route>

      {/* ---------- PLUGINS ---------- */}
      {/* 1️⃣ Plugins entry (optional landing / redirect to categories) */}
      <Route path="/plugins">
        <ProtectedRoute component={PluginsIndexPage} />
      </Route>

      {/* 2️⃣ Categories */}
      <Route path="/plugins/categories">
        <ProtectedRoute component={PluginCategoriesPage} />
      </Route>

      {/* 3️⃣ Subcategories */}
      <Route path="/plugins/:category">
        <ProtectedRoute component={PluginSubCategoriesPage} />
      </Route>

      {/* 4️⃣ Plugin List */}
      <Route path="/plugins/:category/:subcategory">
        <ProtectedRoute component={PluginListPage} />
      </Route>

      {/* 5️⃣ Plugin Detail */}
      <Route path="/plugin/:plugin_id">
        <ProtectedRoute component={PluginDetailPage} />
      </Route>

      {/* ---------- FALLBACK ---------- */}
      <Route component={NotFound} />
    </Switch>
  );
}

// 🔥 App Root
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ChainDataProvider>
            <PluginDataProvider>
            <MainLayout>
              <Router />
            </MainLayout>

            <Toaster />
            </PluginDataProvider>
          </ChainDataProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
