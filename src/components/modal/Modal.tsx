import React from 'react';
import Button from '../button/Button';
import Image from 'next/image';
import Arrow from '@/images/svg/button-arrow.svg';
import ModalRegister from '@/components/modal_register/Register';
import ModalSignIn from '@/components/modal_signin/SignIn';

//import useContext and MainContext
import { useContext, useEffect } from 'react';
import { MainContext } from '@/contexts/MainContext';
const Modal = () => {
  const cc = useContext(MainContext);

  useEffect(() => {
    if (cc?.modalOpen) {
      document.body.classList.add('body-modal-open');
      cc?.setModalOpen(true);
    } else {
      document.body.classList.remove('body-modal-open');
      cc?.setModalOpen(false);
      cc?.setCurrentForm(null);
    }
  }, [cc?.modalOpen]);

  return cc?.currentForm === 'signin' ? (
    <ModalSignIn />
  ) : cc?.currentForm === 'register' ? (
    <ModalRegister />
  ) : null;
};

export default Modal;
