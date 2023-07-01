const WEATHER_API_KEY = "d8a4fae896304025bec80543231306";
const form = document.querySelector("form");
const inputLocation = document.querySelector("#weatherInput");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  getWeatherData(inputLocation.value);
});

async function getWeatherData(location) {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${location}`,
      { mode: "cors" }
    );

    const data = await response.json();
    console.log(data);
    const processedData = await processWeatherData(data);

    console.log("Processed Data", processedData);
    return processedData;
  } catch (error) {
    console.log(error);
  }
}

async function processWeatherData(data) {
  try {
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
      code: weatherData.current.condition.code,
    };

    return processedData;
  } catch (error) {
    console.log(error);
  }
}
