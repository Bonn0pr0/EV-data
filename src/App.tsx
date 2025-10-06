import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import Market from "@/pages/Market";
import Analytics from "@/pages/Analytics";
import API from "@/pages/API";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/market" element={<Market />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/api" element={<API />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;