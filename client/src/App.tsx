import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { Login } from "./pages/Login";

function App() {
  const [session, setSession] = useState<any>(null);
  useEffect(() => {
    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <Login />;
  }

  return <DashboardLayout />;
}

export default App;
