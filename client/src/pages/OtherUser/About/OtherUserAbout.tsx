import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/auth-context';
import { useHttpClient } from '../../../hooks/http-hook';
import LoadingSpinner from '../../../components/UIElements/LoadingSpinner';

export default function OtherUserAbout(props) {
    const auth = useContext(AuthContext);

    const [ about, setAbout ] = useState('');

    const { isLoading, error, sendRequest, clearError } = useHttpClient();


    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/users/about/${props.loadedUser.id}`,
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    } 
                );
                
                setAbout(responseData.user.about);
                
            } catch (error) {  }
            
        }

        fetchAbout();
    }, [ sendRequest ])

    return (
        <div>
            <h2 className='title'>About</h2>

            <h4>{
                isLoading
                ?
                    <LoadingSpinner/>
                :
                    about === ''
                    ?
                        "Welcome to my page!"
                    :
                        about
            }</h4>
        </div>
    )
}