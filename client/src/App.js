import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Homepage from "./Pages/Homepage";
import { useSelector } from "react-redux";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ApplyDoctor from "./Pages/ApplyDoctor";
import Notification from "./Pages/Notification";
import UsersList from "./Pages/Admin/UsersList";
import DoctorsList from "./Pages/Admin/DoctorsList";
import Profile from "./Pages/Doctor/Profile";
import BookAppointment from "./Pages/BookAppointment";
import Appointments from "./Pages/Appointments";
import PatientRecord from "./Pages/Admin/PatientRecord";
import PatientProfile from "./Pages/Admin/PatientProfile";
import DoctorAccount from "./Pages/Admin/DoctorAccount";
import ClinicService from "./Pages/Admin/ClinicService";
import Chat from "./Pages/Chat";
import DoctorSchedule from "./Pages/Doctor/DoctorSchedule";

function App() {
  const { loading } = useSelector((state) => state.alerts);
  return (
    <Router>
      {loading && (
        <div className="spinner-parent">
          <div class="spinner-border" role="status"></div>
        </div>
      )}

      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/homepage"
          element={
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/applyDoctor"
          element={
            <ProtectedRoute>
              <ApplyDoctor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notification />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/userslist"
          element={
            <ProtectedRoute>
              <UsersList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/doctorslist"
          element={
            <ProtectedRoute>
              <DoctorsList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/profile/:userId"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/homepage/book-appointment/:doctorId"
          element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/patient-record"
          element={
            <ProtectedRoute>
              <PatientRecord />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient-profile/:patientId"
          element={
            <ProtectedRoute>
              <PatientProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/doctor-account"
          element={
            <ProtectedRoute>
              <DoctorAccount />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/clinic-service"
          element={
            <ProtectedRoute>
              <ClinicService />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-schedule"
          element={
            <ProtectedRoute>
              <DoctorSchedule />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
