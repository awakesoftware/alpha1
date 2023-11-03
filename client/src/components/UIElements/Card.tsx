import React from 'react';

const Card = (props: { className: string; style: React.CSSProperties; children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal; }) => {
  return (
    <div className={`card${props.className ? ' ' + props.className : ''}`} style={props.style}>
      {props.children}
    </div>
  );
};

export default Card;
