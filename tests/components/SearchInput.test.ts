import { vi, describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import SearchInput from '@/components/SearchInput.vue'; // Stelle sicher, dass der Pfad korrekt ist

// Mock für `useNuxtApp` importieren, um den Fehler zu vermeiden
vi.mock('#app', () => ({
  useNuxtApp: () => ({
    $supabase: {}, // Wir brauchen die $supabase-Mock-Daten nicht im Test
  }),
}));

describe('SearchInput.vue', () => {
  it('renders input field correctly', () => {
    const wrapper = mount(SearchInput);
    const input = wrapper.find('input');
    expect(input.exists()).toBe(true);
    expect(input.element.placeholder).toBe('Suche nach Kennzeichen, Marke, Modell, etc.');
  });

  it('displays suggestions when input is entered', async () => {
    const wrapper = mount(SearchInput);

    // Simuliere Eingabe
    const input = wrapper.find('input');
    await input.setValue('BMW'); // Eingabe simulieren

    // Überprüfe, ob die Vorschläge angezeigt werden
    const suggestions = wrapper.findAll('li'); // Annahme: Die Vorschläge sind in <li> Elementen
    expect(suggestions.length).toBeGreaterThan(0); // Überprüfe, ob Vorschläge angezeigt werden
    expect(suggestions[0].text()).toContain('BMW'); // Überprüfe, ob der Vorschlag 'BMW' enthält
  });

  it('selects suggestion and updates input field', async () => {
    const wrapper = mount(SearchInput);

    // Simuliere Eingabe
    await wrapper.find('input').setValue('BMW');

    // Überprüfe, ob die Vorschläge angezeigt werden
    const suggestions = wrapper.findAll('li');
    expect(suggestions.length).toBeGreaterThan(0); // Sicherstellen, dass Vorschläge angezeigt werden

    // Vorschlag auswählen
    const firstSuggestion = suggestions[0];
    await firstSuggestion.trigger('click');

    // Überprüfen, ob der Wert im Eingabefeld aktualisiert wurde
    const input = wrapper.find('input');
    expect(input.element.value).toBe('BMW'); // Überprüfe, ob der Wert des Inputs auf 'BMW' gesetzt wurde
  });

  it('does not show suggestions when input is empty', async () => {
    const wrapper = mount(SearchInput);

    await wrapper.find('input').setValue(''); // Leere Eingabe

    // Überprüfe, ob keine Vorschläge angezeigt werden
    const suggestions = wrapper.findAll('li'); // Annahme: Vorschläge erscheinen in <li> Elementen
    expect(suggestions.length).toBe(0); // Keine Vorschläge, wenn das Eingabefeld leer ist
  });
});
