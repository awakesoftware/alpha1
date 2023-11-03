import React, { useState, useContext } from 'react'
import { AuthContext } from '../../../context/auth-context';

export default function ChangeTheme() {
    const [ darkTheme, setDarkTheme ] = useState(false);

    const auth = useContext(AuthContext);


    const toggleTheme = () => {
        setDarkTheme(prevTheme => !prevTheme);
    }

    return (
        <div className={ darkTheme === false ? `theme-light` : `theme-dark` } >
            <h3>Change Theme</h3>
            <label className="switch">
                <input type="checkbox" onClick={ toggleTheme } />
                <span className="slider round"/>
            </label>
            <p><b>Current: </b>{ darkTheme === false ? 'Light Theme' : 'Dark Theme' }</p>
        </div>
    )
}
