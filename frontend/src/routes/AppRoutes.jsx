
import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import UploadResumePage from "../pages/UploadResumePage";
import AnalysisResultsPage from "../pages/AnalysisResultsPage";
import DashboardPage from "../pages/DashboardPage";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/scanner" element={<UploadResumePage />} />
        <Route path="/results" element={<AnalysisResultsPage />} />
        <Route path="/results/:reportId" element={<AnalysisResultsPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
