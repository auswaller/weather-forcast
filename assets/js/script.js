let locationInputEl = document.getElementById("location-input");
let locationButtonEl = document.getElementById("location-button");
let historyButtonsEl = document.getElementById("history-buttons");
let forecastEl = document.getElementById("forecast");

const apiKey = "8e59e3c1090d9dbee1abe33e67416e56";
let zipCode;
let strArr = [];
let searchHistory = {
    name:[],
    lat:[],
    lon:[]
};

init();

locationButtonEl.addEventListener("click", function(event){
    event.preventDefault();
    let loc = locationInputEl.value;

    if(/^\d+$/.test(loc)){
        zipCode = locationInputEl.value;
        console.log("Entered: " + zipCode);
        getLocationWithZip(zipCode)
    }
    else{
        strArr = loc.split(",");
        console.log("Entered: " + strArr[0] + " , " + strArr[1]);
        getLocationWithCS(strArr[0], strArr[1])
    }

    strArr.length = 0;
    zipCode = "";
});

historyButtonsEl.addEventListener("click", function(event){
    event.preventDefault();
    if(event.target.tagName !== "BUTTON"){
        return;
    }
    let buttonInfo = {
        lat: event.target.getAttribute("data-lat"),
        lon: event.target.getAttribute("data-lon")
    }
    console.log(buttonInfo);
    getCurrent(buttonInfo);
    getForecast(buttonInfo);
});

function getLocationWithCS(city, state){
    fetch("https://api.openweathermap.org/geo/1.0/direct?q=" + city + "," + state + ",us&appid=" + apiKey)
    .then(function (response){
        console.log("----- Getting Location -----");
        console.log(response);
        if(response.status === 200){
            return response.json();
        }
        throw new Error("Something went wrong");
    }).then(function (data){
        console.log(data);
        setHistory(data[0]);
        getCurrent(data[0]);
        getForecast(data[0]);
    }).catch(function (error){
        console.log(error);
    });
}

function getLocationWithZip(zip){
    fetch("https://api.openweathermap.org/geo/1.0/zip?zip=" + zip + "&appid=" + apiKey)
    .then(function (response){
        console.log("----- Getting Location -----");
        console.log(response);
        if(response.status === 200){
            return response.json();
        }
        throw new Error("Something went wrong");
     }).then(function (data){
        console.log(data);
        setHistory(data);
        getCurrent(data);
        getForecast(data);
     }).catch(function (error){
        console.log(error);
    });
}

function getForecast(forLoc){
    console.log(forLoc);
    fetch("https://api.openweathermap.org/data/2.5/forecast?lat=" + forLoc.lat + "&lon=" + forLoc.lon + "&appid=" + apiKey + "&units=imperial")
    .then(function (response){
        console.log("----- Getting Forecast -----");
        console.log(response);
        return response.json();
    }).then(function (data){
        console.log(data);
        buildForecastDisplay(data);
    });
}

function getCurrent(forLoc){
    console.log(forLoc);
    fetch("https://api.openweathermap.org/data/2.5/weather?lat=" + forLoc.lat + "&lon=" + forLoc.lon + "&appid=" + apiKey + "&units=imperial")
    .then(function (response){
        console.log("----- Getting Current -----");
        console.log(response);
        return response.json();
    }).then(function (data){
        console.log(data);
        buildCurrentDisplay(data);
    });
}

function buildForecastDisplay(forecast){
    let n = 1;
    for(let i = 0; i < forecast.list.length; i++){
        console.log(forecast.list[i].dt_txt);
        if(forecast.list[i].dt_txt.search("12:00:00") !== -1){
            let fiveForecastEl = document.getElementById("forcast-card-" + n);
            let newDateEl = document.createElement("h4");
            let newForecastEl = document.createElement("p");
            let newImage = document.createElement("img");

            let iconURL = "https://openweathermap.org/img/wn/" + forecast.list[i].weather[0].icon +"@2x.png";

            fiveForecastEl.innerHTML = "";

            newImage.src = iconURL;
            newImage.setAttribute("height", "30px");
            newDateEl.innerHTML = "(" + dayjs.unix(forecast.list[i].dt).format("MM-DD-YYYY") + ") ";
            newForecastEl.innerHTML = "<br/>Temp: " + forecast.list[i].main.temp + "℉" + "<br/><br/>Wind: " + forecast.list[i].wind.speed + " MPH" + "<br/><br/>Humidity: " + forecast.list[i].main.humidity + " %";

            newDateEl.appendChild(newImage);
            fiveForecastEl.appendChild(newDateEl);
            fiveForecastEl.appendChild(newForecastEl);
            n++;
        }
    }
}

function buildCurrentDisplay(current){
    forecastEl.innerHTML = "";
    let newLocationEl = document.createElement("h4");
    let newCurrentEl = document.createElement("p");
    let newImage = document.createElement("img");

    let iconURL = "https://openweathermap.org/img/wn/" + current.weather[0].icon +"@2x.png";

    newImage.src = iconURL;
    newImage.setAttribute("height", "30px");
    newLocationEl.innerHTML = current.name + " (" + dayjs().format("MM-DD-YYYY") + ") ";
    newCurrentEl.innerHTML = "<br/>Temp: " + current.main.temp + "℉" + "<br/><br/>Wind: " + current.wind.speed + " MPH" + "<br/><br/>Humidity: " + current.main.humidity + " %";

    newLocationEl.appendChild(newImage);
    forecastEl.appendChild(newLocationEl);
    forecastEl.appendChild(newCurrentEl);
}

function init(){
    loadFromLocalStorage();
    buildSearch();
}

function buildSearch(){
    historyButtonsEl.innerHTML = "";

    for(let i = 0; i < searchHistory.name.length; i++){
        let newHistoryButtonList = document.createElement("li");
        let newHistoryButton = document.createElement("button");

        newHistoryButtonList.setAttribute("class", "list-group-item");

        newHistoryButton.textContent = searchHistory.name[i];
        newHistoryButton.setAttribute("class", "btn btn-outline-success history-btn d-grid gap-2 col-12 mx-auto");
        newHistoryButton.setAttribute("data-lat", searchHistory.lat[i]);
        newHistoryButton.setAttribute("data-lon", searchHistory.lon[i]);
        newHistoryButton.setAttribute("type", "button");

        newHistoryButtonList.appendChild(newHistoryButton)
        historyButtonsEl.appendChild(newHistoryButtonList);
    }
}

function saveToLocalStorage(){
    localStorage.setItem("search", JSON.stringify(searchHistory));
}

function loadFromLocalStorage(){
    let storedSearch = JSON.parse(localStorage.getItem("search"));

    if(storedSearch !== null){
        searchHistory = storedSearch;
    }
}

function setHistory(loc){
    searchHistory.name.unshift(loc.name); 
    searchHistory.lat.unshift(loc.lat);
    searchHistory.lon.unshift(loc.lon);

    if(searchHistory.name.length > 10){
        searchHistory.name.length = 10;
        searchHistory.lat.length = 10;
        searchHistory.lon.length = 10;
    }

    saveToLocalStorage(searchHistory);
    buildSearch();
}