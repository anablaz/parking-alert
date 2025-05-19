class PredpostavljenaLokacijaRedarja {
  #lokacija;
  #longituda;
  #latituda;

  constructor(lokacija, longituda, latituda) {
    this.#lokacija = lokacija;
    this.#longituda = longituda;
    this.#latituda = latituda;
  }

  predpostaviLokacijo() {
    // Placeholder logic – you can define the real behavior here
    console.log(
      `Lokacija redarja je predpostavljena kot: ${this.#lokacija} (${
        this.#latituda
      }, ${this.#longituda})`
    );
  }

  // Optional: Getters and setters if you need access outside the class
  get lokacija() {
    return this.#lokacija;
  }

  set lokacija(value) {
    this.#lokacija = value;
  }

  get longituda() {
    return this.#longituda;
  }

  set longituda(value) {
    this.#longituda = value;
  }

  get latituda() {
    return this.#latituda;
  }

  set latituda(value) {
    this.#latituda = value;
  }
}
