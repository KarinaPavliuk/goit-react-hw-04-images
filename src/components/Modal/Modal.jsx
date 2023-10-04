import { useEffect } from 'react';
import css from './Modal.module.css';

export const Modal = ({ modalUrl, closeModal }) => {
  useEffect(() => {
    const handleKeyEsc = event => {
      if (event.code === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyEsc);

    return () => {
      document.removeEventListener('keydown', handleKeyEsc);
    };
  }, [closeModal]);

  const handleOverlayClick = event => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className={css.overlay} onClick={handleOverlayClick}>
      <div className={css.modal}>
        <img src={modalUrl} alt="" />
      </div>
    </div>
  );
};
