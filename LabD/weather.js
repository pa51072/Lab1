function getWeather() {
  const addressInput = document.getElementById("addressInput");
  const cityName = addressInput.value;

  document.getElementById("currentWeather").innerHTML = "";
  document.getElementById("forecast").innerHTML = "";

  const xhr = new XMLHttpRequest();
  const apiKey = "7ded80d91f2b280ec979100cc8bbba94";
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;
  xhr.open("GET", currentWeatherUrl, true);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      const currentWeatherData = JSON.parse(xhr.responseText);
      displayCurrentWeather(currentWeatherData);

      console.log("API:", currentWeatherData);
    } else {
      console.error("Błąd pobierania danych z API");
    }
  };

  xhr.send();

  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${apiKey}`;

  fetch(forecastUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Network response was not ok, status: ${response.status}`
        );
      }
      return response.json();
    })
    .then((forecastData) => {
      console.log("Fetch:", forecastData);
      displayForecast(forecastData);
    })
    .catch((error) => {
      console.error("Błąd pobierania danych prognozy:", error);
    });
}

function displayCurrentWeather(data) {
  const currentWeatherDiv = document.getElementById("currentWeather");
  const tempCelsius = (data.main.temp - 273.15).toFixed(1);
  const iconCode = data.weather[0].icon;
  const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

  currentWeatherDiv.innerHTML = `
        <h2>Aktualna pogoda w ${data.name}</h2>
        <p>Temperatura: ${tempCelsius} &deg;C</p>
        <p>Pogoda: ${data.weather[0].description}</p>
        <img src="${iconUrl}" alt="Weather Icon">
        <p>Wilgotność: ${data.main.humidity}%</p>
        <p>Prędkość wiatru: ${data.wind.speed} m/s</p>
      `;
}

function displayForecast(data) {
  const forecastDiv = document.getElementById("forecast");
  forecastDiv.innerHTML = "<h2>Prognoza pogody na 5 dni:</h2>";

  for (let i = 0; i < data.list.length; i += 8) {
    const dayData = data.list[i];
    const date = new Date(dayData.dt_txt);
    const dayOfWeek = getDayOfWeek(date.getDay());

    const dayForecastDiv = document.createElement("div");
    dayForecastDiv.classList.add("dayForecast");

    for (let j = i; j < i + 8; j++) {
      const hourData = data.list[j];
      const hour = new Date(hourData.dt_txt).getHours();

      if (hour === 0 || hour === 12 || hour === 18) {
        const { main, weather, wind } = hourData;
        const tempCelsius = (main.temp - 273.15).toFixed(1);
        const humidity = main.humidity;
        const windSpeed = wind.speed;
        const iconCode = weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;

        const hourlyForecastDiv = document.createElement("div");
        hourlyForecastDiv.classList.add("hourlyForecast");

        hourlyForecastDiv.innerHTML = `
            <h4>${dayOfWeek}</h4>
            <p>${hour}:00</p>
            <img src="${iconUrl}" alt="Weather Icon">
            <p>Temperatura: ${tempCelsius} &deg;C</p>
            <p>Pogoda: ${weather[0].description}</p>
            <p>Wilgotność: ${humidity}%</p>
            <p>Prędkość wiatru: ${windSpeed} m/s</p>
          `;

        dayForecastDiv.appendChild(hourlyForecastDiv);
      }
    }

    forecastDiv.appendChild(dayForecastDiv);
  }
}


function getDayOfWeek(dayIndex) {
  const daysOfWeek = [
    "Niedziela",
    "Poniedziałek",
    "Wtorek",
    "Środa",
    "Czwartek",
    "Piątek",
    "Sobota",
  ];
  return daysOfWeek[dayIndex];
}