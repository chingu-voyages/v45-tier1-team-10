/*=======================INSTALL MAP===================== */

let map = L.map("map").setView([41.505, -0.09], 2);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);



 /*====================SEARCH FUNCTION===================*/
let csvResult = null;
let mainSearchInput = null;
let layerGroup = L.layerGroup().addTo(map);
let marker = null;
const mainSearchButton = document.querySelector(".main-search-btn");


mainSearchButton.addEventListener("click", () => {

    mainSearchInput = document.querySelector(".main-search").value;

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
                    searchBar();
                },
                error: (error) => {
                    console.error("Error parsing CSV:", error.message);
                },
            })

        }
    }

    mainSearch.send();

})

function searchBar() {
    layerGroup.clearLayers();

    console.log(csvResult);
    csvResult.forEach(item => {
        const itemName = item.name.trim().toLowerCase(); 
        const searchInput = mainSearchInput.trim().toLowerCase(); 
        if (itemName.includes(searchInput)) {
            console.log(item.name);  
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
