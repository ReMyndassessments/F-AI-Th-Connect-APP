import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/error-boundary";
import InstallPrompt from "@/components/pwa/install-prompt";
import { LanguageProvider } from "@/contexts/LanguageContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Chat from "@/pages/chat";
import AdminDashboard from "@/pages/admin";
import AdminLogin from "@/pages/admin-login";
import Help from "@/pages/help";
import Contact from "@/pages/contact";
import Privacy from "@/pages/privacy";
import Terms from "@/pages/terms";
import Share from "@/pages/share";
import BibleStudy from "@/pages/bible-study";
import BibleGames from "@/pages/bible-games";
import DGroupRoom from "@/pages/dgroup-room";
import SupportPage from "@/pages/support";
import MissionsDirectory from "@/pages/missions";
import MissionsRegister from "@/pages/missions-register";
import MissionsProfile from "@/pages/missions-profile";
import VoiceTest from "@/pages/voice-test";
import APIDiagnostics from "@/pages/api-diagnostics";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/chat" component={Chat} />
      <Route path="/chat/:sessionId" component={Chat} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin-login" component={AdminLogin} />
      <Route path="/help" component={Help} />
      <Route path="/contact" component={Contact} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/share" component={Share} />
      <Route path="/bible" component={BibleStudy} />
      <Route path="/dgroup/:code" component={DGroupRoom} />
      <Route path="/bible-games" component={BibleGames} />
      <Route path="/support" component={SupportPage} />
      <Route path="/missions/register" component={MissionsRegister} />
      <Route path="/missions/:slug" component={MissionsProfile} />
      <Route path="/missions" component={MissionsDirectory} />
      <Route path="/voice-test" component={VoiceTest} />
      <Route path="/api-diagnostics" component={APIDiagnostics} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
            <InstallPrompt />
          </TooltipProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
