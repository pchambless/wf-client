// modalStore.js - MobX Conversion with backward compatibility
import { makeAutoObservable } from 'mobx';
import { createContext, useContext } from 'react';

class ModalStore {
  isOpen = false;
  modalType = null;
  modalProps = {};
  
  constructor() {
    makeAutoObservable(this);
  }
  
  openModal(type, props = {}) {
    this.isOpen = true;
    this.modalType = type;
    this.modalProps = props;
  }
  
  closeModal() {
    this.isOpen = false;
  }
  
  showError(message) {
    this.openModal('error', { message });
  }
  
  showConfirmation(message, onConfirm, onCancel) {
    this.openModal('confirmation', { message, onConfirm, onCancel });
  }
}

// Create the store instance
export const modalStore = new ModalStore();

// Create React context
const ModalContext = createContext(modalStore);

// Create hook for components to use
export const useModalStore = () => useContext(ModalContext);

// Export individual functions for legacy code
export const openModal = (type, props) => modalStore.openModal(type, props);
export const closeModal = () => modalStore.closeModal();
export const showError = (message) => modalStore.showError(message);
export const showConfirmation = (message, onConfirm, onCancel) => 
  modalStore.showConfirmation(message, onConfirm, onCancel);
