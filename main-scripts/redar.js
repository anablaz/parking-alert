// Entity class: Redar
class Redar {
    #redarID;               // private int
    #trenutnaLokacija;      // private string
  
    constructor(redarID) {
      this.#redarID = redarID;
      this.#trenutnaLokacija = ""; // default to empty location
    }
  
    // Method to enter a new location (initial input)
    vnesiLokacijo(latitude, longitude) {
      this.#trenutnaLokacija = `Lat: ${latitude}, Lon: ${longitude}`;
      console.log(`Lokacija vnesena: ${this.#trenutnaLokacija}`);
    }
  
    // Method to update the existing location
    posodobiLokacijo(latitude, longitude) {
      this.#trenutnaLokacija = `Lat: ${latitude}, Lon: ${longitude}`;
      console.log(`Lokacija posodobljena: ${this.#trenutnaLokacija}`);
    }
  
    // Optional getter to access redarID or location outside class
    getRedarID() {
      return this.#redarID;
    }
  
    getTrenutnaLokacija() {
      return this.#trenutnaLokacija;
    }
  }
  