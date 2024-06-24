import axios from 'axios';

export async function getWeather(latitude, longitude) {
  const apiKey = 'db917d4389cbd3ef5d4b96bb4a0db709';  
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
  
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
}
