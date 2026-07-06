import { useEffect } from "react";
import { supabase } from "./lib/supabase";
import { DashboardLayout } from "./components/layout/DashboardLayout";

function App() {
  useEffect(() => {
    async function testConnection() {
      const { data, error } = await supabase.auth.getSession();
      console.log("Supabase Connected");
      console.log("Data:", data);
      console.log("Error:", error);
    }

    testConnection();
  }, []);

  return <DashboardLayout />;
}

export default App;
