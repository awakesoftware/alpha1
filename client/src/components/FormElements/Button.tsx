import { LocationDescriptor, Location } from 'history';
import React from 'react';
import { Link } from 'react-router-dom';

interface PropType {
  href?: string, 
  size?: any, 
  color?: any, 
  inverse?: any, 
  danger?: any, 
  children?: {}, 
  to?: LocationDescriptor<unknown> | ((location: Location<unknown>) => LocationDescriptor<unknown>), 
  type?: string, 
  onClick?: React.MouseEventHandler<HTMLButtonElement>, 
  disabled?: boolean
}

const Button = (props: PropType) => {
  if (props.href) {
    return (
      <a
        className={`button button--${props.size || 'default'} ${`button--color--${props.color || 'button--color--red'}`} ${props.inverse &&
          'button--inverse'} ${props.danger && 'button--danger'}`}
        href={props.href}
      >
        {props.children}
      </a>
    );
  }
  if (props.to) {
    return (
      <Link
        to={props.to}
        // exact={props.exact}
        className={`button button--${props.size || 'default'} ${`button--color--${props.color || 'button--color--red'}`} ${props.inverse &&
          'button--inverse'} ${props.danger && 'button--danger'}`}
      >
        {props.children}
      </Link>
    );
  }
  return (
    <button
      className={`button button--${props.size || 'default'} ${`button--color--${props.color || 'button--color--red'}`} ${props.inverse &&
        'button--inverse'} ${props.danger && 'button--danger'}`}
      typeof={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
