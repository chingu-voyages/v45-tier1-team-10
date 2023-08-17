/*=======================INSTALL MAP===================== */

let map = L.map("map").setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

var marker = L.marker([51.5, -0.09]).addTo(map);
 var marker2 = L.marker([51.3, -0.07]).addTo(map);


 /*====================SEARCH FUNCTION===================*/
let csvResult = null;

const mainSearchButton = document.querySelector(".main-search-btn");

mainSearchButton.addEventListener("click", () => {

    const mainSearchInput = document.querySelector(".main-search").value;

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
                    doSomething();
                },
                error: (error) => {
                    console.error("Error parsing CSV:", error.message);
                },
            })


        }
    }

    mainSearch.send();


})

function doSomething() {
    console.log(csvResult);
}