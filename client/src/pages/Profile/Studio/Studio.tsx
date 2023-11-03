import React, { useContext, useEffect, useState } from 'react';
import StudioList from './StudioList';
import { useHttpClient } from '../../../hooks/http-hook';
import ErrorModal from '../../../components/UIElements/ErrorModal';
import LoadingSpinner from '../../../components/UIElements/LoadingSpinner';
import { AuthContext } from '../../../context/auth-context';


export default function Studio() {
    const auth = useContext( AuthContext );

    const [ loadedVideos, setLoadedVideos ] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const userId = auth.userId;

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/videos/user/${userId}`,
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    }    
                );
                setLoadedVideos(responseData.videos);

            } catch (error) {  }
        }
        fetchVideos();
    }, [ sendRequest, userId ])

    return (
        <>
            <h2 className='title'>Your Studio</h2>

            <ErrorModal error={error} onClear={clearError} />

            {
                isLoading && (
                    <div className='center'>
                        <LoadingSpinner  />
                    </div>
                )
            }

            {
                !isLoading && loadedVideos &&
                <StudioList vids={loadedVideos} />
            }
        </>
    )
}
