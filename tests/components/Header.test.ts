import { describe, it, expect, vi } from 'vitest';  // Importiere die notwendigen Testmethoden von Vitest
import { mount } from '@vue/test-utils';
import Header from '@/components/Header.vue'; // Stelle sicher, dass der Pfad korrekt ist

// Mocken der Nuxt-Funktionen
vi.mock('#app', () => ({
  navigateTo: vi.fn()  // Erstelle einen Mock für `navigateTo`
}));

describe('Header.vue', () => {
  it('renders the logo with correct alt text', () => {
    const wrapper = mount(Header);

    // Stelle sicher, dass das Logo korrekt angezeigt wird
    const logo = wrapper.find('img');
    expect(logo.exists()).toBe(true);  // Überprüfe, dass das Logo-Element vorhanden ist
    expect(logo.attributes('alt')).toBe('Logo');  // Überprüfe, dass der Alt-Text korrekt ist
  });

  it('matches the header structure with a snapshot', () => {
    const wrapper = mount(Header);

    // Vergleiche die gerenderte Struktur des Headers mit einem Snapshot
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('calls navigateTo when clicking on the Versicherung link', async () => {
    const wrapper = mount(Header);

    // Finde den "Versicherung"-Link und klicke darauf
    const versicherungLink = wrapper.find('a[href="/versicherung"]');
    await versicherungLink.trigger('click.prevent');

    // Überprüfe, ob `navigateTo` aufgerufen wurde
    expect(vi.fn().mock.calls.length).toBe(1);  // Überprüfe, dass navigateTo einmal aufgerufen wurde
    expect(vi.fn().mock.calls[0][0]).toBe('/versicherung');  // Überprüfe, dass navigateTo mit dem richtigen Parameter aufgerufen wurde
  });
});
