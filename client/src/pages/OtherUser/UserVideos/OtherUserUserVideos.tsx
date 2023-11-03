import React, { useContext, useEffect, useState } from 'react';
import List from '../../../components/VideoDisplays/Standard/List';
import { useHttpClient } from '../../../hooks/http-hook';
import ErrorModal from '../../../components/UIElements/ErrorModal';
import LoadingSpinner from '../../../components/UIElements/LoadingSpinner';
import { AuthContext } from '../../../context/auth-context';

export default function OtherUserUserVideos(props) {

    const auth = useContext(AuthContext);

    const [ loadedVideos, setLoadedVideos ] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();


    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/videos/user/public/${props.loadedUser.id}`,
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
    }, [ sendRequest, props.loadedUser.id ])

    return (
        <div className='profile-videos'>
            <h2 className='title'>{props.loadedUser.firstName}'s Public Videos</h2>

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
