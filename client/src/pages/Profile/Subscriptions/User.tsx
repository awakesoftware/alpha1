import React from 'react';
import { Link } from 'react-router-dom';

export default function User(props) {

    const userss = props.users.map(u => (
        <li>
            <Link to={`/user/${u._id}`} >
                <img className='user-image' src={`http://localhost:5000/${u.image}`} />
                <p>{u.username}</p>
            </Link>
        </li>
    ))

    return (
        <ul className='sub-icons'>
            {userss}
        </ul>
    )
}
