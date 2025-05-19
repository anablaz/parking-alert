// Entity class: Opozorilo
class Opozorilo {
  constructor(opozoriloID, redar, oddaljenost, casovniZig, parkirisce) {
    this.opozoriloID = opozoriloID; // int
    this.redar = redar; // instance of Redar
    this.oddaljenost = oddaljenost; // double (number)
    this.casovniZig = casovniZig; // Date object
    this.parkirisce = parkirisce; // instance of Parking
  }

  // Method to send the warning
  posljiOpozorilo() {
    console.log(`Opozorilo ${this.opozoriloID} poslano.`);
    // Implement sending logic here
  }

  // Method to confirm the warning
  potrdiOpozorilo() {
    console.log(`Opozorilo ${this.opozoriloID} potrjeno.`);
    // Implement confirmation logic here
  }
}
