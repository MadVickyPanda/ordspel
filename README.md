# Wordle-spel

Ett Wordle-inspirerat fullstack-spel byggt med:

* React
* Express
* TypeScript
* SQLite
* Jest

Projektet innehåller:

* spel-sida
* highscores
* informationssida
* integrationstester

---

# Installation

Installera alla dependencies:

```bash
npm install
```

---

# Starta projektet

Starta servern:

```bash
npm start
```

Projektet körs på:

```txt
http://localhost:5080
```

---

# Köra tester

Kör alla tester:

```bash
npm test
```

Tester inkluderar:

* API-tester
* Integrationstester
* Fullständigt spelflöde

---

# Funktioner

## Spel

* Slumpmässiga ord
* Valbar ordlängd (3–8 bokstäver)
* Stöd för unika bokstäver
* Feedback med correct / misplaced / incorrect

## Highscores

* Sparas i SQLite-databas
* Server-side renderad lista
* Filtrering via URL-parametrar

## Säkerhet

* Backend ansvarar för:

  * spellogik
  * feedback
  * tidtagning
* Game sessions hanteras via `gameId`

---

# Tekniker

* React
* Express
* TypeScript
* SQLite3
* EJS
* Jest
* Supertest

---

# Projektstruktur

```txt
src/
 ├── data/
 ├── public/
 ├── routes/
 ├── services/
 ├── views/
 ├── database.ts
 ├── expressApp.ts
 └── server.ts

test/
 ├── api.test.ts
 └── integration.test.ts
```

---

# GitHub Repository

[https://github.com/MadVickyPanda/ordspel](https://github.com/MadVickyPanda/ordspel)
