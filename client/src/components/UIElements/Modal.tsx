import React, { ReactPortal } from 'react';
import ReactDOM, { createPortal } from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import Backdrop from './Backdrop';

const ModalOverlay: any = (props: { className: any; style: React.CSSProperties; headerClass: any; header: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal; onSubmit: React.FormEventHandler<HTMLFormElement>; contentClass: any; children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal; footerClass: any; footer: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal; }) => {
  const content = (
    <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.headerClass}`}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={
          props.onSubmit ? props.onSubmit : event => event.preventDefault()
        }
      >
        <div className={`modal__content ${props.contentClass}`}>
          {props.children}
        </div>
        <footer className={`modal__footer ${props.footerClass}`}>
          {props.footer}
        </footer>
      </form>
    </div>
  );
  return ReactDOM.createPortal(content, document.getElementById('modal-hook'));
};

const Modal = (props: { header: string; footer: any; children: any; show: boolean; onCancel: React.MouseEventHandler<HTMLDivElement>; }) => {
  return (
    <>
      {props.show && <Backdrop onClick={props.onCancel} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={200}
        classNames="modal"
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </>
  );
};

export default Modal;
