import React from 'react';

const Avatar = (props: { className: string; style: React.CSSProperties; image: string; alt: string; width: any; }) => {
  return (
    <div className={`avatar ${props.className}`} style={props.style}>
      <img
        className={props.className}
        src={props.image}
        alt={props.alt}
        style={{ width: props.width, height: props.width }}
      />
    </div>
  );
};

export default Avatar;
