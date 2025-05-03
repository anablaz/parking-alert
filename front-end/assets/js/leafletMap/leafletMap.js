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

// Create a custom green icon for the user's current location
var greenIcon = new L.Icon({
  iconUrl: "../front-end/assets/img/pin.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [40, 43],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Check if the Geolocation API is available
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // Add the green marker for the user's current location
      L.marker([lat, lon], { icon: greenIcon })
        .addTo(map)
        .bindPopup("Vaša trenutna lokacija")
        .openPopup();

      // Optionally, you can recenter the map on the user's location:
      // map.setView([lat, lon], 13);
    },
    function (error) {
      console.error("Error fetching current location:", error.message);
    }
  );
} else {
  console.warn("Geolocation is not supported by this browser.");
}