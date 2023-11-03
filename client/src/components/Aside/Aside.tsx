import React from 'react';
import { NavLink } from 'react-router-dom';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

export default function SideBarLink() {
    return (
        <ul className='sidebar'>

            <Tippy placement='right' arrow={false} delay={0} content='Subscriptions Content'>
                <li>
                    <NavLink to='/subscriptions' activeClassName='active'>
                        <i className="fas fa-tv"></i><br/>
                    </NavLink>
                </li>
            </Tippy>
                
            <hr style={{ width: '50%', margin: 'auto' }} />

            <Tippy placement='right' arrow={false} delay={0} content='My Playlists'>
                <li>
                    <NavLink to='/playlists'>
                        <i className='fas fa-list'></i><br/>
                    </NavLink>
                </li>
            </Tippy>

            <hr style={{ width: '50%', margin: 'auto' }} />

            <Tippy placement='right' arrow={false} delay={0} content='Watch Later'>
                <li>
                    <NavLink to='/later'>
                        <i className='fas fa-clock'></i><br/>
                    </NavLink>
                </li>
            </Tippy>

            <hr style={{ width: '50%', margin: 'auto' }} />

            <Tippy placement='right' arrow={false} delay={0} content='Liked Videos'>
                <li>
                    <NavLink to='/liked'>
                        <i className='fas fa-thumbs-up'></i><br/>
                    </NavLink>
                </li>
            </Tippy>

            <hr style={{ width: '50%', margin: 'auto' }} />

            <Tippy placement='right' arrow={false} delay={0} content='Trending'>
                <li>
                    <NavLink to='/trending'>
                        <i className="fas fa-bolt"></i><br/>
                    </NavLink>
                </li>
            </Tippy>

            <hr style={{ width: '50%', margin: 'auto' }} />

            <Tippy placement='right' arrow={false} delay={0} content='History'>
                <li>
                    <NavLink to='/history'>
                        <i className='fas fa-history'></i><br/>
                    </NavLink>
                </li>
            </Tippy>
                
        </ul>
    )
}
