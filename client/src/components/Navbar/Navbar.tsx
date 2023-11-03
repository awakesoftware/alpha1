import React, { useContext, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';
import SearchBar from './SearchBar/SearchBar';

import RenderNotifications from '../../pages/Notifications/RenderNotifications';

import SideDrawer from './SideDrawer/SideDrawer';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Dropdown from './Dropdown/Dropdown';
import LoginDropdown from './DropdownMenus/LoginDropdown';

export default function NavLinks () {
    const auth = useContext(AuthContext);

    return (
        //*This ul is in nav on App.js
        <nav className='nav-links'>
            <section className='nav-logo-section'>
                <li className='awake'>
                    <NavLink to='/' exact>
                        <img className='nav-logo-dark' src='http://localhost:5000/awakelogoTransparent.png' alt='logo'/>
                        <img className='nav-logo-light' src='http://localhost:5000/awakelogo.png' alt='logo'/>
                    </NavLink>
                </li>
            </section>

            {auth.isLoggedIn && (
                <>
                    {/* <SideDrawer/> */}

                    <section className='searchbar-section'>
                        <SearchBar />
                    </section>

                    <section className='links'>
                        <Dropdown 
                            className='profile-dropdown'
                            dropButtonContent={
                                <img
                                    className='profile-dropdown-btn-img'
                                    src={`http://localhost:5000/${auth.image}`} 
                                    alt={auth.firstName} 
                                    style={{width: '50px'}}
                                />
                            }
                            dropMenuClassName='profile-dropdown-menu'
                        >
                            <NavLink to={'/profile/home'}>
                                <i className="fas fa-user"/>
                                <span>Profile</span>
                            </NavLink>
                            <hr/>
                            <NavLink to={'/activity'}>
                                <i className="fas fa-clipboard-list"/>
                                <span>My Activity</span>
                            </NavLink>
                            <hr/>
                            <NavLink to={'/settings/account'}>
                                <i className="fas fa-cog"/>
                                <span>Settings</span>
                            </NavLink>
                            <hr/>
                            <NavLink onClick={auth.logout} to={{
                                pathname: '/auth',
                                state: {
                                    loginView: true
                                }
                            }}>
                                <i className='fas fa-sign-out-alt'/>
                                <span>Logout</span>
                            </NavLink>
                        </Dropdown>
                        <Dropdown 
                            className='notifications-dropdown'
                            dropButtonContent={
                                <Tippy arrow={false} delay={0} content='Notifications'>
                                    <button className='notifications-drop-btn dropdown-btn'>
                                        <i className='fas fa-bell notifications-icon'></i>
                                    </button>
                                </Tippy>
                            }
                            dropMenuClassName='notifications-dropdown-menu'
                        >
                            <NavLink to={'/notifications'}><h3>Notifications</h3></NavLink>
                            <RenderNotifications items={6}/>
                            
                        </Dropdown>

                        <article className='wide-nav'>
                            <Tippy placement='bottom' arrow={false} delay={0} content='Upload'>
                                <NavLink to='/profile/upload' className='fa-stack' activeClassName='active' exact >
                                    <i className="fas fa-video fa-stack-lg" style={{fontSize: '1.1em'}}></i>
                                </NavLink>
                            </Tippy>
                        </article>
                    </section>


                </>
            )}
            {!auth.isLoggedIn && (
                <>
                    <section></section>
                    <section className='links logged-out-navlinks'>
                        {/* <Tippy placement='bottom' arrow={false} delay={0} content='Login'>
                            <NavLink className='dropdown-btn' to={{
                                pathname: '/auth',
                                state: {
                                    loginView: true
                                }
                            }}>
                                <i className="fas fa-door-open" style={{fontSize: '2.5em'}}></i>
                            </NavLink>
                        </Tippy> */}
                        <Dropdown
                            //* Dropdown Login Form
                            className='signin-dropdown'
                            dropButtonContent={
                                <Tippy placement='bottom' arrow={false} delay={0} content='Login'>
                                    <button className='dropdown-btn'>
                                        <i className="fas fa-door-open" style={{fontSize: '2.5em'}}></i>
                                    </button>
                                </Tippy>
                            }
                            dropMenuClassName='signin-dropdown-menu'
                        >
                            <LoginDropdown/>
                        </Dropdown>
                        <article>
                            <Tippy placement='bottom' arrow={false} delay={0} content='Signup'>
                                <li className='wide-nav'>
                                    <NavLink to={{
                                        pathname: '/auth',
                                        state: {
                                            loginView: false
                                        }
                                    }} className='fa-stack' activeClassName='active' exact >
                                        <i className="fas fa-user-plus" style={{fontSize: '2em'}}></i>
                                    </NavLink>
                                </li>
                            </Tippy>
                        </article>
                    </section>
                </>
            )}
        </nav>
    );
};
