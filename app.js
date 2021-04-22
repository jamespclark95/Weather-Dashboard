// Global Variables
let apiKey = 'ec968bd957d73df5a8efd128dc7346e2'
let date = $('.date')
let icon = $('.icon')
let temperature = $('.temperature')
let humidity = $('.humidity')
let windSpeed = $('.wind-speed')
let uvIndex = $('.uv-index')
let searchButton = $('button')
let uvButton = $('<button>').addClass('btn btn-primary');
let cities = JSON.parse(localStorage.getItem('cities')) || [];


// Appends local storage items
for(let i=0; i < cities.length; i++) {
    let cityButton = $('<button>').addClass('btn m-3').text(cities[i]);
    $('.storage').append(cityButton);
}

// Search button takes data from search bar and runs the function
searchButton.on('click', function (){
    let inputValue = $('.form-control').val().trim();
    console.log(inputValue);
    searchWeather(inputValue);
    if (cities.indexOf(inputValue) === -1) {
        cities.push(inputValue);
    }
    
    console.log(cities);
    // stores past searches in local storage
    localStorage.setItem('cities', JSON.stringify(cities))
})


// searches for weather through Openweather API
function searchWeather(city) {
    let requestU = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=` + apiKey
    $('.today').empty()
    $.ajax({
        method: "GET",
        url: requestU,
        dataType: "json",
        success: function(res) {
            console.log(res)
           // create dynamic weather card for Today Only
           let card = $('<div>').addClass("card")
           let cardBody = $('<div>').addClass("card-body");
           let cardTitle = $('<h3>').addClass('card-title').text(res.name)
           let cardWeather = $('<p>').addClass('card-weather').text(res.weather[0].description)
           let cardWind = $('<p>').addClass('card-wind').text('Wind Speed: ' + res.wind.speed + '  MPH') 
           let cardHumidity = $('<p>').addClass('card-humidity').text('Humidity: ' + res.main.humidity + '%')
           var fahrenheit = (res.main.temp - 273.15) * 1.80 + 32;
           let cardTemp = $('<p>').addClass('card-temp').text(Math.floor(fahrenheit) + "F")
           getUvIndex(res.coord.lat, res.coord.lon)

           // create date
           let today = new Date()
           let date = (today.getMonth() + 1) + ' / ' + today.getDate() + ' / ' + today.getFullYear();
           let cardDate = $('<p>').text(date).addClass('.date')
           
           // appends elements created above for Today Only
           $(".today").append(card.append(cardBody.append(cardTitle, cardDate, cardWeather, cardWind, cardHumidity, cardTemp, uvButton)))
           getForecast(res.coord.lat, res.coord.lon)
           
        }
    })
  

}

function getForecast(lat, lon) {
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${apiKey}`;
    $('.forecast').empty()
   $.ajax({
        method: "GET",
        url: url,
        dataType: "json",
        success: function(res) {
            console.log(res)
          // Get weather forecast from Day 2 - Day 6  
          for(i=1; i < 6; i++){
              console.log(res.daily[i])

              // Create elements for Forecast Cards with a loop
              var dateCard = res.daily[i]
              let forecastCards = $('<div>').addClass('card');
              let forecastBody = $('<div>').addClass('card-body');
              var fahrenheit = (dateCard.temp.day - 273.15) * 1.80 + 32;
              let forecastTemp = $('<p>').addClass('card-temp').text(Math.floor(fahrenheit) + "F");
              let forecastWeather = $('<p>').addClass('card-temp').text(dateCard.weather[0].description);
              let forecastWind = $('<p>').addClass('card-temp').text('Wind Speed: ' + dateCard.wind_speed + '  MPH');
              let forecastHumidity = $('<p>').addClass('card-temp').text('Humidity: ' + dateCard.humidity + '  %');

              // Appends forecast elements
              $('.forecast').append(forecastCards.append(forecastBody.append(forecastWeather, forecastWind, forecastHumidity, forecastTemp)))
          }
           
        }
})
}

// Gets the UVI & Color Codes based on value
function getUvIndex(lat, lon) {
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely&appid=${apiKey}`;
    $.ajax({
        method: "GET",
        url: url,
        dataType: "json",
        success: function(res) {
            console.log(res);
            let uvi = res.current.uvi;
            uvButton.text('UV Index: ' + uvi)
            if (uvi < 3) {
                uvButton.attr('class', 'btn btn-success')
            }
            else if (uvi > 7) {
                uvButton.attr('class', 'btn btn-danger')
            }
            else {
                uvButton.attr('class', 'btn btn-warning')
            }

        }
    })

}
