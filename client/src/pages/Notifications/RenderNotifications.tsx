import React, { useContext, useEffect, useState } from 'react';
import RenderList from './RenderList';
import ErrorModal from '../../components/UIElements/ErrorModal';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../hooks/http-hook';
import { AuthContext } from '../../context/auth-context';


import { Link } from 'react-router-dom';


export default function RenderNotifications(props) {
    const auth = useContext(AuthContext);

    const [ notifications, setNotifications ] = useState();

    const { isLoading, error, sendRequest, clearError } = useHttpClient();


    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/notifications/user/${auth.userId}`,
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    } 
                );
                
                setNotifications(responseData.notifications.reverse()); //* reversed so that most recent appear first
                
            } catch (error) {  }
            
        }

        fetchNotifications();
    }, [sendRequest])

    return (
        <main>

            <ErrorModal error={error} onClear={clearError} />

            {
                isLoading && (
                    <div className='center'>
                        <LoadingSpinner  />
                    </div>
                )
            }

            {
                !isLoading && notifications &&
                    <RenderList
                        notifications={notifications}
                        items={props.items}
                    />
            }

            
        </main>
    )
}
