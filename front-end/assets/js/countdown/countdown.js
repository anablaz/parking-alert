var output, started, duration, desired;

// Konstante
duration = 5000;
desired = "50";

// Začetna nastavitev
output = $("#speed");
started = new Date().getTime();

// Animacija
animationTimer = setInterval(function () {
  // Če je vrednost takšna, kot jo želimo, prenehaj animirati
  // ali če je bilo trajanje preseženo, prenehajte animirati
  if (
    output.text().trim() === desired ||
    new Date().getTime() - started > duration
  ) {
    console.log("animating");
    // Generiranje naključnega niza, ki se uporabi za naslednji korak animacije
    output.text("" + Math.floor(Math.random() * 60));
  } else {
    console.log("animating");
    // Generiranje naključnega niza, ki se uporabi za naslednji korak animacije
    output.text("" + Math.floor(Math.random() * 120));
  }
}, 5000);

function slPlural(value, one, twoToFour, other) {
  if (value === 1) return one;
  if (value >= 2 && value <= 4) return twoToFour;
  return other;
}

$("#getting-started").countdown("2025/12/31", function (event) {
  var offset = event.offset;

  var output =
    "" +
    "<span>" +
    offset.minutes +
    "</span> " +
    "<span>" +
    slPlural(offset.minutes, "minuta", "minuti", "minut") +
    "</span> " +
    "<span>" +
    offset.seconds +
    "</span> " +
    "<span>" +
    slPlural(offset.seconds, "sekunda", "sekundi", "sekund") +
    "</span>";

  $(this).html(output);
});
