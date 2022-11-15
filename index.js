//////////////
// we have a basic skeleton here to help you start.
// if you dont want to use it you dont have to -
// just clear the file and start from scratch
//////////////

// notice in our html we have a node with ID "app"
// hint: use this reference later to inject data into your page
const app = document.getElementById('app');

const cityCoords = await fetch('./cities.json').then((response) => response.json())

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
    if (dropdown.value == "hot-to-cold") {
        return cityCoordsWithWeather.sort((a, b) => {
            return (a.temperature >= b.temperature) ? -1 : 1;
        })
    } else {
        return cityCoordsWithWeather.sort((a, b) => {
            return (a.temperature < b.temperature) ? -1 : 1;
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
    if (sortBy == "hot-to-cold") {
        const sortedData = currentData.sort((a, b) => {
            return (a.temperature >= b.temperature) ? -1 : 1;
        })
        renderUI(sortedData);

    } else {
        const sortedData = currentData.sort((a, b) => {
            return (a.temperature < b.temperature) ? -1 : 1;
        })
        renderUI(sortedData);
    }
}

dropdown.addEventListener('change', () => sortData(data, dropdown.value));