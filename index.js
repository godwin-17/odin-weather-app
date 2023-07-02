import { iconMapping } from "./assets/js/iconsPath.js";

const WEATHER_API_KEY = "d8a4fae896304025bec80543231306";
const form = document.querySelector("form");
const inputLocation = document.querySelector("#weatherInput");
const locationName = document.querySelector(".location");
const locationCountry = document.querySelector(".location-country");
const condition = document.querySelector(".condition");
const temp = document.querySelector(".temp");
const wind = document.querySelector(".wind");
const weatherIcon = document.querySelector(".weather-icon");
const locationFlag = document.querySelector(".location-flag");
const weatherIconContainer = document.querySelector(".weather-icon-container");

let isMetric = true;
let tempC;
let tempF;
let windKph;
let windMph;

weatherIcon.addEventListener("click", toggleMetrics);

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  isMetric = true;
  const weatherData = await getWeatherData(inputLocation.value);

  setLocationConditions(weatherData);

  const isDay = weatherData.isDay;

  setWeatherBackground(isDay);
  console.log(weatherData);
  locationName.textContent = weatherData.location;
  locationCountry.textContent = weatherData.country;
  condition.textContent = weatherData.condition;
  temp.textContent = weatherData.tempCelsius + " °C";
  wind.textContent = "Wind: " + weatherData.windKph + "km/h";

  const imageUrls = iconMapping[weatherData.code];
  weatherIcon.src = isDay ? imageUrls[0] : imageUrls[1];
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
    const countryFlag = await getCountryFlag(processedData.country);

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
      isDay: weatherData.current.is_day,
    };

    return processedData;
  } catch (error) {
    console.log(error);
  }
}

async function getCountryFlag(country) {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${country}`,
      { mode: "cors" }
    );

    const data = await response.json();

    console.log(data);
    console.log(data.length);

    if (data.length > 1) {
      const countryDetails = data.find((e) => e.name.common === country);
      locationFlag.src = countryDetails.flags.svg;
      console.log(countryDetails.flag);
      console.log(countryDetails.name.common);
    } else {
      locationFlag.src = data[0].flags.svg;
      console.log(data[0].flag);
      console.log(data[0].name.common);
    }
  } catch (error) {
    console.log(error);
    locationFlag.src = "";
  }
}

function toggleMetrics() {
  if (isMetric) {
    temp.textContent = `${tempF} °F`;
    wind.textContent = `Wind; ${windMph} mph`;
    isMetric = false;
  } else {
    temp.textContent = `${tempC} °C`;
    wind.textContent = `Wind: ${windKph} km/h`;
    isMetric = true;
  }
}

function setLocationConditions(location) {
  tempC = location.tempCelsius;
  tempF = location.tempFahrenheit;
  windKph = location.windKph;
  windMph = location.windMph;
}

function setWeatherBackground(isDay) {
  if (isDay) {
    weatherIconContainer.style.backgroundImage = "url(./assets/images/day.jpg)";
  } else {
    weatherIconContainer.style.backgroundImage =
      "url(./assets/images/night.jpg)";
  }
}
