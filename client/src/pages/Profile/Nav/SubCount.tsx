import React, { useContext } from 'react';
import { AuthContext } from '../../../context/auth-context';

export default function SubCount(props) {
    const auth = useContext(AuthContext);

    return (
        <span>
            <h2>{auth.firstName} {auth.lastName}</h2>
            <p>@{auth.username}</p>
            <h4>{Object.entries(props).length} subscribers</h4>
        </span>
    )
}
