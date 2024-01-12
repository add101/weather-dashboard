$(document).ready(function () {
  // Event listener for the search form
  $('#search-form').submit(function (event) {
    event.preventDefault();
    const city = $('#search-input').val().trim();

    if (city !== '') {
      getWeather(city);

      // Add the city to the search history
      const historyItem = `<button class="list-group-item" data-city="${city}">${city}</button>`;
      $('#history').append(historyItem);

      // Clear the search input
      $('#search-input').val('');
    }
  });

  // Event listener for the search history items
  $('#history').on('click', 'button', function () {
    const city = $(this).data('city');
    getWeather(city);
  });

  function getWeather(city) {
    const apiKey = '0e17fb46da61112a947dc2887ef7ad6b'; // Replace with your OpenWeatherMap API key
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

    $.ajax({
      url: apiUrl,
      method: 'GET',
    }).then(function (response) {
      // Handle the response data and update the HTML
      updateWeather(response);
    });
  }

  function updateWeather(data) {
    // Extract relevant information from the response data
    const cityName = data.city.name;
    const currentDate = dayjs().format('MMMM D, YYYY');
    const iconCode = data.list[0].weather[0].icon;
    const temperature = data.list[0].main.temp;
    const humidity = data.list[0].main.humidity;
    const windSpeed = data.list[0].wind.speed;

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
    const forecastHtml = data.list.slice(1, 6).map(item => `
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
