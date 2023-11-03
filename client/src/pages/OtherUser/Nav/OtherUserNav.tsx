import React from 'react';
import {
    NavLink
} from "react-router-dom";

// import './OtherUserNav.css';

export default function OtherUserNav(props) {
    return (
        <ul className='profile-nav'>
            <article>
                <img 
                    className='profile-image'
                    src={`http://localhost:5000/${props.loadedUser.image}`}
                />
                <span>
                    <h2>{props.loadedUser.firstName} {props.loadedUser.lastName}</h2>
                    <p>@{props.loadedUser.username}</p>
                </span>
            </article>



            <menu>
                <NavLink to={`/user/${props.loadedUser.id}`} activeStyle={{color: '#a11e2d', borderBottom: '2px solid currentColor'}}>
                    <i className="fas fa-home"/> Home
                </NavLink>
                <NavLink to='/user/videos' activeStyle={{color: '#a11e2d', borderBottom: '2px solid currentColor'}}>
                    <i className="fas fa-film"/> {props.loadedUser.firstName}'s Videos
                </NavLink>
                <NavLink to='/user/playlists' activeStyle={{color: '#a11e2d', borderBottom: '2px solid currentColor'}}>
                    <i className="fas fa-list"/> {props.loadedUser.firstName}'s Playlists
                </NavLink>
                <NavLink to='/user/about' activeStyle={{color: '#a11e2d', borderBottom: '2px solid currentColor'}}>
                    <i className="fas fa-info-circle"/> About {props.loadedUser.firstName}
                </NavLink>
            </menu>
        </ul>
    );
}
