import React from 'react';
import ReactDOM from 'react-dom';

const Backdrop = (props: { onClick: React.MouseEventHandler<HTMLDivElement>; }) => {
  return ReactDOM.createPortal(
    <div className="backdrop" onClick={props.onClick}></div>,
    document ? document.getElementById('backdrop-hook') : null
  );
};

export default Backdrop;