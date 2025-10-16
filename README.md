# EuroJackpotFrontend (EJF)

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=nextdotjs)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![MUI](https://img.shields.io/badge/MUI-5-007FFF?style=flat-square&logo=mui)
![Zustand](https://img.shields.io/badge/State-Zustand-ffb703?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## English Version

### Overview

**EuroJackpotFrontend (EJF)** is a specialized **web application for desktop screens**, designed to analyze EuroJackpot data and visualize draw statistics.  
It offers a clear, data-centric user interface with analytical features for historical draws, number frequencies, and personalized tips.  
The application is optimized for large displays with a **minimum resolution of 1200×775 px**.  
If the browser window is smaller, a modal window advises users to resize their viewport.

This project is continuously evolving — new analytical dashboard modules will be added over time.

---

### Dashboard Features

The Dashboard provides a comprehensive overview of EuroJackpot trends and draw statistics.  
Current modules include:

- **Latest Draw:** shows the most recent EuroJackpot results (main and Euro numbers, date, weekday)
- **First Draw:** displays the very first available draw in the dataset
- **Stake Development:** shows the total and average ticket sales per draw over time
- **Top Winning Numbers (Total):** identifies the most frequently drawn numbers overall
- **Top Winning Numbers (Class 1, 2, 3):** frequency analysis limited to top prize categories
- **Number Ranges:** visualizes which numeric segments (1–10, 11–20, …) are most common
- **Overdue Numbers:** shows numbers that have not been drawn for the longest time
- **Popular Numbers:** compares player tendencies with actual draw frequencies

All dashboard widgets are modular and designed for easy expansion — additional features such as correlation analysis, combination patterns, or jackpot development are planned.

---

### Additional Features

#### Archive

- Full access to all historical EuroJackpot draws
- Search, filter, and pagination for convenient browsing
- Detailed modal view with class-wise payout and winner information

#### Winning Numbers

- Frequency analysis for all main numbers (1–50)
- Sortable by frequency or numerical order
- Multiple visual representations (bar and pie charts)

#### Euro Numbers

- Independent frequency statistics for Euro numbers (1–12)
- Sorting and filtering options for deep insights

#### Prize Classes

- Overview of all 12 official EuroJackpot prize tiers
- Displays winners, payout sums, and averages
- Comparative view between draws

#### My Tips

- Manage up to 12 personal EuroJackpot tips
- Each tip includes 5 main numbers and 2 Euro numbers
- Random number generation, manual editing, and reset per tip
- JSON-based import/export with strict validation
- LocalStorage persistence for automatic saving
- Toolbar displays the latest draw and highlights matches with badges and checkmarks
- Snackbars for download, upload, and validation feedback (top-centered display)

---

### Technical Information

- Built with **Next.js (App Router)**, **React**, and **TypeScript**
- UI components based on **Material UI (MUI 5)**
- State management via **Zustand**
- Optimized for desktop resolutions ≥ 1200×775 px
- Responsive only within the desktop layout range
- Shows a resolution warning modal if the screen is too small
- Prepared for deployment on **Vercel** or similar environments

---

### Disclaimer

All EuroJackpot data in this application has been **carefully compiled** and **analyzed for consistency and accuracy using AI-assisted validation methods**.  
Despite the high level of care, **no guarantee can be given for completeness or correctness** of the data or calculations.  
This application is intended for **informational and educational purposes only** and is not affiliated with official lottery operators.

---

### Quick Start

```bash
# Clone repository
git clone https://github.com/yourname/eurojackpotfrontend.git
cd eurojackpotfrontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in a desktop browser (minimum 1200×775 px).

---

### Author & License

Developed by **Thomas Schlender**  
Licensed under the **MIT License**

---

## Deutsche Version

### Übersicht

**EuroJackpotFrontend (EJF)** ist eine spezialisierte **Webanwendung für Desktop‑Bildschirme**, die der Analyse und Visualisierung von EuroJackpot‑Daten dient.  
Sie bietet eine datenorientierte Benutzeroberfläche mit umfassenden Auswertungen zu Ziehungen, Gewinnzahlen und persönlichen Tipps.  
Die Anwendung ist optimiert für große Displays mit einer **Mindestauflösung von 1200×775 px**.  
Bei kleineren Browserfenstern erscheint ein Hinweis‑Modal, das zur Anpassung der Fenstergröße auffordert.

Das Dashboard wird kontinuierlich erweitert – zukünftige Module ergänzen die bestehenden Analysen.

---

### Dashboard‑Funktionen

Das Dashboard bietet eine umfassende Übersicht über Trends und Ziehungsstatistiken des EuroJackpots.  
Aktuell stehen folgende Module zur Verfügung:

- **Letzte Ziehung:** zeigt die aktuellste EuroJackpot‑Ziehung (Zahlen, Eurozahlen, Datum, Wochentag)
- **Erste Ziehung:** zeigt die erste verfügbare Ziehung im Datensatz
- **Entwicklung der Spieleinsätze:** zeigt Gesamteinsätze und Durchschnittswerte über die Zeit
- **Top‑Gewinnzahlen (Gesamt):** meistgezogene Zahlen über alle Ziehungen hinweg
- **Top‑Gewinnzahlen (Klasse 1, 2, 3):** Häufigkeitsanalyse innerhalb der Top‑Gewinnklassen
- **Zahlenbereiche:** Darstellung, welche Zahlenintervalle (1–10, 11–20, …) am häufigsten vorkommen
- **Überfällige Zahlen:** zeigt Zahlen, die am längsten nicht gezogen wurden
- **Populäre Zahlen:** Abgleich zwischen Spielerpräferenzen und tatsächlichen Ziehungen

Alle Dashboard‑Karten sind modular aufgebaut und für zukünftige Erweiterungen vorbereitet, z. B. Korrelationen, Kombinationstrends oder Jackpot‑Entwicklungen.

---

### Weitere Funktionen

#### Archiv

- Vollständiger Zugriff auf alle bisherigen EuroJackpot‑Ziehungen
- Such‑, Filter‑ und Blätterfunktionen für einfache Navigation
- Detaildialog mit Gewinnklassen‑ und Gewinner‑Informationen

#### Gewinnzahlen

- Häufigkeitsanalyse aller Hauptzahlen (1–50)
- Sortierbar nach Häufigkeit oder Zahlenwert
- Darstellung in Balken‑ oder Kreisdiagrammen

#### Eurozahlen

- Separate Statistik der Eurozahlen (1–12)
- Sortier‑ und Filteroptionen für detaillierte Analysen

#### Gewinnklassen

- Übersicht über alle 12 offiziellen EuroJackpot‑Gewinnklassen
- Anzeige der Gewinnerzahlen, Gewinnsummen und Durchschnittswerte
- Vergleichende Darstellung zwischen Ziehungen

#### Meine Tipps

- Verwaltung von bis zu 12 persönlichen Tipps
- Jeder Tipp enthält 5 Hauptzahlen und 2 Eurozahlen
- Zufallsgenerator, manuelle Bearbeitung und Zurücksetzen
- Export/Import als JSON mit Validierung
- Automatische Speicherung im LocalStorage
- Anzeige der letzten Ziehung in der Toolbar
- Treffer werden durch grüne Badges und Checkmarks hervorgehoben
- Snackbars für Upload‑, Download‑ und Fehlermeldungen (oben zentriert)

---

### Technische Informationen

- Entwickelt mit **Next.js (App Router)**, **React** und **TypeScript**
- Benutzeroberfläche auf Basis von **Material UI (MUI 5)**
- Globaler Zustand über **Zustand**
- Optimiert für Desktop‑Auflösungen ab 1200×775 px
- Zeigt ein Hinweis‑Modal bei zu kleiner Fenstergröße
- Bereit für Deployment auf **Vercel** oder ähnlichen Plattformen

---

### Haftungsausschluss

Alle in dieser Anwendung enthaltenen EuroJackpot‑Daten wurden **sorgfältig zusammengetragen** und mit **KI‑gestützten Verfahren auf Konsistenz und Richtigkeit geprüft**.  
Trotz größter Sorgfalt kann **keine Gewähr für Vollständigkeit oder Fehlerfreiheit** übernommen werden.  
Diese Anwendung dient ausschließlich **Informations‑ und Analysezwecken** und steht **nicht in Verbindung mit offiziellen Lotteriebetreibern**.

---

### Schnellstart

```bash
# Repository klonen
git clone https://github.com/yourname/eurojackpotfrontend.git
cd eurojackpotfrontend

# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev
```

Öffnen Sie anschließend [http://localhost:3000](http://localhost:3000) in einem Desktop‑Browser (mindestens 1200×775 px).

---

### Autor & Lizenz

Entwickelt von **Thomas Schlender**  
Lizenziert unter der **MIT License**
