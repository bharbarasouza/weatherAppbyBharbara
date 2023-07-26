// Date and Time Function
document.addEventListener("DOMContentLoaded", function() {
     
 
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  darkModeToggle.addEventListener("change", toggleDarkMode);
  
  let dateElement = document.querySelector("#date_Time");

  function updateTime() {
    let now = new Date();
    let dayIndex = now.getDay();

    let abbreviatedDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let day = days[dayIndex];
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let month = months[now.getMonth()];
    let date = now.getDate();
    let hours = now.getHours();
    let minutes = now.getMinutes().toString().padStart(2, "0");
    let year = now.getFullYear();
    dateElement.innerHTML = `${day}, ${month} ${date}, ${hours}:${minutes}, ${year}`;

    let wkdayElements = document.querySelectorAll(".wkday span[id^='wkday']");
    for (let i = 0; i < wkdayElements.length; i++) {
      let nextDayIndex = (dayIndex + i + 1) % 7;
      let nextDay = abbreviatedDays[nextDayIndex];
      wkdayElements[i].innerHTML = nextDay;
    }
  }

  // Initial time update
  updateTime();

  // Update time every minute (60000 milliseconds)
  setInterval(updateTime, 60000);

//Function to Display Forecast

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily.slice(1, 7);
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = "";

  forecast.forEach(function (forecastDay, index) {
    let weatherIconCodeFor = forecastDay.weather[0].icon;
    let weatherIconUrl = weatherIconUrls[weatherIconCodeFor];  
    forecastHTML +=
      `<div class="weekday">
        <span><b>${formatDay(forecastDay.dt)}</b></span>
        <span class="dailytemptext" id="dailytemp${index}">${Math.round(
        forecastDay.temp.max
      )}°C</span>
      
        <span class="weathericon">
          <img id="weathericonFOR${index}" src="${weatherIconUrl}"/>
        </span>
        <span class="forecastDescription">${forecastDay.weather[0].main}</span>
      </div>`;
      originalTemperatures.push(forecastDay.temp.max);
  });
 

  forecastElement.innerHTML = forecastHTML;
}


// Search bar function

function search(city) {
    let apiKey = "aca4dd3643b89e94dbd3cac6cf6f2638";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayCurrentWeather);
}

function getForecast(coordinates) {
  let apiKey = "aca4dd3643b89e94dbd3cac6cf6f2638";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayCurrentWeather(response) {
let celsiusTemp = Math.round(response.data.main.temp);
let fahrenheitTemp = celsiusToFahrenheit(celsiusTemp);
let iconElement = document.querySelector("#mainweathericon");
let humidityElement = document.querySelector("#humidity");
let windElement = document.querySelector("#wind");
let pressureElement = document.querySelector('#pressure');

document.querySelector("#city_name").innerHTML = response.data.name;
document.querySelector("#temp_celsius").innerHTML = celsiusTemp + "°C";
document.querySelector("#temp_fahrenheit").innerHTML = fahrenheitTemp + "°F";
document.querySelector("#weather_description").innerHTML = response.data.weather[0].main;


humidityElement.innerHTML = response.data.main.humidity;
windElement.innerHTML = response.data.wind.speed;
pressureElement.innerHTML = response.data.main.pressure;


let weatherIconCode = response.data.weather[0].icon;
let weatherIconUrl = weatherIconUrls[weatherIconCode];
iconElement.setAttribute("src", weatherIconUrl);
console.log(response.data);

getForecast(response.data.coord);

}

  function searchCity(event) {
    event.preventDefault();
    let city = document.querySelector("#search-text-input").value;
    var toggleSwitch = document.getElementById("toggle-switch");
  toggleSwitch.checked = false;
    search(city);
    document.querySelector("#search-text-input").value = "";
  }   

  document.querySelector("#search-form").addEventListener("submit", searchCity);
  
//Function Current Location link

function handleSubmit(event) {
event.preventDefault();
let city = document.querySelector("#city-input").value;
searchCity(city);
}

function searchLocation(position) {
let apiKey = "aca4dd3643b89e94dbd3cac6cf6f2638";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=${apiKey}&units=metric`;
axios.get(apiUrl).then(displayCurrentWeather);
}

  function getCurrent(event) {
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(searchLocation);
  }


  let currentLocationLink = document.querySelector("#currentLocation");
  currentLocationLink.addEventListener("click", getCurrent);


  // Function to convert Celsius to Fahrenheit in weekly forecast
function celsiusToFahrenheit(celsius) {
  return Math.ceil((celsius * 9/5) + 32);
}

var originalTemperatures = [];

function updateTemperatures() {
  var isFahrenheit = document.getElementById("toggle-switch").checked;
  var dailyTemps = document.getElementsByClassName("dailytemptext");

  for (var i = 0; i < dailyTemps.length; i++) {
    var dailyTemp = dailyTemps[i];
    var celsiusTemp = parseFloat(originalTemperatures[i]);

    if (isFahrenheit) {
      var fahrenheitTemp = celsiusToFahrenheit(celsiusTemp);
      dailyTemp.textContent = fahrenheitTemp + "°F";
    } else {
      dailyTemp.textContent = Math.round(celsiusTemp) + "°C"; 
    }
  }
}

document.getElementById("toggle-switch").addEventListener("change", updateTemperatures);

var dailyTemps = document.getElementsByClassName("dailytemptext");
for (var i = 0; i < dailyTemps.length; i++) {
  originalTemperatures.push(parseFloat(dailyTemps[i].textContent));
}

var toggleSwitch = document.getElementById("toggle-switch");
toggleSwitch.checked = false; 


search("Sao Paulo");
displayForecast();
updateTemperatures(); 
});
