function updateDate() {
    var date = new Date();
    var options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    var currentDate = date.toLocaleDateString("sl-SI", options); // Odvisno od lokacije
    $("#Date").text(currentDate);
  }

  // Klic funkcije za prikaz datuma
  updateDate();
  // Posodabljanje datuma vsako minuto
  setInterval(updateDate, 60000);