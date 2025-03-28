import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Store from "@/pages/store";
import WatchDetail from "@/pages/watch-detail";
import TryOn from "@/pages/try-on";
import Navbar from "@/components/navbar";

function Router() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pb-16">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/store" component={Store} />
          <Route path="/watch/:id" component={WatchDetail} />
          <Route path="/try-on/:id" component={TryOn} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
