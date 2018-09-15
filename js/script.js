//powered by the DarkSky API

var API_URL = 'http://api.wunderground.com/api/';
var API_KEY = 'f54c4a9fd59a460d/';
var API_PARAMS_1 = 'conditions/q/PA/Devon.json';
var API_PARAMS_2 = 'forecast10day/q/PA/Devon.json';

var daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

$(document).ready(function() {
  //time refreshes every second
  startTime();
  setInterval(function(){startTime()}, 1000);
  
  //weather refreshes every hour
  startWeather();
  setInterval(function(){startWeather()}, 1000*60*60);
});

function startTime() {
  var hourMinute = moment().format('h:mm');
  var second = moment().format('ss');
  var amPm = moment().format('A');
  
  $('#hour-minute').html(hourMinute);
  $('#second').html(second);
  $('#am-pm').html(amPm);
}

function startWeather() {
  setDaysOfWeek();

  $.ajax({
    url: API_URL + API_KEY + API_PARAMS_1,
    type: 'GET',
    dataType: 'json',
    success: function(result) {
      $('#weather-now-dynamic').html('<p id="weather-now-temperature">' + Math.round(result.current_observation.temp_f) + '</p>');
      //http://icons.wxug.com/i/c/k/nt_partlycloudy.gif
      var a = result.current_observation.icon_url.split('/');
      var imageName = a[a.length-1];
      imageName = imageName.substring(0,imageName.length-4)
      var imageSource = 'images/weather-icons/' + imageName + '.svg';
      $('#weather-now-dynamic').prepend('<img class="weather-icon" id="weather-now-icon" src=' + imageSource + ' />');
    }
  });

  $.ajax({
    url: API_URL + API_KEY + API_PARAMS_2,
    type: 'GET',
    dataType: 'json',
    success: function(result) {
      var fiveDayForecast = result.forecast.simpleforecast.forecastday;
      for (var k = 0; k < 5; k++) {
        $('#weather-day-info-' + k).html('<span>' + Math.round(fiveDayForecast[k].high.fahrenheit) + '</span><span class="weather-low-temperature">' + Math.round(fiveDayForecast[k].low.fahrenheit) + '</span>');
        var imageSource = 'images/weather-icons/' + fiveDayForecast[k].icon + '.svg';
        $('#weather-day-info-' + k).prepend('<img class="weather-icon" src=' + imageSource + ' />')
      }
    }
  });
}

function setDaysOfWeek() {
  var day = parseInt(moment().format('d'));
  for (var k = 0; k < 5; k++) {
    $('#weather-day-title-' + k).html(daysOfWeek[day]);
    day++;
    if (day >= daysOfWeek.length) day = 0;
  }
}