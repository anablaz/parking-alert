class KParking {
    #naslov;
    #mesto;
    #latituda;
    #longituda;
    #casovniZig;
  
    constructor(naslov, mesto) {
      this.#naslov = naslov;
      this.#mesto = mesto;
      this.#latituda = null;
      this.#longituda = null;
      this.#casovniZig = null;
    }
  
    // Method for manually entering location
    vnesiLokacijaRocno(latituda, longituda) {
      this.#latituda = latituda;
      this.#longituda = longituda;
      this.#casovniZig = new Date();
      console.log(`Ročna lokacija vnesena: (${latituda}, ${longituda}) ob ${this.#casovniZig}`);
    }
  
    // Method for GPS location input (stub - would use actual GPS API in practice)
    vnesiLokacijaGPS() {
      // Simulated GPS coordinates
      this.#latituda = 46.0569;
      this.#longituda = 14.5058;
      this.#casovniZig = new Date();
      console.log(`GPS lokacija vnesena: (${this.#latituda}, ${this.#longituda}) ob ${this.#casovniZig}`);
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
  