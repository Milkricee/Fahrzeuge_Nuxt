import FahrzeugItem from '@/components/FahrzeugItem.vue';

describe('FahrzeugItem.vue', () => {
  const fahrzeug = {
    fin: 'WDB12345678901234',
    marke: 'Mercedes-Benz',
    modell: 'C-Klasse',
    kennzeichen: 'HH-MB1234',
    fahrgestell_nr: '1234567890',
    typschluessel_nr: '09876',
    karosserie_typ: 'Limousine',
    kraftstoff_typ: 'Diesel',
    leistung_ps: 150,
    kaufpreis: 35000,
    bruttolistenpreis: 37000,
    kaufdatum: '2018-06-15',
    erstzulassung: '2018-05-20',
    breite: 183,
    laenge: 468,
    hoehe: 144,
    leermasse: 1480,
    gesamtmasse: 2000,
    max_zuladung: 520,
    anhaengerkupplung: true,
    sitze: 5,
    kilometerstand: 45000,
    garantie: '5 Jahre',
    versicherungs_nr: 'VERS12345',
    schaden: false,
  };

  beforeEach(() => {
    // Besuche eine Seite, die das FahrzeugItem enthält (hier muss der Pfad zur Seite angepasst werden)
    cy.visit('http://localhost:3000/kfz/fahrzeuge');  // Hier den Pfad anpassen, je nachdem, wo die Fahrzeugübersicht oder -detailseite ist

    // Mounten der Komponente mit den Props
    cy.mount(FahrzeugItem, {
      props: {
        fahrzeug,
      },
    });
  });

  it('zeigt die Fahrzeugüberschrift korrekt an', () => {
    // Überprüfe, ob die Fahrzeugmarke, Modell und das Kennzeichen korrekt angezeigt werden
    cy.get('.font-semibold.text-blue-700').should(
      'contain',
      `${fahrzeug.marke} ${fahrzeug.modell} - Kennzeichen: ${fahrzeug.kennzeichen}`
    );
  });

  it('zeigt die Fahrzeugdetails nach Klick auf die Fahrzeugüberschrift', () => {
    // Klick auf die Fahrzeugüberschrift
    cy.get('.font-semibold.text-blue-700').click();

    // Überprüfe, ob die detaillierten Fahrzeuginformationen angezeigt werden
    cy.get('.pl-4.mt-2.text-gray-700').should('be.visible');
  });

  it('zeigt die richtige Anzahl an Fahrzeugdetails', () => {
    // Klick auf die Fahrzeugüberschrift, um Details anzuzeigen
    cy.get('.font-semibold.text-blue-700').click();

    // Überprüfe, ob die Details wie erwartet angezeigt werden
    cy.get('p').should('have.length', 16); // Überprüfe, ob die Anzahl der <p> Elemente stimmt
  });

  it('zeigt die Bestätigung an, wenn der Löschen-Button geklickt wird', () => {
    // Stub den `confirm` Dialog, damit er automatisch "true" zurückgibt
    cy.window().then((window) => {
      cy.stub(window, 'confirm').returns(true);
    });

    // Klicke auf das Löschen-Symbol
    cy.get('button.text-red-500').click();

    // Überprüfe, ob der `confirm`-Dialog aufgerufen wurde
    cy.window().its('confirm').should('have.been.called');
  });

  it('prüft den Link für die Fahrzeugbearbeitung', () => {
    // Überprüfe, ob der Bearbeiten-Link korrekt ist
    cy.get('a.text-blue-500').should('have.attr', 'href').and('include', '/kfz/fahrzeug-bearbeiten');
  });

  it('prüft den Link zur Fahrzeughistorie', () => {
    // Überprüfe, ob der Historie-Link korrekt ist
    cy.get('a.text-blue-500').eq(1).should('have.attr', 'href').and('include', '/kfz/fahrzeug-historie');
  });
});
