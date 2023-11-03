import React, { useState } from 'react';
import { useHttpClient } from '../../../hooks/http-hook';
import { AuthContext } from '../../../context/auth-context';
import SearchBy from './SearchBy';

export default function Admin() {
    const [ searchText, setSearchText ] = useState('');

    const handleUserSearch = (e) => {
        setSearchText(e.target.value)
    }

    return (
        <div>
            <div>
                <h2>Admin</h2>

                <br/> 

                <SearchBy />
            </div>

        </div>
    )
}
