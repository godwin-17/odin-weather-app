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
const localTime = document.querySelector(".localtime");
const weatherInfoContainer = document.querySelector(".weather-container");
const weatherError = document.querySelector(".weather-error");
const loadingComponent = document.querySelector(".loading");

let isMetric = true;
let tempC;
let tempF;
let windKph;
let windMph;

weatherIcon.addEventListener("click", toggleMetrics);

form.addEventListener("submit", async (e) => {
  weatherInfoContainer.style.display = "none";
  showLoadingComponent();
  e.preventDefault();
  isMetric = true;
  weatherError.textContent = "";
  const weatherData = await getWeatherData(inputLocation.value);

  if (weatherData) {
    setLocationConditions(weatherData);

    const isDay = weatherData.isDay;

    setWeatherBackground(isDay);

    locationName.textContent = weatherData.location;
    locationCountry.textContent = weatherData.country;
    condition.textContent = weatherData.condition;
    temp.textContent = weatherData.tempCelsius + " °C";
    wind.textContent = "Wind: " + weatherData.windKph + "km/h";
    const date = formatDate(weatherData.localTime);
    localTime.textContent = date;
    const imageUrls = iconMapping[weatherData.code];
    weatherIcon.src = isDay ? imageUrls[0] : imageUrls[1];
    hideLoadingComponent();
    weatherInfoContainer.style.display = "flex";
  }
});

async function getWeatherData(location) {
  try {
    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${location}`,
      { mode: "cors" }
    );

    const data = await response.json();

    if ("error" in data) {
      hideLoadingComponent();
      displayError();
    }

    const processedData = await processWeatherData(data);
    const countryFlag = await getCountryFlag(processedData.country);

    return processedData;
  } catch (error) {}
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
  } catch (error) {}
}

async function getCountryFlag(country) {
  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${country}`,
      { mode: "cors" }
    );

    const data = await response.json();

    if (data.length > 1) {
      const countryDetails = data.find((e) => e.name.common === country);
      locationFlag.src = countryDetails.flags.svg;
    } else {
      locationFlag.src = data[0].flags.svg;
    }
  } catch (error) {
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

function displayError() {
  weatherIconContainer.style.backgroundImage = "url(./assets/images/night.jpg)";
  weatherIcon.src = "./assets/weather-icons/1006.svg";
  weatherError.textContent = "No matching location found.";
  weatherError.style.display = "block";
  clearData();
  weatherInfoContainer.style.display = "flex";
}

function clearData() {
  locationFlag.src = "";
  localTime.textContent = "";
  locationName.textContent = "";
  locationCountry.textContent = "";
  condition.textContent = "";
  temp.textContent = "";
  wind.textContent = "";
  localTime.textContent = "";
}

function formatDate(date) {
  const [datePart, timePart] = date.split(" ");

  const [year, month, day] = datePart.split("-");

  const [hour, minute] = timePart.split(":");

  const newDate = new Date(year, month - 1, day, hour, minute);

  const options = {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  const formattedDate = newDate.toLocaleString("en-GB", options);
  return formattedDate;
}

function showLoadingComponent() {
  loadingComponent.style.display = "block";
}

function hideLoadingComponent() {
  loadingComponent.style.display = "none";
}
