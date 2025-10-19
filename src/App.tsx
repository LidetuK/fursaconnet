
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import ExpertDashboard from "./pages/ExpertDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ExpertRegistry from "./pages/ExpertRegistry";
import SignIn from "./pages/SignIn";
import Payment from "./pages/Payment";
import SocialAuthCallback from "./pages/SocialAuthCallback";
import FacebookAuthCallback from "./pages/FacebookAuthCallback";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import DataDeletion from "./pages/DataDeletion";
import TwitterCallback from '@/pages/twitter/callback';
import ProtectedRoute from '@/components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/expertregistry" element={<ExpertRegistry />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/auth" element={<SignIn />} />
                <Route path="/auth/social-callback" element={<SocialAuthCallback />} />
                <Route path="/auth/facebook/callback" element={<FacebookAuthCallback />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/expert-dashboard" element={<ProtectedRoute><ExpertDashboard /></ProtectedRoute>} />
                <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/data-deletion" element={<DataDeletion />} />
                <Route path="/twitter/callback" element={<TwitterCallback />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Router>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
