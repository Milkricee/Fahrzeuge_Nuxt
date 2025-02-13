import FahrzeugForm from '@/components/FahrzeugForm.vue';

describe('<FahrzeugForm />', () => {
  beforeEach(() => {
    // Besuche die Seite vor jedem Test
    cy.visit('http://localhost:3000/kfz/neues-fahrzeug');  // Hier den Pfad anpassen, je nachdem, wo das Formular aufgerufen wird
  });

  it('renders and interacts with the form', () => {
    // Beispiel für initiale Daten
    const initialData = {
      fin: 'WAUZZZ8K4DA123456',
      marke: 'Audi',
      modell: 'A4',
      kennzeichen: 'B-AU4567',
      kilometerstand: 85000,
      erstzulassung: '2016-03-15',
      kaufpreis: 29000,
      versicherungs_nr: 'VERS67890',
    };

    // Komponente mounten, aber diesmal nach dem Besuch der Seite
    cy.mount(FahrzeugForm, {
      props: {
        initialData, // übergebe initiale Daten als Props
        isEditing: true
      }
    });

    // Überprüfen, ob das Formular korrekt gerendert wird
    cy.get('input#marke').should('have.value', 'Audi');
    cy.get('input#modell').should('have.value', 'A4');
    cy.get('input#kennzeichen').should('have.value', 'B-AU4567');
    cy.get('input#kilometerstand').should('have.value', '85000');
    cy.get('input#erstzulassung').should('have.value', '2016-03-15');
    cy.get('input#kaufpreis').should('have.value', '29000');
    cy.get('input#versicherungs_nr').should('have.value', 'VERS67890');
    
    // Testen der Interaktionen
    cy.get('input#marke').clear().type('BMW');
    cy.get('input#modell').clear().type('3er');
    
    // Überprüfen, ob die Änderungen übernommen wurden
    cy.get('input#marke').should('have.value', 'BMW');
    cy.get('input#modell').should('have.value', '3er');

    // Formular absenden
    cy.get('form').submit();

    // Überprüfen, ob die "submit"-Ereignis ausgelöst wird
    cy.get('@submit').should('have.been.called');
  });

  it('toggles the more info section', () => {
    // Starten des Tests mit initialen Daten
    const initialData = {
      fin: '9876543210',
      marke: 'Mercedes',
      modell: 'C-Class',
      kennzeichen: 'CD 987 EF',
    };

    cy.mount(FahrzeugForm, {
      props: {
        initialData,
        isEditing: true
      }
    });

    // Teste das Umschalten der erweiterten Infos
    cy.contains('Weitere Infos').click();
    cy.get('div.mt-4').should('be.visible');

    cy.contains('Weniger Infos').click();
    cy.get('div.mt-4').should('not.exist');
  });
});
