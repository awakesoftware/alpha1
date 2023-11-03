import React, { useContext, useEffect, useState } from 'react';
import Button from '../../../components/FormElements/Button';
import { useHttpClient } from '../../../hooks/http-hook';
import  { AuthContext } from '../../../context/auth-context';

export default function ChangePassword() {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [ password, setPassword ] = useState('');

    // useEffect(() => {
    //     const getPassword = async () => {
    //         const responseData = await sendRequest(
    //             `http://localhost:5000/api/users/password/${auth.userId}`,
    //             'GET',
    //             null,
    //             {
    //                 Authorization: 'Bearer ' + auth.token
    //             }
    //         );
    
    //         setPassword(responseData);
    //     }
    //     getPassword();

    // }, [sendRequest])

    return (
        <div className='change-password'>
            {/* <button onClick={() => { console.log(password); }} >Password</button> */}
            <form>
                <h3>Change Password</h3>
                <label>
                    Old Password
                    <input
                        // placeholder='Old password...'
                    />
                </label>
                <label>
                    New Password
                    <input
                        // placeholder='New password...'
                    />
                </label>
                <label>
                    New Password
                    <input
                        // placeholder='New password...'
                    />
                </label>
                <Button type='submit' color={'blue'}>
                    Change
                </Button>
            </form>
        </div>
    )
}
