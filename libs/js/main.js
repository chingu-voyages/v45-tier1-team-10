/*====================NIGHT-DAY-MODE=================*/
function daymode() {
    let setTheme = document.body;

    setTheme.classList.toggle("day-mode");
    
    const button = document.getElementById("mybtn");
    
    if (setTheme.classList.contains("day-mode")) {
        button.textContent = "NIGHT MODE";
    } else {
        button.textContent = "DAY MODE";
    }
    
}




/*======================WINDOW ONLOAD===================*/
let csvResult = null;
let finalItems = null;


window.onload = function() {
    const mainSearch = new XMLHttpRequest();

    mainSearch.open("GET", "https://raw.githubusercontent.com/chingu-voyages/voyage-project-tier1-fireball/main/assets/Meteorite_Landings.csv", true);

    mainSearch.onload = function() {
        if(this.status == 200) {
            const csvData = this.responseText;

            Papa.parse(csvData, {
                header: true,
                dynamicTyping: true,
                complete: (result) => {
                    csvResult = [];
                    result.data.forEach(item => {
                        if(typeof item.GeoLocation === "string" && typeof item.year === "number" && typeof item["mass (g)"] === "number") {
                            csvResult.push(item);
                            finalItems = csvResult;
                        }
                    })                    
                },
                error: (error) => {
                    console.error("Error parsing CSV:", error.message);
                },
            })

        }
    }

    mainSearch.send();
}


/*=======================INSTALL MAP===================== */

let map = L.map("map").setView([41.505, -0.09], 1);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

let layerGroup = L.layerGroup().addTo(map);
let marker = null;



 /*====================SEARCH FUNCTIONS===================*/

 const searchParameters = {
    openQuery: null,
    nameQuery: null,
    centuryQuery: null,
    massQuery: null
 }
 

/*MAIN SEARCH BAR*/
let mainSearchInput = null;
const mainSearch = document.querySelector(".main-search");

mainSearch.addEventListener("click", clearNameInput);
function clearNameInput() {
    if(nameInput.value.length > 0) {
        nameInput.value = "";
        finalItems = csvResult;
        searchParameters.nameQuery = null;
        console.log(searchParameters);
    }
}

mainSearch.addEventListener("change", searchBar);
function searchBar() {
    
    mainSearchInput = document.querySelector(".main-search").value.trim().toLowerCase();
    searchParameters.openQuery = mainSearchInput;
    textInputFunction();
    
}

function textInputFunction() {

    console.log(mainSearchInput);

    if(finalItems.length < 38115) {
        finalItems = finalItems.filter(item => {
            return item.name.includes(mainSearchInput);
        })
    } else {
        finalItems = [];
        csvResult.forEach(item => {
            const itemName = item.name.trim().toLowerCase(); 
            if(itemName.includes(mainSearchInput)) {
                finalItems.push(item);
            }
        })
    }

}


/*NAME SEARCH INPUT*/
let nameChoice = null;
const nameInput = document.querySelector(".name-select");

nameInput.addEventListener("change", nameInputFunction);

function nameInputFunction() {

    if(mainSearch.value.length > 0) {
        mainSearch.value = "";
        searchParameters.openQuery = null;
        finalItems = csvResult;
    }

    nameChoice = Array.from(nameInput.value);
    console.log(nameChoice);
    searchParameters.nameQuery = nameChoice;
    nameFilter();

}


function nameFilter() {

    if(finalItems.length < 38115) {
        finalItems = finalItems.filter(item => {
            const itemName = item.name.trim().toLowerCase(); 
            return itemName.startsWith(searchParameters.nameQuery[0]) || itemName.startsWith(searchParameters.nameQuery[1]) || itemName.startsWith(searchParameters.nameQuery[2]);
        })
    } else {

        finalItems = [];
    
        csvResult.forEach(item => {
            const itemName = item.name.trim().toLowerCase(); 
            if(itemName.startsWith(searchParameters.nameQuery[0]) || itemName.startsWith(searchParameters.nameQuery[1]) || itemName.startsWith(searchParameters.nameQuery[2])) {
                        finalItems.push(item);
                    }
            
        })
    }

    console.log(finalItems.length);
}


/*CENTURY SEARCH INPUT*/
const centurySelect = document.querySelector(".century-select");

centurySelect.addEventListener("change", centuryInputFunction);

function centuryInputFunction() {

    console.log(centurySelect.value);

    searchParameters.centuryQuery = centurySelect.value;

    centuryFilter();

} 


function centuryFilter() {

    const lowEnd = searchParameters.centuryQuery.slice(0, 4);
    const highEnd = searchParameters.centuryQuery.slice(-4);

    if(finalItems.length < 38115) {
        finalItems = finalItems.filter(item => {
            return item.year >= lowEnd && item.year <= highEnd;
        })
    } else {
        finalItems = [];   

        csvResult.filter(item => {
            if(item.year >= lowEnd && item.year <= highEnd) {
                finalItems.push(item);
            }
        })
    } 
    console.log(finalItems.length);
}

/*MASS SEARCH INPUT*/
const massSelect = document.querySelector(".mass-select");
massSelect.addEventListener("change", massInputFunction);

function massInputFunction() {

    searchParameters.massQuery = massSelect.value;

    massFilter();
    
}

function massFilter() {

    const lowMass = searchParameters.massQuery.slice(0, 8);
    const highMass = searchParameters.massQuery.slice(-8);

    if(finalItems.length < 38115) {
        finalItems = finalItems.filter(item => {
            return item["mass (g)"] >= lowMass && item["mass (g)"] <= highMass;
        })
    } else {
        finalItems = [];

        csvResult.filter(item => {
            if(item["mass (g)"] >= lowMass && item["mass (g)"] <= highMass) {
                finalItems.push(item);
            }
        })

    }
    console.log(finalItems.length);
}




/*SEARCH BUTTON*/
const searchForm = document.querySelector(".search-form");
const mainSearchButton = document.querySelector(".main-search-btn");
mainSearchButton.addEventListener("click", searchNow)

function searchNow() {

    layerGroup.clearLayers();
    searchForm.reset();

    console.log(finalItems);

    finalItems.forEach(item => {

        const markerIcon = L.icon({
            iconUrl: "assets/images/markerIcon.png",
            iconSize: [30, 30],
            iconAnchor: [50, 50],
            popupAnchor: [-35, -55]
        })
        
        marker = L.marker([item.reclat, item.reclong], {
            icon: markerIcon
        }).addTo(layerGroup);
    
        const markerPopup = L.popup().setContent(`
            <ul class="popup-list" style="list-style: none;">
                <li class="popup-list-item"><strong>Id:</strong> ${item.id}</li>
                <li class="popup-list-item"><strong>Name:</strong> ${item.name}</li>
                <li class="popup-list-item"><strong>Record Class:</strong> ${item.recclass}</li>
                <li><strong>Mass (g):</strong> ${item["mass (g)"]}</li>
                <li><strong>Year of Impact:</strong> ${item.year}</li>
                <li><strong>Latitude:</strong> ${item.reclat}</li>
                <li><strong>Longitude:</strong> ${item.reclong}</li>
            </ul>                       
        `);

        marker.bindPopup(markerPopup).addTo(map);

    })

    setTimeout(function() {
        finalItems = csvResult;
        Object.keys(searchParameters).forEach((i) => searchParameters[i] = null);
    console.log(searchParameters);
    }, 1000); 

}


/*=====================RESET BUTTON==================*/
const resetButton = document.querySelector(".reset-btn");
resetButton.addEventListener("click", resetFunction);

function resetFunction() {
    layerGroup.clearLayers();
    searchForm.reset();
}


/*=======================GITHUB BUTTON=================*/
const githubButton = document.querySelector(".github-btn");
githubButton.addEventListener("click", githubFunction);

function githubFunction() {
    window.open("https://github.com/chingu-voyages/v45-tier1-team-10", "_blank");
}



/*  
EXTRA IDEAS 
1. Limit results to 50/100, etc
*/



