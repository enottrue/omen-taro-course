import { useState, useEffect } from 'react';
import { useContext } from 'react';
import { MainContext } from '@/contexts/MainContext';

function useModal() {
  const [openModal, setOpenModal] = useState(false);
  const cc = useContext(MainContext);

  useEffect(() => {
    if (openModal) {
      document.body.classList.add('body-modal-open');
      cc?.setModalOpen(true);
    } else {
      document.body.classList.remove('body-modal-open');
      cc?.setModalOpen(false);
    }
  }, [openModal]);

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  return { openModal, toggleModal };
}

export default useModal;
