import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { useAuth } from "./_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import Home from "./pages/Home";
import WarRoom from "./pages/WarRoom";
import AffiliateStore from "./pages/AffiliateStore";
import AriaWelcomeBack from "./pages/AriaWelcomeBack";
import BookClub from "./pages/BookClub";
import BotEnginePanel from "./pages/BotEnginePanel";
import CheckMate from "./pages/CheckMate";
import ClubMatch from "./pages/ClubMatch";
import ClubVault from "./pages/ClubVault";
import ColdCallDashboard from "./pages/ColdCallDashboard";
import Concierge from "./pages/Concierge";
import ConfidenceCologne from "./pages/ConfidenceCologne";
import Episodes from "./pages/Episodes";
import Feed from "./pages/Feed";
import InAppWallet from "./pages/InAppWallet";
import Live from "./pages/Live";
import Login from "./pages/Login";
import LoginOnboarding from "./pages/LoginOnboarding";
import ProfileSetup from "./pages/ProfileSetup";
import SocialEntry from "./pages/SocialEntry";
import SocialFeed from "./pages/SocialFeed";
import SocialProfile from "./pages/SocialProfile";
import Staff from "./pages/Staff";
import Subscribe from "./pages/Subscribe";
import Terms from "./pages/Terms";
import UserMarketplace from "./pages/UserMarketplace";
import WellnessBots from "./pages/WellnessBots";

// Admin-only guard — redirects to login if not authenticated, blocks non-admins
function AdminRoute({ component: Component }: { component: React.ComponentType }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#050505", display: "flex", alignItems: "center", justifyContent: "center", color: "#d4af37", fontFamily: "monospace", letterSpacing: 4, fontSize: 11 }}>
        VERIFYING ACCESS...
      </div>
    );
  }

  // Not logged in — show login button directly on the War Room page
  if (!user) {
    return (
      <div style={{ minHeight: "100vh", background: "#050505", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace" }}>
        <div style={{ background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: 8, padding: "40px 48px", width: 320, textAlign: "center" }}>
          <div style={{ color: "#d4af37", fontSize: 11, letterSpacing: 4, fontWeight: 700, marginBottom: 8 }}>🔐 WAR ROOM</div>
          <div style={{ color: "#444", fontSize: 9, letterSpacing: 2, marginBottom: 28 }}>ADMIN ACCESS REQUIRED</div>
          <a
            href={getLoginUrl()}
            style={{ display: "block", width: "100%", background: "#d4af37", border: "none", borderRadius: 4, color: "#000", fontFamily: "monospace", fontSize: 11, letterSpacing: 3, fontWeight: 700, padding: "12px 0", cursor: "pointer", textDecoration: "none", boxSizing: "border-box" }}
          >
            LOGIN TO CONTINUE
          </a>
        </div>
      </div>
    );
  }

  // Logged in but not admin
  if (user.role !== "admin") {
    return (
      <div style={{ minHeight: "100vh", background: "#050505", display: "flex", alignItems: "center", justifyContent: "center", color: "#ff3333", fontFamily: "monospace", letterSpacing: 4, fontSize: 11 }}>
        ACCESS DENIED
      </div>
    );
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      {/* Public / Marketing */}
      <Route path={"/"} component={Home} />
      <Route path={"/episodes"} component={Episodes} />
      <Route path={"/staff"} component={Staff} />
      <Route path={"/affiliate"} component={AffiliateStore} />
      <Route path={"/vault"} component={ClubVault} />
      <Route path={"/subscribe"} component={Subscribe} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/confidence-cologne"} component={ConfidenceCologne} />
      <Route path={"/checkmate"} component={CheckMate} />
      <Route path={"/book-club"} component={BookClub} />
      <Route path={"/marketplace"} component={UserMarketplace} />

      {/* Social / App side */}
      <Route path={"/social"} component={SocialEntry} />
      <Route path={"/login"} component={Login} />
      <Route path={"/onboarding"} component={LoginOnboarding} />
      <Route path={"/profile-setup"} component={ProfileSetup} />
      <Route path={"/aria"} component={AriaWelcomeBack} />
      <Route path={"/feed"} component={Feed} />
      <Route path={"/social-feed"} component={SocialFeed} />
      <Route path={"/social-profile"} component={SocialProfile} />
      <Route path={"/live"} component={Live} />
      <Route path={"/concierge"} component={Concierge} />
      <Route path={"/wallet"} component={InAppWallet} />
      <Route path={"/club-match"} component={ClubMatch} />

      {/* Admin */}
      <Route path={"/war-room"}>{() => <AdminRoute component={WarRoom} />}</Route>
      <Route path={"/bot-engine"}>{() => <AdminRoute component={BotEnginePanel} />}</Route>
      <Route path={"/cold-call"}>{() => <AdminRoute component={ColdCallDashboard} />}</Route>

      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
