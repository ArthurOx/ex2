//////////////
// we have a basic skeleton here to help you start.
// if you dont want to use it you dont have to -
// just clear the file and start from scratch
//////////////

// notice in our html we have a node with ID "app"
// hint: use this reference later to inject data into your page
const app = document.getElementById('app');

const jerusalemButton = document.querySelector("#jerusalemWeather");
const jerusalemTextDisplay = document.querySelector("#jerusalemWeatherText");
const jerusalemLat = 30;
const jerusalemLong = 30;
const weatherUrl = 'https://api.open-meteo.com';
const weatherForecast = `${weatherUrl}/v1/forecast`

async function getData(lat, long) {
  const jsonBody = JSON.stringify(
    {
      body: {
        latitude: lat,
        longtitude: long,
        current_weather: true
      }
    }
  )
  const data = await fetch(weatherForecast, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    body: jsonBody
  });
  response = await data.json();
  return response;
}

function clearUI() {
  while (app.firstChild) {
    app.removeChild(app.firstChild);
  }
}

async function renderUI(data) {

  clearUI();

  // you have your data! add logic here to render it to the UI
  // notice in the HTML file we call render();
  const dummyItemElement = Object.assign(document.createElement("div"), { className: "item" })
  const dummyContentElement = Object.assign(document.createElement("div"), { className: "content" })
  dummyContentElement.innerHTML = "hey";
  dummyItemElement.appendChild(dummyContentElement);
  app.appendChild(dummyItemElement);
}

jerusalemButton.addEventListener("click", async () => {
  const currentWeather = await getData(jerusalemLat, jerusalemLong);
  jerusalemTextDisplay.textContent = currentWeather;
});