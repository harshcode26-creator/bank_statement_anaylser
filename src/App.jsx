import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashboardLayout from "./layouts/DashboardLayout";
import Category from "./pages/Category";
import CategoryDetailsPage from "./pages/CategoryDetails";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Monthly from "./pages/Monthly";
import Processing from "./pages/Processing";
import Upload from "./pages/Upload";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/upload" />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/dashboard" element={<Navigate to="/upload" />} />
        <Route
          path="/dashboard/:id"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/:id/category-breakdown"
          element={
            <DashboardLayout>
              <Category />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/:id/category/:name"
          element={
            <DashboardLayout>
              <CategoryDetailsPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/:id/monthly-summary"
          element={
            <DashboardLayout>
              <Monthly />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/:id/monthly"
          element={
            <DashboardLayout>
              <Monthly />
            </DashboardLayout>
          }
        />
        <Route
          path="/dashboard/:id/history"
          element={
            <DashboardLayout>
              <History />
            </DashboardLayout>
          }
        />
        <Route
          path="/processing"
          element={<Processing />}
        />
        <Route
          path="/processing/:id"
          element={<Processing />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
