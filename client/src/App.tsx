import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/error-boundary";
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
import BibleLookup from "@/pages/bible-lookup";

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
      <Route path="/bible" component={BibleLookup} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Simple test to identify the issue
  try {
    return (
      <div style={{ padding: '20px', backgroundColor: 'lightblue' }}>
        <h1>F-AI-TH-Connect Test</h1>
        <p>If you can see this, React is working!</p>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <div style={{ backgroundColor: 'lightgreen', padding: '10px', margin: '10px' }}>
              <p>Query Client and Tooltip Provider loaded</p>
              <Router />
            </div>
          </TooltipProvider>
        </QueryClientProvider>
      </div>
    );
  } catch (error) {
    console.error("App render error:", error);
    return (
      <div style={{ padding: '20px', color: 'red', backgroundColor: 'pink' }}>
        <h1>App Error</h1>
        <p>Error: {String(error)}</p>
      </div>
    );
  }
}

export default App;
