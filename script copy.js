$(document).ready(function () {
  // Event listener for the search form
  $('#search-form').submit(function (event) {
    // Prevent the default form submission
    event.preventDefault();

    // Get the city from the search input
    const searchedCity = $('#search-input').val().trim();

    // Check if the city is not empty
    if (searchedCity !== '') {
      // Fetch weather data for the city
      getWeatherData(searchedCity);

      // Add the city to the search history
      const historyItemHtml = `<button class="list-group-item" data-city="${searchedCity}">${searchedCity}</button>`;
      $('#history').append(historyItemHtml);

      // Clear the search input
      $('#search-input').val('');
    }
  });

  // Event listener for the search history items
  $('#history').on('click', 'button', function () {
    // Get the city from the clicked history item
    const historyCity = $(this).data('city');

    // Fetch weather data for the city
    getWeatherData(historyCity);
  });

  // Function to fetch weather data for a given city
  function getWeatherData(city) {
    // Replace 'YOUR_API_KEY' with your OpenWeatherMap API key
    const apiKey = '0e17fb46da61112a947dc2887ef7ad6b';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    // Make an AJAX request to get weather data
    $.ajax({
      url: apiUrl,
      method: 'GET',
    }).then(function (response) {
      // Handle the response data and update the HTML
      updateWeatherInfo(response);
    });
  }

  // Function to update the weather information on the page
  function updateWeatherInfo(weatherData) {
    // Extract relevant information from the response data
    const cityName = weatherData.city.name;
    const currentDate = dayjs().format('MMMM D, YYYY');
    const iconCode = weatherData.list[0].weather[0].icon;
    const temperature = weatherData.list[0].main.temp;
    const humidity = weatherData.list[0].main.humidity;
    const windSpeed = weatherData.list[0].wind.speed;

    // Update the current weather section
    const currentWeatherHtml = `
      <h2>${cityName} - ${currentDate}</h2>
      <img src="https://openweathermap.org/img/w/${iconCode}.png" alt="Weather Icon">
      <p>Temperature: ${temperature}°C</p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${windSpeed} m/s</p>
    `;
    $('#today').html(currentWeatherHtml);

    // Update the forecast section
    const forecastHtml = weatherData.list.slice(1, 6).map(item => `
      <div class="col-md-2">
        <h5>${dayjs(item.dt_txt).format('MMMM D')}</h5>
        <img src="https://openweathermap.org/img/w/${item.weather[0].icon}.png" alt="Weather Icon">
        <p>Temperature: ${item.main.temp}°C</p>
        <p>Humidity: ${item.main.humidity}%</p>
      </div>
    `).join('');

    $('#forecast').html(forecastHtml);
  }
});

