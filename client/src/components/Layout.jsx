import { Badge } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../layout.css";

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.user);
  console.log("User ?", user);

  const navigate = useNavigate();
  const location = useLocation();

  const userMenu = [
    {
      name: "Home",
      path: "/homepage",
      icon: "ri-home-3-line",
    },
    {
      name: "Chat",
      path: "/chat",
      icon: "ri-message-2-fill",
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: "ri-file-list-3-line",
    },
    // {
    //   name: "Apply Doctor",
    //   path: "/applyDoctor",
    //   icon: "ri-hospital-line",
    // },
    {
      name: "Profile",
      path: "/profile",
      icon: "ri-user-line",
    },
  ];

  const doctorMenu = [
    {
      name: "Home",
      path: "/homepage",
      icon: "ri-home-3-line",
    },
    {
      name: "Chat",
      path: "/chat",
      icon: "ri-message-2-fill",
    },
    {
      name: "Patient Record",
      path: "/admin/patient-record",
      icon: "ri-folder-user-line",
    },
    {
      name: "DoctorInformation",
      path: "/applyDoctor",
      icon: "ri-hospital-line",
    },
    {
      name: "Doctor Schedule",
      path: "/doctor-schedule",
      icon: "ri-folder-user-line",
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: "ri-file-list-3-line",
    },

    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "ri-user-line",
    },
  ];

  const ApplydoctorMenu = [
    {
      name: "Home",
      path: "/homepage",
      icon: "ri-home-3-line",
    },
    {
      name: "Appointments",
      path: "/appointments",
      icon: "ri-file-list-3-line",
    },
    {
      name: "Apply Doctor",
      path: "/applyDoctor",
      icon: "ri-hospital-line",
    },
    {
      name: "Profile",
      path: `/doctor/profile/${user?._id}`,
      icon: "ri-user-line",
    },
  ];

  const adminMenu = [
    {
      name: "Home",
      path: "/homepage",
      icon: "ri-home-3-line",
    },
    {
      name: "Chat",
      path: "/chat",
      icon: "ri-message-2-fill",
    },
    // {
    //   name: "Patient Record",
    //   path: "/admin/patient-record",
    //   icon: "ri-folder-user-line",
    // },
    {
      name: "DoctorAccount",
      path: "/admin/doctor-account",
      icon: "ri-account-pin-box-line",
    },
    {
      name: "Clinic Service",
      path: "/admin/clinic-service",
      icon: "ri-service-fill",
    },
    {
      name: "Users List",
      path: "/admin/userslist",
      icon: "ri-folder-user-line",
    },
    {
      name: "DoctorsInformation",
      path: "/admin/doctorslist",
      icon: "ri-hospital-line",
    },
    {
      name: "Customizations",
      path: "/profile",
      icon: "ri-settings-3-line",
    },
  ];

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  const menuToBeRendered = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : user?.logDoctor
    ? doctorMenu
    : user?.isApplyDoctor
    ? ApplydoctorMenu
    : userMenu;

  const role = user?.isAdmin
    ? "Admin"
    : user?.isDoctor
    ? "Doctor"
    : user?.logDoctor
    ? "Doctor"
    : user?.isApplyDoctor
    ? "ApplyDoctor"
    : "User";

  return (
    <div className="main">
      <div className="d-flex layout">
        <div className="sidebar">
          <div className="sidebar-header">
            <h1 className="logo">SMC</h1>
            <h1 className="role">Role : {role}</h1>
          </div>
          <div className="menu">
            {menuToBeRendered.map((menus) => {
              const isActive = location.pathname === menus.path;
              return (
                <div
                  className={`d-flex menu-item ${
                    isActive && "active-menu-item"
                  }`}
                >
                  <i className={menus.icon}></i>
                  {!collapsed && <Link to={menus.path}>{menus.name}</Link>}
                </div>
              );
            })}

            <div className={`d-flex menu-item`} onClick={logout}>
              <i className="ri-logout-circle-line"></i>
              {!collapsed && <Link to="/">Logout</Link>}
            </div>
          </div>
        </div>
        <div className="content">
          <div className="header">
            {collapsed ? (
              <i
                className="ri-menu-2-fill header-action-icon"
                onClick={() => setCollapsed(false)}
              ></i>
            ) : (
              <i
                className="ri-close-circle-fill header-action-icon"
                onClick={() => setCollapsed(true)}
              ></i>
            )}

            <div className="d-flex align-items-center px-4">
              <Badge
                count={user?.unseenNotification?.length}
                onClick={() => navigate("/notifications")}
              >
                <i className="ri-notification-2-line header-action-icon px-3"></i>
              </Badge>

              <Link className="anchor mx-3" to="/profile">
                {user?.name}
              </Link>
            </div>
          </div>
          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
