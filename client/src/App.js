import { BrowserRouter as Router } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";
import AllRoutes from "./AllRoutes";
import { fetchAllQuestions } from "./actions/question";
import { fetchAllUsers } from "./actions/users";
import { getWeather } from "./utils/weather"; 

function App() {
  const dispatch = useDispatch();
  const [theme, setTheme] = useState("");

  useEffect(() => {
    dispatch(fetchAllQuestions());
    dispatch(fetchAllUsers());

    const fetchTheme = async (latitude, longitude) => {
      try {
        const weatherData = await getWeather(latitude, longitude);

        console.log('Weather data:', weatherData);

        const currentHour = new Date().getHours();
        if (currentHour >= 19 || currentHour < 6) {
          setTheme("night");
        } else if (weatherData.weather[0].main.toLowerCase().includes("rain")) {
          setTheme("night");
        } else {
          setTheme("");
        }
      } catch (error) {
        console.error("Error fetching weather data:", error);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchTheme(latitude, longitude);
        },
        (error) => {
          console.error("Error fetching location:", error);
          
          fetchTheme(40.7128, -74.0060);
        }
      );
    } else {
     
      fetchTheme(40.7128, -74.0060);
    }
  }, [dispatch]);

  return (
    <div className={`App ${theme}`}>
      <Router>
        <Navbar />
        <AllRoutes />
      </Router>
    </div>
  );
}

export default App;
