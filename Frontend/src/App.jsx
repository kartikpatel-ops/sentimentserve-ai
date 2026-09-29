import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Company from "./pages/Company";
import WriteReview from "./pages/WriteReview";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AIInsights from "./pages/AIInsights";
import Compare from "./pages/compare";
import Recommendations from "./pages/Recommendations";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route
          path="/company/:companyName"
          element={<Company />}
        />
        <Route path="/company/google/:businessData" element={<Company />} />

        <Route
          path="/company/:companyName/review"
          element={<WriteReview />}
        />
        <Route
  path="/company/google/review"
  element={<WriteReview />}
/>
        <Route path="/login" element={<Login />} />

<Route path="/signup" element={<Signup />} />
<Route
  path="/dashboard"
  element={<Dashboard />}
/>
<Route path="/ai-insights" element={<AIInsights />} />
<Route path="/compare" element={<Compare />} />
<Route
  path="/recommendations"
  element={<Recommendations />}
/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;