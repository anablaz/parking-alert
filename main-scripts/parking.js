class KParking {
  #naslov;
  #mesto;
  #latituda;
  #longituda;
  #casovniZig;

  redarInter = null;

  constructor(naslov, mesto) {
    this.#naslov = naslov;
    this.#mesto = mesto;
    this.#latituda = null;
    this.#longituda = null;
    this.#casovniZig = null;

    this.redarInter = setInterval(() => {
      let redarji = getCookie("Redarji");
      const value = `; ${document.cookie}`;
      const parts = value.split(`; Redarji=`);
      if (parts.length === 2) redarji = parts.pop().split(";").shift();
      else redarji = [];

      // 500 <= razdalja med redarjem in parkingom => alert
      redarji.forEach((redar) => {
        let oddaljenost = izracunajRazdaljoVMetrih(
          this.#latituda,
          this.#longituda,
          redar.latitude,
          redar.longitude
        );
        if (oddaljenost <= 500) {
          //TODO sproži alert.
          let opozorilo = new Opozorilo(
            Math.floor(Math.random() * 10000000) + 1,
            redar,
            oddaljenost,
            new Date(),
            this
          );
          opozorilo.posljiOpozorilo();
          //TODO neki, da se preveri, ali je opozorilo potrjeno
        }
      });
    }, 5000);
  }

  // Method for manually entering location
  vnesiLokacijaRocno(latituda, longituda) {
    this.#latituda = latituda;
    this.#longituda = longituda;
    this.#casovniZig = new Date();
    najdiNajblizjiParking();
    console.log(
      `Ročna lokacija vnesena: (${latituda}, ${longituda}) ob ${
        this.#casovniZig
      }`
    );
  }

  // Method for GPS location input (stub - would use actual GPS API in practice)
  vnesiLokacijaGPS() {
    // Simulated GPS coordinates
    // this.#latituda = 46.0569;
    // this.#longituda = 14.5058;
    let selected = Math.random(parkirnaMesta.length);
    this.#latituda = parkirnaMesta[selected].latitude;
    this.#longituda = parkirnaMesta[selected].longitude;
    this.#naslov = parkirnaMesta[selected].ime;
    this.#mesto = parkirnaMesta[selected].mesto;
    this.#casovniZig = new Date();
    console.log(
      `GPS lokacija vnesena: (${this.#latituda}, ${this.#longituda}) ob ${
        this.#casovniZig
      }`
    );
  }

  // pinpoint the nearest parking space to inserted coords
  najdiNajblizjiParking() {
    let selPark = null;
    parkirnaMesta.forEach((elem) => {
      if (selPark == null) {
        selPark = elem;
      } else {
        if (
          izracunajRazdaljoVMetrih(
            this.#latituda,
            this.#longituda,
            selPark.latitude,
            selPark.longitude
          ) >
          izracunajRazdaljoVMetrih(
            this.#latituda,
            this.#longituda,
            elem.latitude,
            elem.longitude
          )
        ) {
          selPark = elem;
        }
      }
    });
    this.#latituda = selPark.latitude;
    this.#longituda = selPark.longitude;
    this.#mesto = selPark.mesto;
    this.#naslov = selPark.ime;
  }

  izracunajRazdaljoVMetrih(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const toRad = (angle) => (angle * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  //Nujno klicati preden se izbriše katerakoli inštanca parking razreda!!!
  pobrisiParkingInstanco() {
    clearInterval(this.redarInter);
  }

  // Optional getters
  get naslov() {
    return this.#naslov;
  }

  get mesto() {
    return this.#mesto;
  }

  get latituda() {
    return this.#latituda;
  }

  get longituda() {
    return this.#longituda;
  }

  get casovniZig() {
    return this.#casovniZig;
  }
}
