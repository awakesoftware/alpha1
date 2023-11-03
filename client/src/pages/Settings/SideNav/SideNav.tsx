import React from 'react';
import { NavLink } from 'react-router-dom';

export default function SideNav() {
    return (
        <div className="settings-sidenav">
            <NavLink className='sidenav-btn' to='/settings/account' activeClassName='active'>
                <i className="fas fa-info-circle icon-dark"/> Account
            </NavLink>
        
            <NavLink className='sidenav-btn' to='/settings/password'>
                <i className="fas fa-fingerprint icon-dark"/> Password
            </NavLink>

            <NavLink className='sidenav-btn' to='/settings/payment'>
                <i className="fas fa-wallet icon-dark"/> Payment
            </NavLink>

            <NavLink className='sidenav-btn' to='/settings/appearance'>
                <i className="fas fa-palette icon-dark"/> Theme
            </NavLink>
            <NavLink className='sidenav-btn' to='/settings/contact'>
                <i className="fas fa-envelope icon-dark"/> Contact
            </NavLink>
        </div>
    )
}