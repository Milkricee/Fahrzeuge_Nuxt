import { mount } from '@vue/test-utils';
import Modal from '@/components/Modal.vue';
import { expect } from 'chai'; // Verwende chai's expect, falls du Chai nutzt.

describe('Modal Component', () => {
  it('renders modal when isOpen is true', () => {
    const wrapper = mount(Modal, {
      props: {
        isOpen: true,
        title: 'Test Modal',
        formData: { name: 'John Doe' },
      },
    });

    // Verwende Chai-Assertion
    expect(wrapper.isVisible()).to.be.true;
  });

  it('does not render modal when isOpen is false', () => {
    const wrapper = mount(Modal, {
      props: {
        isOpen: false,
        title: 'Test Modal',
        formData: { name: 'John Doe' },
      },
    });

    // Verwende Chai-Assertion
    expect(wrapper.isVisible()).to.be.false;
  });

  it('emits close event when "Abbrechen" button is clicked', async () => {
    const wrapper = mount(Modal, {
      props: {
        isOpen: true,
        title: 'Test Modal',
        formData: { name: 'John Doe' },
      },
    });

    // Finde und klicke auf den "Abbrechen" Button
    await wrapper.find('button.bg-gray-500').trigger('click');
    
    // Verwende Chai-Assertion
    expect(wrapper.emitted().close).to.exist;
  });

  it('emits save event with formData when "Speichern" button is clicked', async () => {
    const formData = { name: 'John Doe' };
    const wrapper = mount(Modal, {
      props: {
        isOpen: true,
        title: 'Test Modal',
        formData,
      },
    });

    // Finde und klicke auf den "Speichern" Button
    await wrapper.find('button.bg-primary-500').trigger('click');
    
    // Verwende Chai-Assertion
    expect(wrapper.emitted().save).to.exist;
    expect(wrapper.emitted().save[0]).to.deep.equal([formData]);
  });
});
