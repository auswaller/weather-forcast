let formEl = document.getElementById("location-form");
let locationInputEl = document.getElementById("location-input");
let locationButtonEl = document.getElementById("location-button");

const apiKey = "8e59e3c1090d9dbee1abe33e67416e56";
let zipCode = "";
let city = "";
let state = "";
var retrievedLocation = {};

locationButtonEl.addEventListener("click", function(event){
    event.preventDefault();
    let loc = locationInputEl.value;

    if(/^\d+$/.test(loc)){
        zipCode = locationInputEl.value;
        console.log("Entered: " + zipCode);
    }
    else{
        let strArr = loc.split(",");
        city = strArr[0].trim();
        state = strArr[1].trim();
        console.log("Entered: " + city + " , " + state);
    }

    if(zipCode){
        getLocationWithZip();
    }
    else if(city && state){
        getLocationWithCS();
    }
    else{
        console.log("Invalid location entered");
    }
});

function getLocationWithCS(){
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