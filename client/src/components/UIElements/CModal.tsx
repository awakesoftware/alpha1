import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import Button from '../FormElements/Button';
import { CSSTransition } from "react-transition-group";

interface PropType { 
  onClose: {
    (): void; 
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void; 
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void; 
  }; 
  show: boolean; 
  width?: any; 
  title: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal; 
  children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal; 
  className?: any
}

const CModal = (props: PropType) => {
  const closeOnEscapeKeyDown = (e: { charCode: any; keyCode: any; }) => {
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
      <div className="cmodal" onClick={props.onClose}>
        <div style={{width: props.width}} className="cmodal-content" onClick={e => e.stopPropagation()}>
          <div className="cmodal-header">
            <h4 className="cmodal-title">{props.title}</h4>
          </div>
          <div className="cmodal-body">{props.children}</div>
          <div className="cmodal-footer">
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

export default CModal;
