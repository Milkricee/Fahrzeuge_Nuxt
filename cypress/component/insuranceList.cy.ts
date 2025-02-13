describe('Insurance List Component', () => {
  beforeEach(() => {
    // Besuche die Seite vor jedem Test
    cy.visit('http://localhost:3001/versicherung'); // Passe den Pfad an den tatsächlichen Pfad zur Seite an
  });

  it('should render the list of insurances', () => {
    // Überprüfe, dass die Versicherungsüberschrift angezeigt wird
    cy.get('h3').should('contain', 'Versicherungen');

    // Überprüfe, dass beide Versicherungseinträge korrekt angezeigt werden
    cy.get('.insurance-item').eq(0).should('contain', 'Versicherung A').and('contain', '12345');
    cy.get('.insurance-item').eq(1).should('contain', 'Versicherung B').and('contain', '67890');
  });

  it('should have correct number of insurance items', () => {
    // Überprüfe, ob es genau 2 Versicherungseinträge gibt
    cy.get('.insurance-item').should('have.length', 2);
  });
});

