import { parkirnaMesta } from "../dummyData/parkingdata.js";
// Inicializiraj zemljevid in nastavite pogled na koordinate Ljubljane
var map = L.map("leafletMap").setView([46.056946, 14.505751], 13);

// Mehko obarvan sloj ploščic, ki je podoben Googlovim Zemljevidom
L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  }
).addTo(map);

parkirnaMesta.forEach(function (parkirisce) {
  L.marker([parkirisce.latitude, parkirisce.longitude])
    .addTo(map)
    .bindPopup(parkirisce.ime);
});
console.log(parkirnaMesta); // Dostop do parkirnaMesta po nalaganju datoteke