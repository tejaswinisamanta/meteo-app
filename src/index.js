function refreshWeather(response) {
    let temperatureElement = document.querySelector("#temperature");
    let temperature = response.data.temperature.current;
    let cityElement = document.querySelector("#city");
    let descriptionElement = document.querySelector("#description");
    let humidityElement = document.querySelector("#humidity");
    let windSpeedElement = document.querySelector("#wind-speed");
    let timeElement = document.querySelector("#time");
    let date = new Date(response.data.time * 1000);

    let iconElement = document.querySelector("#icon");
    iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="weather-app-icon" />`;

    cityElement.innerHTML = response.data.city;
    timeElement.innerHTML = formatDate(date);
    descriptionElement.innerHTML = `${response.data.condition.description}`;
    humidityElement.innerHTML = `${response.data.temperature.humidity}%`;
    windSpeedElement.innerHTML = `${response.data.wind.speed}km/h`;
    temperatureElement.innerHTML = `${Math.round(temperature)}`;

    getForecast(response.data.city);
}

function formatDate(date) {
    let day = date.getDay();
    let minutes = date.getMinutes();
    let hours = date.getHours();
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    day = days[date.getDay()];

    if (minutes < 10) {
        minutes = `0${minutes}`;
    }

    return `${day} ${hours}:${minutes}`;

}

function searchCity(city) {
    // make api call and update the interface
    let apiKey = "2c00a5b0tfa996f784d39a0b16ee6fo7";
    let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
    axios.get(apiUrl).then(refreshWeather);
} 

function handleSearchSubmit(event) {
    event.preventDefault();
    let searchInput = document.querySelector("#search-form-input");
    searchCity(searchInput.value);
}

function formatDay(timestamp) {
    let date = new Date(timestamp * 1000);
    let days = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];

    return days[date.getDay()];
}

function getForecast(city) {
    let apiKey = "2c00a5b0tfa996f784d39a0b16ee6fo7";
    let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayForecast);

}

function displayForecast(response) {
    let forecastElement = document.querySelector("#forecast");

    
    let forecastHtml = "";

    response.data.daily.forEach(function(day, index) {
        if (index < 6) {
        forecastHtml = forecastHtml + 
        `<div class="weather-forecast-day">
                <div class="weather-forecast-date">${formatDay(day.time)}</div>
                <div>
                <img src="${day.condition.icon_url}" class="weather-forecast-icon" />
                </div>
                <div class="weather-forecast-temperatures">
                    <div class="weather-forecast-temperature">
                        <strong>${Math.round(day.temperature.maximum)}°</strong>
                    </div>
                    <div class="weather-forecast-temperature">${Math.round(day.temperature.minimum)}°</div>
                </div>
        </div>`;
        }
    });

    forecastElement.innerHTML = forecastHtml;

}

let searchFormElement = document.querySelector("#search-form");
searchFormElement.addEventListener("submit", handleSearchSubmit);

function updateCity() {
    let cityTimeZone = moment.tz.guess();

    let cityName = cityTimeZone.replace("_", " ").split("/")[1];

    searchCity(cityName);
}

updateCity();