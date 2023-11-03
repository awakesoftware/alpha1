import React, { useEffect, useContext, useState } from 'react'
import { AuthContext } from '../../context/auth-context';
import { useHttpClient } from '../../hooks/http-hook';
import ErrorModal from '../../components/UIElements/ErrorModal';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';

import List from '../../components/VideoDisplays/Standard/List';

export default function Subscriptions() {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [ loadedVideos, setLoadedVideos ] = useState();

    useEffect(() => {
        const fetchSubbedTo = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/videos/subscribers/user/${auth.userId}`,
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    } 
                );
            
                setLoadedVideos(responseData.finalVideos);
                
                
            } catch (error) {  }
            
        }

        fetchSubbedTo();
    }, [])

    return (
        <div className='sub-uploads'>
            <h1>Subscription Uploads</h1>

            <ErrorModal error={error} onClear={clearError} />

            {
                isLoading && (
                    <div className='center'>
                        <LoadingSpinner />
                    </div>
                )
            }

            {
                !isLoading && loadedVideos &&
                <List videos={loadedVideos} text='No Subscription Content'/>
            }

        </div>
    )
}

