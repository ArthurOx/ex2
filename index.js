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
    }
]
const weatherUrl = 'https://api.open-meteo.com';
const weatherForecast = `${weatherUrl}/v1/forecast`

async function getData() {
    const cityCoordsWithWeather = [];
    for (const city of cityCoords) {
        const data = await fetch(`${weatherForecast}?latitude=${city.lat}&longitude=${city.long}&current_weather=true`);
        const response = await data.json();
        const cityWithWeather = Object.assign(city, { temperature: response.current_weather.temperature });
        cityCoordsWithWeather.push(cityWithWeather)
    }
    return cityCoordsWithWeather;
}

function clearUI() {
    while (app.firstChild) {
        app.removeChild(app.firstChild);
    }
}

async function renderUI(data) {

    clearUI();
    for (const city of data) {
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
    if (temperature > 25) {
        return "☀";
    } else if (temperature > 6) {
        return "☁";
    } else {
        return "❄";
    }
}

const data = await getData();


await renderUI(data);
