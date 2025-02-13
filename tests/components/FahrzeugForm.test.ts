import { vi, describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import FahrzeugForm from '@/components/FahrzeugForm.vue'; 
import { ref } from 'vue';
describe('FahrzeugForm.vue', () => {
  it('renders all fields correctly', () => {
    const wrapper = mount(FahrzeugForm, {
      props: {
        initialData: {
          marke: 'BMW',
          modell: 'X5',
          kennzeichen: 'AB-CD-123',
          fin: 'WBA1234567890',
        },
        isEditing: false,
      },
    });

    // Überprüfe, ob die Felder mit den initialen Werten gerendert werden
    expect((wrapper.find('#marke').element as HTMLInputElement).value).toBe('BMW');
    expect((wrapper.find('#modell').element as HTMLInputElement).value).toBe('X5');
    expect((wrapper.find('#kennzeichen').element as HTMLInputElement).value).toBe('AB-CD-123');
    expect((wrapper.find('#fin').element as HTMLInputElement).value).toBe('WBA1234567890');
  });

  it('updates values on input', async () => {
    const wrapper = mount(FahrzeugForm, {
      props: {
        initialData: { marke: '', modell: '', kennzeichen: '', fin: '' },
        isEditing: false,
      },
    });

    const markeInput = wrapper.find('#marke');
    await markeInput.setValue('Audi');
    expect((wrapper.vm as any).fahrzeug.marke).toBe('Audi');
  });

  it('toggles "Weitere Infos" section', async () => {
    const wrapper = mount(FahrzeugForm, {
      props: { initialData: {}, isEditing: false },
    });

    expect(wrapper.find('#fahrgestell_nr').exists()).toBe(false);

    const toggleButton = wrapper.find('button[type="button"]');
    await toggleButton.trigger('click');

    expect(wrapper.find('#fahrgestell_nr').exists()).toBe(true);
  });

  it('emits "submit" event with correct data', async () => {
    const wrapper = mount(FahrzeugForm, {
      props: {
        initialData: { marke: 'BMW', modell: 'X5', kennzeichen: 'AB-CD-123', fin: 'WBA1234567890' },
        isEditing: false,
      },
    });

    await wrapper.find('form').trigger('submit.prevent');
    expect(wrapper.emitted().submit).toBeTruthy();

    const submitEvent = wrapper.emitted().submit as unknown as Array<[{ marke: string; modell: string; kennzeichen: string; fin: string }]>;
    expect(submitEvent[0][0]).toEqual({
      marke: 'BMW',
      modell: 'X5',
      kennzeichen: 'AB-CD-123',
      fin: 'WBA1234567890',
    });
  });

  it('reactively updates when props.initialData changes', async () => {
    const wrapper = mount(FahrzeugForm, {
      props: {
        initialData: { marke: 'BMW', modell: 'X5', kennzeichen: 'AB-CD-123', fin: 'WBA1234567890' },
        isEditing: false,
      },
    });

    await wrapper.setProps({
      initialData: { marke: 'Audi', modell: 'Q7', kennzeichen: 'XY-ZD-456', fin: 'WBA9876543210' },
    });

    expect((wrapper.find('#marke').element as HTMLInputElement).value).toBe('Audi');
    expect((wrapper.find('#modell').element as HTMLInputElement).value).toBe('Q7');
    expect((wrapper.find('#kennzeichen').element as HTMLInputElement).value).toBe('XY-ZD-456');
    expect((wrapper.find('#fin').element as HTMLInputElement).value).toBe('WBA9876543210');
  });
});
