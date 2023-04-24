let formEl = document.getElementById("location-form");
let locationInputEl = document.getElementById("location-input");
let locationButtonEl = document.getElementById("location-button");
let historyButtonsEl = document.getElementById("history-buttons");

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
    }
    else{
        strArr = loc.split(",");
        console.log("Entered: " + strArr[0] + " , " + strArr[1]);
    }

    if(zipCode){
        getLocationWithZip(zipCode);
    }
    else if(strArr[0] && strArr[1]){
        getLocationWithCS(strArr[0], strArr[1]);
    }
    else{
        console.log("Invalid location entered");
    }

    strArr.length = 0;
    zipCode = "";
});

historyButtonsEl.addEventListener("click", function(event){
    event.preventDefault();

    let buttonInfo = {
        lat: event.target.getAttribute("data-lat"),
        lon: event.target.getAttribute("data-lon")
    }
    console.log(buttonInfo);
    getForecast(buttonInfo);
});

function getLocationWithCS(city, state){
    fetch("http://api.openweathermap.org/geo/1.0/direct?q=" + city + "," + state + ",us&appid=" + apiKey)
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
        getForecast(data[0]);
    }).catch(function (error){
        console.log(error);
    });
}

function getLocationWithZip(){
    fetch("http://api.openweathermap.org/geo/1.0/zip?zip=" + zipCode + "&appid=" + apiKey)
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
        getForecast(data);
     }).catch(function (error){
        console.log(error);
    });
}

function getForecast(forLoc){
    console.log(forLoc);
    fetch("http://api.openweathermap.org/data/2.5/forecast?lat=" + forLoc.lat + "&lon=" + forLoc.lon + "&appid=" + apiKey)
    .then(function (response){
        console.log("----- Getting Forecast -----");
        console.log(response);
        return response.json();
    }).then(function (data){
        console.log(data);
        buildForecastDisplay(data);
    });
}

function buildForecastDisplay(forecast){

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

        newHistoryButton.textContent = searchHistory.name[i];
        newHistoryButton.setAttribute("class", "btn btn-outline-success history-btn");
        newHistoryButton.setAttribute("data-lat", searchHistory.lat[i]);
        newHistoryButton.setAttribute("data-lon", searchHistory.lon[i]);

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