import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import WakingUpOverlay from "./components/WakingUpOverlay";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import { ApiStatusProvider } from "./context/ApiStatusContext";
import Category from "./pages/Category";
import CategoryDetailsPage from "./pages/CategoryDetails";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import Login from "./pages/Login";
import Monthly from "./pages/Monthly";
import Processing from "./pages/Processing";
import Signup from "./pages/Signup";
import Upload from "./pages/Upload";

function App() {
  const protect = (element) => <ProtectedRoute>{element}</ProtectedRoute>;

  return (
    <ApiStatusProvider>
      <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />
        <WakingUpOverlay />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/upload" element={protect(<Upload />)} />
          <Route path="/dashboard" element={protect(<Navigate to="/upload" />)} />
          <Route
            path="/dashboard/:id"
            element={protect(
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            )}
          />
          <Route
            path="/dashboard/:id/category-breakdown"
            element={protect(
              <DashboardLayout>
                <Category />
              </DashboardLayout>
            )}
          />
          <Route
            path="/dashboard/:id/category/:name"
            element={protect(
              <DashboardLayout>
                <CategoryDetailsPage />
              </DashboardLayout>
            )}
          />
          <Route
            path="/dashboard/:id/monthly-summary"
            element={protect(
              <DashboardLayout>
                <Monthly />
              </DashboardLayout>
            )}
          />
          <Route
            path="/dashboard/:id/monthly"
            element={protect(
              <DashboardLayout>
                <Monthly />
              </DashboardLayout>
            )}
          />
          <Route
            path="/dashboard/:id/history"
            element={protect(
              <DashboardLayout>
                <History />
              </DashboardLayout>
            )}
          />
          <Route path="/processing" element={protect(<Processing />)} />
          <Route path="/processing/:id" element={protect(<Processing />)} />
        </Routes>
      </BrowserRouter>
    </ApiStatusProvider>
  );
}

export default App;
