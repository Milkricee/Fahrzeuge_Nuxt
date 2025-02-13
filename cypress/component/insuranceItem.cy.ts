describe('Insurance Item Component', () => {
  beforeEach(() => {
    // Besuche die Seite vor jedem Test, falls die Seite lokal läuft
    cy.visit('http://localhost:3000/versicherung');
  });

  it('should display the insurance name and number', () => {
    // Überprüfe, ob die Versicherungsnummer und der Versicherungsname angezeigt werden
    cy.get('.mb-4').should('contain', 'Versicherung Nr:');
    cy.get('.mb-4').should('contain', 'Versicherung Name');
  });

  it('should toggle the insurance details when clicked', () => {
    // Klicke auf die Versicherungsüberschrift, um Details anzuzeigen
    cy.get('.font-semibold.text-blue-700').click();

    // Überprüfe, dass die Details angezeigt werden
    cy.get('.pl-4.mt-2.text-gray-700').should('be.visible');

    // Klicke erneut, um Details zu verbergen
    cy.get('.font-semibold.text-blue-700').click();

    // Überprüfe, dass die Details wieder verborgen sind
    cy.get('.pl-4.mt-2.text-gray-700').should('not.be.visible');
  });

  it('should call confirmDelete when delete button is clicked', () => {
    // Mock die confirm Funktion
    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(true);
    });

    // Klicke auf den Löschen-Button
    cy.get('button.text-red-500').click();

    // Überprüfe, dass der confirm-Dialog aufgerufen wurde
    cy.window().its('confirm').should('have.been.called');
  });

  it('should navigate to edit page when edit button is clicked', () => {
    // Überprüfe, ob der Bearbeiten-Link den richtigen Pfad hat
    cy.get('a.text-blue-500').contains('✏️').should('have.attr', 'href').and('include', '/versicherung/edit');
  });

  it('should display associated vehicles when details are toggled', () => {
    // Stub den API-Aufruf für zugeordnete Fahrzeuge und setze die zugeordneten Fahrzeuge
    cy.intercept('GET', '/api/versicherungen/1/vehicles', {
      body: [
        { fahrzeug_fin: 'WBA8C31020K123456', fahrzeuge: { marke: 'BMW', modell: '3er', kennzeichen: 'S-BM5432' } },
        { fahrzeug_fin: '123456789', fahrzeuge: { marke: 'VW', modell: 'Golf', kennzeichen: 'NB AA 22' } }
      ]
    }).as('getVehicles');

    // Klicke auf die Versicherungsüberschrift, um Details anzuzeigen
    cy.get('.font-semibold.text-blue-700').click();

    // Warten auf die API-Antwort
    cy.wait('@getVehicles');

    // Überprüfe, ob die zugeordneten Fahrzeuge angezeigt werden
    cy.get('.pl-4.mt-2.text-gray-700').should('contain', 'BMW 3er');
    cy.get('.pl-4.mt-2.text-gray-700').should('contain', 'VW Golf');
  });
});
