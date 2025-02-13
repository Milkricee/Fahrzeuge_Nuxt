describe('SearchInput Component', () => {
  beforeEach(() => {
    // Mock-Daten für die Supabase-API
    cy.intercept('POST', '**/fahrzeuge', {
      statusCode: 200,
      body: [
        { "id": 1, "marke": "Audi", "modell": "A4", "kennzeichen": "B-A1234" },
        { "id": 2, "marke": "Audi", "modell": "Q5", "kennzeichen": "B-B5678" },
        { "id": 3, "marke": "Audi", "modell": "A3", "kennzeichen": "B-C9876" }
      ]
    }).as('getFahrzeuge');

    cy.visit('http://localhost:3000/kfz/fahrzeuge'); // Besuche die Seite (stelle sicher, dass der Server läuft)
  });

  it('should show suggestions when typing in the search input', () => {
    // Gebe "Audi" in das Eingabefeld ein
    cy.get('input[type="text"]').type('Audi');

    // Warte auf den API-Aufruf
    cy.wait('@getFahrzeuge');

    // Überprüfe, dass Vorschläge angezeigt werden
    cy.get('ul').should('be.visible');

    // Überprüfe, dass die Vorschläge die richtigen Werte enthalten
    cy.get('ul li').should('have.length', 3); // Hier erwarten wir 3 Vorschläge
    cy.get('ul li').first().should('contain', 'Audi');
  });

  it('should hide suggestions when input is cleared', () => {
    // Gebe "Audi" ein
    cy.get('input[type="text"]').type('Audi');

    // Warte auf den API-Aufruf
    cy.wait('@getFahrzeuge');

    // Überprüfe, dass Vorschläge sichtbar sind
    cy.get('ul').should('be.visible');

    // Lösche den Inhalt des Eingabefelds
    cy.get('input[type="text"]').clear();

    // Überprüfe, dass keine Vorschläge mehr angezeigt werden
    cy.get('ul').should('not.exist');
  });

  it('should select a suggestion and update the search query', () => {
    // Gebe "Audi" ein
    cy.get('input[type="text"]').type('Audi');

    // Warte auf den API-Aufruf
    cy.wait('@getFahrzeuge');

    // Klicke auf den ersten Vorschlag
    cy.get('ul li').first().click();

    // Überprüfe, dass der Wert des Eingabefelds mit dem ausgewählten Vorschlag übereinstimmt
    cy.get('input[type="text"]').should('have.value', 'Audi');

    // Überprüfe, dass die Liste der Vorschläge jetzt verschwunden ist
    cy.get('ul').should('not.exist');
  });

  it('should navigate to the correct page when the search button is clicked', () => {
    // Gib einen Suchbegriff ein
    cy.get('input[type="text"]').type('Audi');

    // Klicke auf den Suchbutton
    cy.get('button').click();

    // Überprüfe, dass die Navigation zur erwarteten Seite erfolgt
    cy.url().should('include', '/kfz/fahrzeuge');
  });

  it('should trigger the search when pressing Enter', () => {
    // Gib einen Suchbegriff ein und drücke Enter
    cy.get('input[type="text"]').type('Audi{enter}');

    // Überprüfe, dass die Navigation zur erwarteten Seite erfolgt
    cy.url().should('include', '/kfz/fahrzeuge');
  });
});
