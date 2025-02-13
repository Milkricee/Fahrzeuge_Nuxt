import { mount } from '@vue/test-utils';
import NeuesFahrzeugHinzufuegen from '@/pages/kfz/neues-fahrzeug.vue';
import { useRouter } from 'vue-router';
import { describe, it, expect, beforeEach, vi } from 'vite';

// Mock für vue-router
vi.mock('vue-router', () => ({
  useRouter: vi.fn()
}));

// Mock für Supabase
vi.mock('#app', () => ({
  useNuxtApp: () => ({
    $supabase: {
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockResolvedValue({
          data: [{ id: 1, ...mockFahrzeugData }],
          error: null,
        }),
      }),
    },
  }),
}));

// Mock für console.error
vi.spyOn(console, 'error').mockImplementation(() => {});

// Mock-Daten
const mockFahrzeugData = {
  fin: '1234567890',
  marke: 'VW',
  modell: 'Golf',
  kennzeichen: 'AB 1234',
  kilometerstand: 50000,
  erstzulassung: '2015-01-01',
  kaufpreis: 15000,
  garantie: 24,
  versicherungs_nr: '123456',
  fahrgestell_nr: 'XYZ123',
  typschluessel_nr: 'ABC123',
  karosserie_typ: 'Limousine',
  kraftstoff_typ: 'Benzin',
  leistung_ps: 150,
  bruttolistenpreis: 20000,
  kaufdatum: '2024-11-01',
  breite: 1.8,
  laenge: 4.2,
  hoehe: 1.4,
  leermasse: 1200,
  gesamtmasse: 1500,
  max_zuladung: 400,
  anhaengerkupplung: true,
  sitze: 5,
  schaden: false
};

describe('NeuesFahrzeugHinzufuegen.vue', () => {
  const routerPushMock = vi.fn();
  const supabaseFromMock = vi.fn();
  const supabaseInsertMock = vi.fn();

  beforeEach(() => {
    // Setup der Mocks
    vi.clearAllMocks();
    
    // Router Mock
    useRouter.mockReturnValue({
      push: routerPushMock
    });

    // Supabase Mock
    supabaseFromMock.mockReturnValue({
      insert: supabaseInsertMock
    });
    supabaseInsertMock.mockResolvedValue({
      data: [{ id: 1, ...mockFahrzeugData }],
      error: null
    });
  });

  it('sollte das Fahrzeug korrekt hinzufügen und zur Fahrzeugübersicht navigieren', async () => {
    const wrapper = mount(NeuesFahrzeugHinzufuegen, {
      global: {
        plugins: [],
        mocks: {
          $supabase: {
            from: supabaseFromMock
          }
        }
      }
    });

    // Simuliere das Hinzufügen des Fahrzeugs
    const fahrzeugForm = wrapper.findComponent({ name: 'FahrzeugForm' });
    await fahrzeugForm.vm.$emit('submit', mockFahrzeugData);

    // Überprüfungen
    expect(supabaseFromMock).toHaveBeenCalledWith('fahrzeuge');
    expect(supabaseInsertMock).toHaveBeenCalledWith([mockFahrzeugData]);
    expect(routerPushMock).toHaveBeenCalledWith('/kfz/fahrzeuge');
  });

  it('sollte Fehler bei fehlendem FIN behandeln', async () => {
    const wrapper = mount(NeuesFahrzeugHinzufuegen, {
      global: {
        plugins: [],
        mocks: {
          $supabase: {
            from: supabaseFromMock
          }
        }
      }
    });

    // Simuliere das Hinzufügen eines Fahrzeugs ohne FIN
    const fahrzeugForm = wrapper.findComponent({ name: 'FahrzeugForm' });
    const fahrzeugOhneFin = { ...mockFahrzeugData, fin: '' };
    await fahrzeugForm.vm.$emit('submit', fahrzeugOhneFin);

    // Überprüfungen
    expect(supabaseInsertMock).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('FIN ist erforderlich, um ein Fahrzeug hinzuzufügen.');
  });
});

