import { parkirnaMesta } from "../dummyData/parkingdata.js";

var map = L.map("leafletMap").setView([46.056946, 14.505751], 13);

// Base map layer
L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
  }
).addTo(map);

// Marker for current or selected location
let currentLocationMarker = null;

// Custom green icon for current location
const greenIcon = new L.Icon({
  iconUrl: "../front-end/assets/img/pin.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [40, 43],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Render all parking locations
parkirnaMesta.forEach((parkirisce) => {
  L.marker([parkirisce.latitude, parkirisce.longitude])
    .addTo(map)
    .bindPopup(parkirisce.ime);
});

// Try to get geolocation on page load
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      updateCurrentLocationMarker(lat, lon, "Vaša trenutna lokacija");
    },
    (error) => {
      showToast("Napaka pri pridobivanju geografske lokacije.", "error");
      console.error(
        "Napaka pri pridobivanju trenutne lokacije:",
        error.message
      );
    }
  );
} else {
  showToast("Geolokacija ni podprta v tem brskalniku.", "warning");
}

// Function to update the current location marker on the map
// Make function accessible globally
// In leaflet.js, make the function globally available
window.updateCurrentLocationMarker = function (lat, lon, label) {
  // If a marker already exists, remove it first
  if (window.currentLocationMarker) {
    map.removeLayer(window.currentLocationMarker);
  }

  // Create and add a new marker to the map
  window.currentLocationMarker = L.marker([lat, lon], { icon: greenIcon })
    .addTo(map)
    .bindPopup(label)
    .openPopup();

  // Optionally, you can also change the view (zoom and center) to the new location
  map.setView([lat, lon], 13);
};

// Modified confirmSelectedParking to also update the map
function confirmSelectedParking() {
  if (!selectedParkingLocation) {
    showToast("Prosimo, najprej izberite parkirišče.", "warning");
    return;
  }

  const { ime, latitude, longitude } = selectedParkingLocation;

  // Update localStorage
  const userData = JSON.parse(localStorage.getItem("loggedInUser"));
  if (userData) {
    userData.location = ime;
    localStorage.setItem("loggedInUser", JSON.stringify(userData));
  }

  // Update the DOM
  const locationSpan = document.getElementById("last-location");
  if (locationSpan) {
    locationSpan.innerHTML = ` <strong>${ime}</strong>`;
  }

  // Update current location marker
  updateCurrentLocationMarker(latitude, longitude, `Izbrana lokacija: ${ime}`);

  closeModal();
}
