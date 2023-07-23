// Date and Time Function
document.addEventListener("DOMContentLoaded", function() {
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


// Search bar function

function search(city) {
      let apiKey = "aca4dd3643b89e94dbd3cac6cf6f2638";
      let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
      axios.get(apiUrl).then(displayCurrentWeather);
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

}

    function searchCity(event) {
      event.preventDefault();
      let city = document.querySelector("#search-text-input").value;
      search(city);
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

      if (isFahrenheit) {
        var celsiusTemp = parseFloat(originalTemperatures[i]);
        var fahrenheitTemp = celsiusToFahrenheit(celsiusTemp);
        dailyTemp.textContent = fahrenheitTemp + "°F";
      } else {
        dailyTemp.textContent = originalTemperatures[i] + "°C";
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
  updateTemperatures(); 

  search("Sao Paulo");
  
  
  });

