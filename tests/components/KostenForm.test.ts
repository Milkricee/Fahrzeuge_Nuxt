import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import FormComponent from '@/components/KostenForm.vue'; // Passe den Pfad an

describe('KostenForm.vue', () => {
  it('renders and binds form values correctly', async () => {
    const formData = {
      datum: '2025-01-01',
      kategorie: 'Versicherung',
      beschreibung: '',
      betrag: 100.0,
      beleg_nr: '',
    };

    const wrapper = mount(FormComponent, {
      props: {
        formData,
        activeTab: 'Kosten',
      },
    });

    // Überprüfe, ob die Eingabefelder die korrekten Werte haben
    expect((wrapper.find('input[type="date"]').element as HTMLInputElement).value).toBe(formData.datum);
    expect((wrapper.find('select').element as HTMLSelectElement).value).toBe(formData.kategorie);
    expect((wrapper.find('input[type="number"]').element as HTMLInputElement).value).toBe(formData.betrag.toString());
    expect((wrapper.find('input[type="text"]').element as HTMLInputElement).value).toBe(formData.beleg_nr);
  });

  it('emits save event with correct data on form submission', async () => {
    const formData = {
      datum: '2025-01-01',
      kategorie: 'Versicherung',
      beschreibung: 'Test Beschreibung',
      betrag: 50.0,
      beleg_nr: '12345',
    };

    const wrapper = mount(FormComponent, {
      props: {
        formData,
        activeTab: 'Kosten',
      },
    });

    // Simuliere das Absenden des Formulars
    await wrapper.find('form').trigger('submit.prevent');

    // Überprüfe, ob das "save"-Event mit den richtigen Daten emittiert wurde
    expect(wrapper.emitted().save[0]).toEqual([formData]);
  });
});
