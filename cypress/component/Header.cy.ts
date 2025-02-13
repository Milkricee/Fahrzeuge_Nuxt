describe('Header Component', () => {
  beforeEach(() => {
    // Gehe zur Startseite, bevor jeder Test ausgeführt wird
    cy.visit('http://localhost:3000/kfz/fahrzeuge');
  });

  it('should display the logo', () => {
    // Überprüfe, ob das Logo im Header vorhanden ist
    cy.get('header img').should('be.visible');
  });

  it('should have the correct navigation links', () => {
    // Überprüfe, ob die Navigationslinks vorhanden sind und die korrekten Texte anzeigen
    cy.get('nav ul li').eq(0).find('a').should('have.text', 'Fuhrpark').and('have.attr', 'href', '/kfz/fahrzeuge');
    cy.get('nav ul li').eq(1).find('a').should('have.text', 'Versicherung').and('have.attr', 'href', '/versicherung');
  });

  it('should reset search query when clicking on a navigation link', () => {
    // Gehe zur Fuhrpark-Seite und setze eine Suchanfrage
    cy.get('input[type="search"]').type('Test').should('have.value', 'Test');

    // Klicke auf den "Fuhrpark"-Link und überprüfe, ob die Suchanfrage zurückgesetzt wurde
    cy.get('nav ul li').eq(0).find('a').click();

    // Überprüfe, ob die Suchanfrage nach dem Klicken auf "Fuhrpark" zurückgesetzt wurde
    cy.get('input[type="search"]').should('have.value', '');

    // Gehe zur Versicherung-Seite und setze eine Suchanfrage
    cy.get('input[type="search"]').type('Versicherung').should('have.value', 'Versicherung');

    // Klicke auf den "Versicherung"-Link und überprüfe, ob die Suchanfrage zurückgesetzt wurde
    cy.get('nav ul li').eq(1).find('a').click();

    // Überprüfe, ob die Suchanfrage nach dem Klicken auf "Versicherung" zurückgesetzt wurde
    cy.get('input[type="search"]').should('have.value', '');
  });

  it('should display the search input field', () => {
    // Überprüfe, ob das Suchfeld sichtbar ist
    cy.get('header input[type="search"]').should('be.visible');
  });

  it('should show search results when clicking search button', () => {
    // Überprüfe, ob die Liste der Suchergebnisse angezeigt wird, wenn der Suchbutton geklickt wird
    cy.get('header input[type="search"]').type('Test');
    cy.get('header button[type="submit"]').click();

    // Überprüfe, ob die Liste der Suchergebnisse angezeigt wird
    cy.get('.search-results').should('be.visible');
  });
});
