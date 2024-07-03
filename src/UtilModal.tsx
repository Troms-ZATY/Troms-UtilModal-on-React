import { FC, ReactNode, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

import style from "./UtilModal.module.css";

interface UtilModalProps {
  children: ReactNode;
  isOpen?: boolean;
  onClose?: () => void;
}

const UtilModal: FC<UtilModalProps> = (props) => {
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let portalDiv = document.getElementById('portal-root');
    if (!portalDiv) {
      portalDiv = document.createElement('div');
      portalDiv.setAttribute('id', 'portal-root');
      portalDiv.style.position = 'relative';
      portalDiv.style.zIndex = '99999';
      document.body.appendChild(portalDiv);
    }
    setPortalRoot(portalDiv);

    return () => {
      if (portalDiv && portalDiv.parentNode) {
        portalDiv.parentNode.removeChild(portalDiv);
      }
    };
  }, []);

  if (!portalRoot) return null;

  return ReactDOM.createPortal(<ModalContent {...props} />, portalRoot);
};

export default UtilModal;

const ModalContent: FC<UtilModalProps> = (props) => {
  const { children, isOpen, onClose } = props;
  const [isView, setIsView] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';

    if (!isOpen) return;

    setIsView(true);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (focusableElements.length === 0) {
          event.preventDefault();
          return;
        }

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleClosing = () => {
    setIsView(false);
    setTimeout(() => {
      onClose && onClose();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    isOpen && (
      <div className={`${style.wrapper} ${isView ? style.isOpen : ''}`} ref={modalRef}>
        <div aria-hidden={true} onClick={handleClosing} className={style.background}></div>
        <div className={style.content}>
          <header className={style.header}>
            <button className={style.cancelButton} onClick={handleClosing}>
              <svg className={style.cancelButtonIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path d="M480-424.35 321.33-265.67Q308.65-253 294-253.75q-14.65-.75-27.33-13.42-12.17-12.68-11.92-27.58.25-14.9 12.42-27.08L424.35-480 266.17-639.17Q254-651.35 254.5-666.25q.5-14.9 12.67-27.58 12.18-12.67 27.33-12.92 15.15-.25 27.83 12.42L480-535.65l158.67-158.68q12.68-12.67 27.83-12.42 15.15.25 27.83 12.92 12.17 12.68 11.92 27.58-.25 14.9-12.42 27.08L535.65-480l158.18 159.17Q706-308.65 706-294.25q0 14.4-12.17 27.08-12.18 12.67-27.33 12.92-15.15.25-27.83-12.42L480-424.35Z"/>
              </svg>
            </button>
          </header>
          <div className={style.main}>{children}</div>
        </div>
      </div>
    )
  );
};
