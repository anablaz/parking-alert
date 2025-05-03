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

// ustvarjanje želene ikone po meri za uporabnikovo trenutno lokacijo
var greenIcon = new L.Icon({
  iconUrl: "../front-end/assets/img/pin.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [40, 43],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Preveri, ali je na voljo vmesnik API za določanje zemljepisne lokacije
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    function (position) {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      // Dodajanje označevalnika po meri za uporabnikovo trenutno lokacijo
      L.marker([lat, lon], { icon: greenIcon })
        .addTo(map)
        .bindPopup("Vaša trenutna lokacija")
        .openPopup();

      // Po želji lahko zemljevid ponovno postavimo na uporabnikovo lokacijo:
      // map.setView([lat, lon], 13);
    },
    function (error) {
      showToast(
        "Napaka pri pridobivanju geografske lokacije.",
        "error"
      );
      console.error("Napaka pri pridobivanju trenutne lokacije:", error.message);
    }
  );
} else {
  showToast("Geolokacija ni podprta v tem brskalniku.", "warning");
  console.warn("Ta brskalnik ne podpira geolokacije.");
}