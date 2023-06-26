const WEATHER_API_KEY = "d8a4fae896304025bec80543231306";
const inputLocation = "London";

async function getWeatherData(location) {
  const response = await fetch(
    `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${location}`,
    { mode: "cors" }
  );

  const data = await response.json();

  const processedData = await processWeatherData(data);

  console.log("Processed Data", processedData);
  return processedData;
}

getWeatherData(inputLocation);

async function processWeatherData(data) {
  const weatherData = await data;

  const processedData = {
    location: weatherData.location.name,
    country: weatherData.location.country,
    localTime: weatherData.location.localtime,
    condition: weatherData.current.condition.text,
    tempCelsius: weatherData.current.temp_c,
    tempFahrenheit: weatherData.current.temp_f,
    windKph: weatherData.current.wind_kph,
    windMph: weatherData.current.wind_mph,
  };

  return processedData;
}
