//////////////
// we have a basic skeleton here to help you start.
// if you dont want to use it you dont have to -
// just clear the file and start from scratch
//////////////

// notice in our html we have a node with ID "app"
// hint: use this reference later to inject data into your page
const app = document.getElementById('app');

const cityCoords = [
  {
    name: "Jerusalem",
    lat: 31.7683,
    long: 35.2137,
    continent: "Asia"
  },
  {
    name: "Berlin",
    lat: 52.52,
    long: 13.41,
    continent: "Europe"
  },
  {
    name: "New York",
    lat: 40.71,
    long: -74.01,
    continent: "America"
  },
  {
    name: "Nairobi",
    lat: -1.2762,
    long: 36.7965,
    continent: "Africa"
  },
  {
    name: "Nairobi",
    lat: -1.2762,
    long: 36.7965,
    continent: "Africa"
  },
  {
    name: "Nairobi",
    lat: -1.2762,
    long: 36.7965,
    continent: "Africa"
  },
  {
    name: "Nairobi",
    lat: -1.2762,
    long: 36.7965,
    continent: "Africa"
  },
  {
    name: "Nairobi",
    lat: -1.2762,
    long: 36.7965,
    continent: "Africa"
  }
]
const weatherUrl = 'https://api.open-meteo.com';
const weatherForecast = `${weatherUrl}/v1/forecast`

const europeCheckbox = document.querySelector("#Europe");
const americaCheckbox = document.querySelector("#America");
const africaCheckbox = document.querySelector("#Africa");
const asiaCheckbox = document.querySelector("#Asia");
const checkboxes = [europeCheckbox, americaCheckbox, africaCheckbox, asiaCheckbox];

const dropdown = document.querySelector("#sort-by-temp");

async function getData() {
  const cityCoordsWithWeather = [];
  for (const city of cityCoords) {
    await fetch(`${weatherForecast}?latitude=${city.lat}&longitude=${city.long}&current_weather=true`)
      .then(async (response) => {
        if (response.status == 200) {
          const data = await response.json();
          const cityWithWeather = Object.assign(city, { temperature: data.current_weather.temperature });
          cityCoordsWithWeather.push(cityWithWeather)
        } else {
          throw `Got response status ${response.status} for ${city}`;
        }
      })
      .catch((err) => {
        console.log(`api error: ${err}`)
      })
  }
  const adsf = cityCoordsWithWeather.sort((a, b) => {
    if (a.temperature >= b.temperature) return -1 else 1;
  });
  if (dropdown.value == "hot-to-cold") {
    return cityCoordsWithWeather.sort((a, b) => {
      a.temperature >= b.temperature;
    })
  } else {
    return cityCoordsWithWeather.sort((a, b) => {
      a.temperature < b.temperature;
    })
  }
}

function clearUI() {
  while (app.firstChild) {
    app.removeChild(app.firstChild);
  }
}

async function renderUI(data) {

  clearUI();
  for (const city of data) {
    if (city.hide) {
      continue;
    }
    const weatherTemplate = document.querySelector("#weather-card").content.firstElementChild.cloneNode(true);
    const cityHeader = weatherTemplate.querySelector("h3");
    const emoji = weatherTemplate.querySelector("p");
    const temperature = weatherTemplate.querySelector("h1");
    cityHeader.innerHTML = city.name;
    emoji.innerHTML = getEmoji(city.temperature);
    temperature.innerHTML = `${city.temperature}ºC`;
    app.appendChild(weatherTemplate);
  }
}

function getEmoji(temperature) {
  if (temperature > 20) {
    return "☀";
  } else if (temperature > 6) {
    return "☁";
  } else {
    return "❄";
  }
}

const data = await getData();
await renderUI(data);


function filterContinent(currentData, continent, hide) {
  currentData.forEach((cityData) => {
    if (cityData.continent == continent) {
      cityData.hide = hide;
    }
  });
  renderUI(currentData);
}

checkboxes.forEach((checkbox) => {
  checkbox.addEventListener('change', function () {
    filterContinent(data, checkbox.name, !checkbox.checked);
  });
});

function sortData(currentData, sortBy) {
  console.log(sortBy)
  if (sortBy == "hot-to-cold") {

  } else if (sortBy == "cold-to-hot") {

  }
  renderUI(currentData);
}

dropdown.addEventListener('change', () => sortData(data, dropdown.value));