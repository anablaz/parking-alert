# Parking Alert d.d. - Aplikacija za študente

**Parking Alert d.d.** razvija aplikacijo, ki omogoča študentom spremljanje gibanja mestnih redarjev v bližini fakultet, da jih pravočasno opozori, če se redar približa njihovemu parkiranemu vozilu. Aplikacija temelji na GPS tehnologiji in simuliranih podatkih, da študentom omogoči obveščanje v realnem času.

## Funkcionalnosti

Aplikacija ponuja naslednje glavne funkcionalnosti:

- **Registracija uporabnika**: Uporabnik se lahko registrira v aplikacijo z osebnimi podatki, kot so ime, priimek, študentska številka, registrska številka vozila, in kontaktni podatki.
- **Prijava in odjava uporabnika**: Uporabnik se lahko prijavi in odjavi iz aplikacije kadarkoli.
- **Sprememba osebnih podatkov**: Uporabnik lahko posodobi svoje osebne podatke.
- **Vnos parkirne lokacije**: Uporabnik lahko vnese svojo parkirno lokacijo ročno ali z uporabo GPS naprave.
- **Spremljanje gibanja redarjev (simulirano)**: Aplikacija spremlja gibanje mestnih redarjev na simuliranih podatkih.
- **Opozorila o bližnjih redarjih**: Uporabnik prejme opozorilo, ko se redar približa manj kot 1 km od parkirane lokacije.
- **Potrditev opozorila**: Uporabnik lahko potrdi opozorilo in pregleda podrobnosti o preteklih opozorilih.
- **Pregled preteklih opozoril**: Uporabnik ima dostop do zgodovine preteklih opozoril.
- **Brisanje računa**: Uporabnik lahko izbriše svoj račun in vse povezane podatke.
- **Poročanje o opaženih redarjih**: Uporabnik lahko poroča o opaženih mestnih redarjih v bližini.

## Opis toka dogodkov

1. **Registracija in prijava**:
   - Uporabnik odpre aplikacijo in se prijavi.
   - Vnese svojo parkirno lokacijo (ročno ali z GPS).
   
2. **Spremljanje redarjev**:
   - Aplikacija spremlja gibanje mestnih redarjev na simuliranih podatkih.
   - Ko se redar približa manj kot 1 km od parkirane lokacije uporabnika, aplikacija pošlje opozorilo.
   - Uporabnik lahko potrdi opozorilo in pregleda podrobnosti.

3. **Alternativni tok dogodkov**:
   - Če GPS ni na voljo, uporabnik vnese svojo parkirno lokacijo ročno.
   - Če ni redarja v bližini, aplikacija ne pošlje opozorila.
   - Če je območje preobremenjeno s podatki, aplikacija opozori uporabnika na možno netočnost.

## Omejitve in prihodnje izboljšave

- **Prva faza** aplikacije bo na voljo samo za študente Fakultete za računalništvo in informatiko (FRI). Širitev na celotno Slovenijo bo zahtevala večjo količino podatkov in bolj kompleksno obdelavo lokacij.
- **Simulirani podatki**: Ker mestna redarstva ne omogočajo dostopa do svojih podatkov v realnem času, aplikacija temelji na simuliranih podatkih, ki se bodo uporabljali za demonstracijske namene.

## Zahteve

- Aplikacija je zasnovana za **HTML, CSS, JS** za **spletne in mobilne** brskalnike.
- Potrebna je **GPS naprava** za natančno določanje lokacije.

## Pomoč in podpora

Za pomoč pri uporabi aplikacije ali prijavo težav, nas lahko kontaktirate.

## Avtorji

- **Parking Alert d.d.**
  
  *Razvito kot del študijskega projekta za študente FRI, pri predmetu RIS*
