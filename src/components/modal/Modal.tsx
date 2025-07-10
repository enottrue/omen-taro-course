import React from 'react';
import Button from '../button/Button';
import Image from 'next/image';
import Arrow from '@/images/svg/button-arrow.svg';
import ModalFormRegister from '@/components/modal-form-register/modal-form-register';
import ModalFormAuth from '@/components/modal-form-auth/modal-form-auth';
import ModalForgotPassword from '@/components/modal-form-auth/ModalForgotPassword';

//import useContext and MainContext
import { useContext, useEffect } from 'react';
import { MainContext } from '@/contexts/MainContext';
const Modal = () => {
  const cc = useContext(MainContext);

  useEffect(() => {
    if (cc?.currentForm) {
      document.body.classList.add('body-modal-open');
      cc?.setModalOpen(true);
    } else {
      document.body.classList.remove('body-modal-open');
      cc?.setModalOpen(false);
    }
  }, [cc?.currentForm]);

  return cc?.currentForm === 'auth' ? (
    <ModalFormAuth isOpen={true} />
  ) : cc?.currentForm === 'register' ? (
    <ModalFormRegister isOpen={true} />
  ) : cc?.currentForm === 'forgot-password' ? (
    <ModalForgotPassword isOpen={true} />
  ) : null;
};

export default Modal;
