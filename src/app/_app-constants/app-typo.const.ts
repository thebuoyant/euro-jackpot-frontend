export const APP_TYPO_CONST = {
  common: {
    friday: "Freitag",
    tuesday: "Dienstag",
    class: "Klasse",
  },
  sidebar: {
    navItemDashboard: "Dashboard",
    navItemArchive: "Archiv",
    navItemWinningNumbers: "Gewinnzahlen",
    navItemWinningNumbers123: "Gewinnzahlen 1-2-3",
    navItemClassQuota: "Quoten der Klassen",
    navItemClassNumbers: "Anzahl der Klassen",
    navItemPrizeClasses: "Gewinnklassen",
  },
  components: {
    drawDetailsModal: {
      title: "Ziehung",
    },
    archiveTicketModal: {
      title: "Ziehung",
      winningNumbers: "Gewinnzahlen (5 aus 50)",
      euroNumbers: "Eurozahlen (2 aus 12)",
    },
    resolutionGuard: {
      title: "Die optimale Bildschirmgröße ist unzureichend.",
      description:
        "Für Diagramme und Tabellen empfehlen wir eine größere Fenstergröße. Deine aktuelle Auflösung kann die Lesbarkeit stark beeinträchtigen.",
      labelRecommendation: "Empfehlung",
      labelCurrent: "Aktuell",
      labelWidth: "Breite",
      labelHeight: "Höhe",
      labelCheckbox: "Diesen Hinweis auf diesem Gerät nicht mehr anzeigen",
      buttonLabelCancel: "Trotzdem fortfahren",
      buttonLabelApply: "OK",
      buttonLabelSave: "Speichern & schließen",
    },
  },
  pages: {
    home: {
      headerTitle: "Herzlich Willkommen",
    },
    dashboard: {
      headerTitle: "Dashboard",
      cards: {
        lastDraw: {
          title: "Letzte Ziehung",
          labelDate: "Datum",
          labelWinningNumbers: "Gewinnzahlen",
          labelEuroNumbers: "Eurozahlen",
          labelStake: "Spieleinsatz",
          labelDay: "Wochentag",
        },
        firstDraw: {
          title: "Erste Ziehung",
          labelDate: "Datum",
          labelWinningNumbers: "Gewinnzahlen",
          labelEuroNumbers: "Eurozahlen",
          labelStake: "Spieleinsatz",
          labelDay: "Wochentag",
        },
        stake: {
          title: "Entwicklung der Spieleinsätze",
        },
        topWinningNumbers: {
          title: "Top Gewinnzahlen (total)",
        },
        topWinningNumbers123: {
          title: "Top Gewinnzahlen (Klasse 1, 2 und 3)",
        },
        specialData: {
          title: "Zahlenbereiche",
        },
        numberGaps: {
          title: "Überfällige Zahlen",
        },
        prizeClasses: {
          title: "Gewinnklassen",
          cardLabelClass: "Klasse",
          cardLabelNeeded: "Benötigt",
          cardLabelWinningNumbers: "Gewinnzahlen",
          cardLabelEuroNumbers: "Eurozahlen",
          cardLabelMin: "Minimum",
          cardLabelMax: "Maximum",
          cardLabelMaxTooltip: "Letztes Auftreten des Maximums",
          cardLabelMinTooltip: "Letztes Auftreten des Minimums",
        },
      },
    },
    archive: {
      headerTitle: "Archiv",
      table: {
        headerLabelDate: "Datum",
        headerLabelWinningNumber1: "Gewinnzahl - 1",
        headerLabelWinningNumber2: "Gewinnzahl - 2",
        headerLabelWinningNumber3: "Gewinnzahl - 3",
        headerLabelWinningNumber4: "Gewinnzahl - 4",
        headerLabelWinningNumber5: "Gewinnzahl - 5",
        headerLabelEuroNumber1: "Eurozahl - 1",
        headerLabelEuroNumber2: "Eurozahl - 2",
        headerLabelStake: "Spieleinsatz (€)",
        headerLabelDay: "Tag",
        headerLabelClass1: "Status",
        headerLabelActions: "Aktionen",
        tooltip: {
          classOne: "Klasse 1 - Gewinn",
          classMax: "Klasse 1 mit 120.000.000,00 €",
          actionDrawDetails: "Details der Ziehung",
          actionShowTicket: "Spielschein anzeigen",
        },
      },
      toolbar: {
        labelFrom: "von",
        labelTo: "bis",
        buttonLabelApply: "Anwenden",
        buttonLabelReset: "Zurücksetzen",
        buttonLabelTuesday: "Dienstag",
        buttonLabelFriday: "Freitag",
        buttonLabelBoth: "Beides",
        buttonLabelClass1: "Klasse 1",
        buttonLabelClass123: "Klassen 1-2-3",
      },
    },
    winningNumbers: {
      headerTitle: "Gewinnzahlen",
      toolbar: {
        labelSortingStart: "Zeige sortierte Werte",
        labelSortingOn: "an",
        labelSortingOff: "aus",
      },
    },
    winningNumbers123: {
      headerTitle: "Gewinnzahlen der Klassen 1, 2 und 3",
      toolbar: {
        labelSortingStart: "Zeige sortierte Werte",
        labelSortingOn: "an",
        labelSortingOff: "aus",
      },
    },
    classQuota: {
      headerTitle: "Quoten der Ziehungen für die Gewinnklassen",
    },
    classNumbers: {
      headerTitle: "Anzahl der Ziehungen für die Gewinnklassen",
    },
    tips: {
      headerTitle: "Meine Tipps",
    },
  },
};
