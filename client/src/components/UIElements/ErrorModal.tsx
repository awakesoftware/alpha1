import React from 'react';

import Modal from './Modal';
import Button from '../FormElements/Button';

interface PropType { 
  onClear: { 
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void; 
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void; 
  }; 
  error?: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal; 
}

const ErrorModal = (props: PropType) => {
  return (
    <Modal
      onCancel={props.onClear}
      header="An Error Occurred!"
      show={!!props.error}
      footer={<Button onClick={props.onClear} color='red'>Close</Button>}
    >
      <p>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;
