let weather = {
    apiKey: "8df73f90eb77d181253f6a1149915ece",
    fetchWeather: function (city) {
      fetch(
        "http://api.openweathermap.org/geo/1.0/direct?q="+ city +"&appid="+
          this.apiKey
      )
        .then((response) => {
          if (!response.ok) {
            alert("Invalid city.");
            throw new Error("Invalid city.");
          }
          return response.json();
        })
        .then((dataset) => this.fetchcity(dataset));
    },

    fetchcity: function (dataset) {
        fetch(
            
            "https://api.openweathermap.org/data/2.5/weather?lat="+dataset[0].lat+"&lon="+dataset[0].lon+"&units=imperial&appid="+
            this.apiKey
        )
          .then((response) => {
            if (!response.ok) {
              alert("No weather found.");
              throw new Error("No weather found.");
            }
            return response.json();
          })
          .then((data) => this.displayWeather(data));
      },
    displayWeather: function (data) {
      const { name } = data;
      const { icon, description } = data.weather[0];
      const { temp, humidity } = data.main;
      const { speed } = data.wind;
      document.querySelector(".city").innerText = "Weather in " + name;
      document.querySelector(".icon").src =
        "https://openweathermap.org/img/wn/" + icon + ".png";
      document.querySelector(".description").innerText = description;
      document.querySelector(".temp").innerText = temp + "°F";
      document.querySelector(".humidity").innerText =
        "Humidity: " + humidity + "%";
      document.querySelector(".wind").innerText =
        "Wind speed: " + speed + " mph";
      document.querySelector(".weather").classList.remove("loading");
      document.body.style.backgroundImage =
        "url('https://source.unsplash.com/1600x900/?" + name + "')";
    },
    search: function () {
      this.fetchWeather(document.querySelector(".search-bar").value);
    },
  };

  let geocode = {
    reverseGeocode: function (latitude, longitude) {
      var api_key = '4d0021719b06403fb411915f692c528a';
  

  var api_url = 'https://api.opencagedata.com/geocode/v1/json'

  var request_url = api_url
    + '?'
    + 'key=' + api_key
    + '&q=' + encodeURIComponent(latitude + ',' + longitude)
    + '&pretty=1'
    + '&no_annotations=1';

  // see full list of required and optional parameters:
  // https://opencagedata.com/api#forward

  var request = new XMLHttpRequest();
  request.open('GET', request_url, true);

  request.onload = function() {
    // see full list of possible response codes:
    // https://opencagedata.com/api#codes

    if (request.status === 200){
      // Success!
      var data = JSON.parse(request.responseText);
      //console.log(data.results[0]); // print the location
      weather.fetchWeather(data.results[0].components.city)

    } else if (request.status <= 500){
      // We reached our target server, but it returned an error

      console.log("unable to geocode! Response code: " + request.status);
      var data = JSON.parse(request.responseText);
      console.log('error msg: ' + data.status.message);
    } else {
      console.log("server error");
    }
  };

  request.onerror = function() {
    // There was a connection error of some sort
    console.log("unable to connect to server");
  };

  request.send();  // make the request
    },
    getLocation: function() {
      function success (data) {
        geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
      }
      if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(success, console.error);
      }
      else{
        weather.fetchWeather("Denver");
      }
     
    }
  }
  
  document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
  });
  
  document
    .querySelector(".search-bar")
    .addEventListener("keyup", function (event) {
      if (event.key == "Enter") {
        weather.search();
      }
    });
  
 geocode.getLocation();
