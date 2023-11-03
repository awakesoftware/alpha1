import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';

import { AuthContext } from '../../../context/auth-context';

export default function SideDrawer() {
    const auth = useContext(AuthContext);
    const [sideDrawerIsOpen, setSideDrawerIsOpen] = useState(false);


    //* This component is only shown on small screens
    return (
        <>
            <button className='narrow-nav drawer-btn' onClick={() => {setSideDrawerIsOpen(!sideDrawerIsOpen)}}>
                <p><i className="arrow right"></i></p>
            </button>
            {sideDrawerIsOpen && (
                <section className='side-drawer-container'>
                    <div className='side-drawer'>
                        <li className='side-links'>
                            <NavLink to='/art' exact onClick={() => {setSideDrawerIsOpen(false)}}>
                                Art
                            </NavLink>
                        </li>
                        <li className='side-links'>
                            <NavLink to='/profile' exact onClick={() => {setSideDrawerIsOpen(false)}}>
                                Profile
                            </NavLink>
                        </li>
                        <li className='side-links' onClick={() => {setSideDrawerIsOpen(false)}}>
                            <button className='logout-btn' onClick={auth.logout}>Logout</button>
                        </li>
                    </div>
                    <div className='blank-space' onClick={() => {setSideDrawerIsOpen(false)}}/>
                </section>
            )}
        </>
    )
}
