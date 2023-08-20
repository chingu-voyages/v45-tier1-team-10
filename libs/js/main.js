/*======================WINDOW ONLOAD===================*/
let csvResult = null;

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
                    csvResult = result.data;
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

let map = L.map("map").setView([41.505, -0.09], 2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

let layerGroup = L.layerGroup().addTo(map);
let marker = null;

 /*====================SEARCH FUNCTIONS===================*/

/*MAIN SEARCH BAR*/
let mainSearchInput = null;
// mainSearchInput = document.querySelector(".main-search").value;
        // const searchInput = mainSearchInput.trim().toLowerCase(); 

function searchBar() {

}



/*NAME SEARCH INPUT*/
let nameChoice = null;
const nameInput = document.querySelector(".name-select");

nameInput.addEventListener("change", nameInputFunction);

function nameInputFunction() {
    nameChoice = Array.from(nameInput.value);
    [let1, let2, let3, let4, let5] = nameChoice;
    // return nameChoiceDS;
}


/*TAILOR SEARCH*/
function searchParams() {

    console.log(csvResult);
    csvResult.forEach(item => {
        const itemName = item.name.trim().toLowerCase(); 
        if (itemName.startsWith(let1) || itemName.startsWith(let2) || itemName.startsWith(let3) || itemName.startsWith(let4) || itemName.startsWith(let5)) {
            // console.log(itemName);  
            // includes method naturally returns more results, but need to decide with team mates whether to use that or startsWith() method
            
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

        }
    });
    
}


/*SEARCH BUTTON*/
const mainSearchButton = document.querySelector(".main-search-btn");
mainSearchButton.addEventListener("click", searchNow)

function searchNow() {
    layerGroup.clearLayers();

    //probably need to make the call to searchParams() from here
    searchParams();

    //then all this stuff
    // const markerIcon = L.icon({
    //     iconUrl: "assets/images/markerIcon.png",
    //     iconSize: [30, 30],
    //     iconAnchor: [50, 50],
    //     popupAnchor: [-35, -55]
    // })
    
    // marker = L.marker([item.reclat, item.reclong], {
    //     icon: markerIcon
    // }).addTo(layerGroup);

    // const markerPopup = L.popup().setContent(`
    //     <ul class="popup-list" style="list-style: none;">
    //         <li class="popup-list-item"><strong>Id:</strong> ${item.id}</li>
    //         <li class="popup-list-item"><strong>Name:</strong> ${item.name}</li>
    //         <li class="popup-list-item"><strong>Record Class:</strong> ${item.recclass}</li>
    //         <li><strong>Mass (g):</strong> ${item["mass (g)"]}</li>
    //         <li><strong>Year of Impact:</strong> ${item.year}</li>
    //         <li><strong>Latitude:</strong> ${item.reclat}</li>
    //         <li><strong>Longitude:</strong> ${item.reclong}</li>
    //     </ul>
        
        
        
    // `);
    // marker.bindPopup(markerPopup).addTo(map);

}




/*
1. store inputs from each input as variables
2. return those variables from each input function to be used as params for searchButton (remember, searchInput cancels out name input when active and vice versa)
3. searchButton functionality
*/