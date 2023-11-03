import React, { useEffect, useContext, useState } from 'react'
import { AuthContext } from '../../context/auth-context';
import { useHttpClient } from '../../hooks/http-hook';
import ErrorModal from '../../components/UIElements/ErrorModal';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';
import List from '../../components/VideoDisplays/Standard/List';

export default function MyWatchLater() {

    const auth = useContext(AuthContext);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [ loadedVideos, setLoadedVideos ] = useState();


    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/videos/later/user/${auth.userId}`,
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
    }, [ sendRequest ])

    


    return (
        <div className='watch-later'>
            <h1>Watch Later</h1>

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
                <List videos={loadedVideos} text='No Videos in Watch Later' />
            }

        </div>
    )
}
