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

export {
  form,
  inputLocation,
  locationName,
  locationCountry,
  condition,
  temp,
  wind,
  weatherIcon,
  locationFlag,
  weatherIconContainer,
  localTime,
  weatherInfoContainer,
  weatherError,
  loadingComponent,
};
