import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SimpleProtectedRoute } from "@/components/SimpleProtectedRoute";
import Homepage from "./pages/Homepage";
import Workspace from "./pages/Workspace";
import Dashboard from "./pages/Dashboard";
import SimpleSignIn from "./pages/SimpleSignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/signin" element={<SimpleSignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/workspace"
            element={
              <SimpleProtectedRoute>
                <Workspace />
              </SimpleProtectedRoute>
            }
          />
          <Route
            path="/agent/:agentId"
            element={
              <SimpleProtectedRoute>
                <Dashboard />
              </SimpleProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
