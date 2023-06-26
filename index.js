const WEATHER_API_KEY = "d8a4fae896304025bec80543231306";
const inputLocation = "London";

async function getWeatherData(location) {
  const response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${location}`,
    { mode: "cors" }
  );

  const data = await response.json();
  console.log(data);
  return data;
}

getWeatherData(inputLocation);
