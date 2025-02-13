import { vi, describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import InsuranceItem from '@/components/insuranceItem.vue'; // Passe den Import an

// Mock von useNuxtApp und $supabase
vi.mock('#app', () => ({
  useNuxtApp: vi.fn(() => ({
    $supabase: {
      from: vi.fn(() => ({
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
        delete: vi.fn().mockResolvedValue({ error: null }), // Mock für delete
      })),
    },
  })),
}));

describe('InsuranceItem.vue', () => {
  const insurance = {
    id: 1,
    name: 'Beste versicherung',
    versicherungs_nr: '123',
    beginn: '2024-01-01',
    ende: '2025-01-01',
    betrag: 300000,
  };

  it('renders insurance data correctly', () => {
    const wrapper = mount(InsuranceItem, {
      props: { insurance },
    });

    // Überprüfen, ob die Versicherungsdaten korrekt gerendert werden
    expect(wrapper.text()).toContain('Beste versicherung');
    expect(wrapper.text()).toContain('123');
    expect(wrapper.text()).toContain('2024-01-01');
    expect(wrapper.text()).toContain('2025-01-01');
    expect(wrapper.text()).toContain('300000');
  });

  it('toggles insurance details when clicked', async () => {
    const wrapper = mount(InsuranceItem, {
      props: { insurance },
    });

    // Zu Beginn sollten die Details nicht sichtbar sein
    expect(wrapper.find('.text-gray-700').exists()).toBe(false);

    // Simuliere den Klick auf den Namen
    await wrapper.find('.cursor-pointer').trigger('click');

    // Nach dem Klick sollten die Details sichtbar sein
    expect(wrapper.find('.text-gray-700').exists()).toBe(true);
  });

  it('emits insuranceDeleted event when delete is confirmed', async () => {
    // Mock für window.confirm (um das Löschen zu bestätigen)
    vi.spyOn(window, 'confirm').mockReturnValue(true);  // Bestätigt das Löschen

    const wrapper = mount(InsuranceItem, {
      props: { insurance },
    });

    // Simuliere den Klick auf den Löschen-Button
    await wrapper.find('button').trigger('click');

    // Überprüfen, ob das emit-Event ausgelöst wurde
    expect(wrapper.emitted().insuranceDeleted).toBeTruthy();
  });

  it('does not emit insuranceDeleted event when delete is canceled', async () => {
    // Mock für window.confirm (um das Löschen abzubrechen)
    vi.spyOn(window, 'confirm').mockReturnValue(false);  // Abbrechen

    const wrapper = mount(InsuranceItem, {
      props: { insurance },
    });

    // Simuliere den Klick auf den Löschen-Button
    await wrapper.find('button').trigger('click');

    // Überprüfen, dass das emit-Event nicht ausgelöst wurde
    expect(wrapper.emitted().insuranceDeleted).toBeUndefined();
  });

  it('calls $supabase.delete when deleting an insurance', async () => {
    const wrapper = mount(InsuranceItem, {
      props: { insurance },
    });

    // Mock für $supabase.delete
    const deleteMock = vi.fn().mockResolvedValue({ error: null });
    wrapper.vm.$supabase.from().delete = deleteMock;

    // Simuliere das Löschen
    await wrapper.vm.deleteInsurance();  // Manuell die deleteInsurance-Methode aufrufen

    // Überprüfen, ob die delete-Methode von $supabase aufgerufen wurde
    expect(deleteMock).toHaveBeenCalledWith({ id: insurance.id });
  });

  it('reactively updates when insurance prop changes', async () => {
    const wrapper = mount(InsuranceItem, {
      props: { insurance },
    });

    // Ändere die Versicherung
    await wrapper.setProps({
      insurance: {
        id: 2,
        name: 'Neue Versicherung',
        versicherungs_nr: '67890',
        beginn: '2024-01-01',
        ende: '2025-01-01',
        betrag: 600,
      },
    });

    // Überprüfe, ob die neuen Werte gerendert wurden
    expect(wrapper.text()).toContain('Neue Versicherung');
    expect(wrapper.text()).toContain('67890');
    expect(wrapper.text()).toContain('600');
  });
});
