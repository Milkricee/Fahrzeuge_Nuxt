import { mount } from '@vue/test-utils';
import { vi, describe, it, expect, beforeEach } from 'vite';
import Fahrzeug from '@/pages/kfz/fahrzeuge.vue'; // Alias @ für src verwenden
import { useNuxtApp } from '#app';
import { searchQuery } from '~/composables/useSearchStore';


// Mock für Nuxt und Supabase
vi.mock('#app', () => ({
  useNuxtApp: () => ({
    $supabase: {
      from: vi.fn(() => ({
        select: vi.fn(() => ({
          data: [
            { projekt_id: '1', kennzeichen: 'ABC123' },
            { projekt_id: '2', kennzeichen: 'XYZ789' }
          ],
          error: null
        }))
      }))
    }
  })
}));

vi.mock('~/composables/useSearchStore', () => ({
  searchQuery: { value: '' }
}));

describe('Fahrzeug.vue', () => {
  let wrapper;

  beforeEach(async () => {
    // Mount the component before each test
    wrapper = mount(Fahrzeug);

    // Warten auf das nächste "tick", um sicherzustellen, dass alle asynchronen Operationen abgeschlossen sind
    await wrapper.vm.$nextTick();
  });

  it('lädt und zeigt Fahrzeugdaten korrekt an', async () => {
    // Überprüfe, ob die Fahrzeuge korrekt geladen und angezeigt werden
    const fahrzeugItems = wrapper.findAllComponents({ name: 'FahrzeugItem' });

    expect(fahrzeugItems).toHaveLength(2); // Zwei Fahrzeuge sollten geladen sein
    expect(fahrzeugItems.at(0).props('fahrzeug').kennzeichen).toBe('ABC123');
    expect(fahrzeugItems.at(1).props('fahrzeug').kennzeichen).toBe('XYZ789');
  });

  it('zeigt nur Fahrzeuge an, wenn der Suchbegriff übereinstimmt', async () => {
    // Setze den Suchbegriff und teste, ob nur das entsprechende Fahrzeug angezeigt wird
    searchQuery.value = 'ABC';
    await wrapper.vm.$nextTick();

    const fahrzeugItems = wrapper.findAllComponents({ name: 'FahrzeugItem' });

    // Überprüfen, dass nur ein Fahrzeug angezeigt wird
    expect(fahrzeugItems).toHaveLength(1);
    expect(fahrzeugItems.at(0).props('fahrzeug').kennzeichen).toBe('ABC123');
  });

  it('zeigt alle Fahrzeuge an, wenn der Suchbegriff leer ist', async () => {
    // Setze den Suchbegriff auf leer und teste, ob alle Fahrzeuge angezeigt werden
    searchQuery.value = '';
    await wrapper.vm.$nextTick();

    const fahrzeugItems = wrapper.findAllComponents({ name: 'FahrzeugItem' });

    // Überprüfen, dass beide Fahrzeuge angezeigt werden
    expect(fahrzeugItems).toHaveLength(2);
  });

  it('zeigt keine Fahrzeuge an, wenn der Suchbegriff nicht übereinstimmt', async () => {
    // Setze einen nicht passenden Suchbegriff
    searchQuery.value = 'ZZZ';
    await wrapper.vm.$nextTick();

    const fahrzeugItems = wrapper.findAllComponents({ name: 'FahrzeugItem' });

    // Überprüfen, dass keine Fahrzeuge angezeigt werden
    expect(fahrzeugItems).toHaveLength(0);
  });
});

