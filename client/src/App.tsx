import { useEffect } from "react";
import { supabase } from "./lib/supabase";

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">LaunchMind AI</h1>
        <p className="mt-2 text-gray-500">Testing Supabase Connection...</p>
      </div>
    </div>
  );
}

export default App;
