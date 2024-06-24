import React, { useState } from "react";
import "./LeftSidebar.css";
import { NavLink } from "react-router-dom";
import Globe from "../../assets/Globe.svg";

const LeftSidebar = () => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <div>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        ☰
      </button>
      <div className={`left-sidebar ${isSidebarVisible ? 'active' : ''}`}>
        <nav className="side-nav">
          <button onClick={toggleSidebar} className="nav-btn">
            <NavLink to="/" className="side-nav-links" activeclassname="active">
              <p>Home</p>
            </NavLink>
          </button>
          <div className="side-nav-div">
            <div>
              <p>PUBLIC</p>
            </div>
            <button onClick={toggleSidebar} className="nav-btn">
              <NavLink
                to="/Questions"
                className="side-nav-links"
                activeclassname="active"
              >
                <img src={Globe} alt="Globe" />
                <p style={{ paddingLeft: "10px" }}> Questions </p>
              </NavLink>
            </button>
            <button onClick={toggleSidebar} className="nav-btn">
              <NavLink
                to="/Tags"
                className="side-nav-links"
                activeclassname="active"
                style={{ paddingLeft: "40px" }}
              >
                <p>Tags</p>
              </NavLink>
            </button>
            <button onClick={toggleSidebar} className="nav-btn">
              <NavLink
                to="/Users"
                className="side-nav-links"
                activeclassname="active"
                style={{ paddingLeft: "40px" }}
              >
                <p>Users</p>
              </NavLink>
            </button>
            <button onClick={toggleSidebar} className="nav-btn">
              <NavLink
                to="/PublicSpace"
                className="side-nav-links"
                activeclassname="active"
                style={{ paddingLeft: "40px" }}
              >
                <p>Public Space</p>
              </NavLink>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default LeftSidebar;
