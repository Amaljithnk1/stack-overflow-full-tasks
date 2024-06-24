import React, { useEffect, useState } from "react";
import { getLoginHistory } from "../../api"; 
import moment from "moment";
import "./LoginHistory.css"; 

const LoginHistory = ({ userId }) => {
  const [loginHistory, setLoginHistory] = useState([]);

  useEffect(() => {
    const fetchLoginHistory = async () => {
      try {
        const response = await getLoginHistory();
        setLoginHistory(response.data);
      } catch (error) {
        console.error("Error fetching login history:", error);
      }
    };

    fetchLoginHistory();
  }, [userId]);

  return (
    <div className="login-history-container">
      <h2>Login History</h2>
      <ul>
        {loginHistory.map((login, index) => (
          <li key={index}>
            <p><strong>Timestamp:</strong> {moment(login.timestamp).format('MMMM Do YYYY, h:mm:ss a')}</p>
            
            <p><strong>Browser:</strong> {login.browser}</p>
            <p><strong>OS:</strong> {login.os}</p>
            <p><strong>Device:</strong> {login.device}</p>
            <p><strong>IP:</strong> {login.ip}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LoginHistory;
