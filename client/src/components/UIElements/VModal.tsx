import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import Button from '../FormElements/Button';
import { CSSTransition } from "react-transition-group";

const VModal = props => {
  const closeOnEscapeKeyDown = e => {
    if ((e.charCode || e.keyCode) === 27) {
      props.onClose();
    }
  };

  useEffect(() => {
    document.body.addEventListener("keydown", closeOnEscapeKeyDown);
    return function cleanup() {
      document.body.removeEventListener("keydown", closeOnEscapeKeyDown);
    };
  }, []);

  return ReactDOM.createPortal(
    <CSSTransition
      in={props.show}
      unmountOnExit
      timeout={{ enter: 0, exit: 300 }}
    >
      <div className="vmodal" onClick={props.onClose}>
        <div className="vmodal-content" onClick={e => e.stopPropagation()}>
          <div className="vmodal-header">
            <h4 className="vmodal-title">{props.title}</h4>
          </div>
          <div className="vmodal-body">{props.children}</div>
          <div className="vmodal-footer">
            <Button onClick={props.onClose} color={'red'}>
                Close
            </Button>
          </div>
        </div>
      </div>
    </CSSTransition>,
    document.getElementById("root")
  );
};

export default VModal;
