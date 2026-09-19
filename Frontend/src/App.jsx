import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Company from "./pages/Company";
import WriteReview from "./pages/WriteReview";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AIInsights from "./pages/AIInsights";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/company/:companyName"
          element={<Company />}
        />

        <Route
          path="/company/:companyName/review"
          element={<WriteReview />}
        />
        <Route path="/login" element={<Login />} />

<Route path="/signup" element={<Signup />} />
<Route
  path="/dashboard"
  element={<Dashboard />}
/>
<Route path="/ai-insights" element={<AIInsights />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;