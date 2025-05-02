// Boundary class: SVGPS
class SVGPS {
    // Private attribute
    #jeVklopljen;
  
    constructor() {
      this.#jeVklopljen = false; // default value
    }
  
    // Method to simulate acquiring location of a Student
    pridobiLokacijo() {
      // Logic to return a Student object
      // Placeholder return
      return {
        ime: "Test Student",
        lokacija: { x: 100, y: 200 }
      };
    }
  
    // Method to simulate removing a Redar (inspector)
    izslediRedar() {
      // Logic to return a Redar object
      // Placeholder return
      return {
        ime: "Redar Novak",
        lokacija: { x: 150, y: 250 }
      };
    }
  
    // Method to get presumed location of the Redar
    kjeBiLahkoBilRedar() {
      // Logic to return a PredpostavljenaLokacijaRedarja object
      // Placeholder return
      return {
        lokacija: { x: 170, y: 230 },
        natančnost: "80%"
      };
    }
  
    // Optional: methods to control GPS state
    vklopiGPS() {
      this.#jeVklopljen = true;
    }
  
    izklopiGPS() {
      this.#jeVklopljen = false;
    }
  
    isGPSVklopljen() {
      return this.#jeVklopljen;
    }
  }
  