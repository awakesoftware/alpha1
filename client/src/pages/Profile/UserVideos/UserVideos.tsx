import React, { useContext, useEffect, useState } from 'react';
import List from '../../../components/VideoDisplays/Standard/List';
import { useHttpClient } from '../../../hooks/http-hook';
import ErrorModal from '../../../components/UIElements/ErrorModal';
import LoadingSpinner from '../../../components/UIElements/LoadingSpinner';
import { AuthContext } from '../../../context/auth-context';

export default function UserVideos() {
    const auth = useContext( AuthContext );

    const [ loadedVideos, setLoadedVideos ] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const userId = auth.userId;

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/videos/user/public/${userId}`,
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
    }, [ sendRequest, userId ]);

    return (
        <div className='profile-videos'>
            <h2 className='title'>My Public Videos</h2>

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
                <List videos={loadedVideos} text='No Videos Posted' />
            }
        </div>
    )
}
