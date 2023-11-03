import React, { useEffect, useState, useContext } from 'react';
import ErrorModal from '../../components/UIElements/ErrorModal';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';
import List from '../../components/VideoDisplays/Standard/List'
import { useHttpClient } from '../../hooks/http-hook';
import { AuthContext } from '../../context/auth-context';

interface LoadedVideo {
    _id: string,
    title: string,
    desctiption: string,
    thumbnailPath: string,
    creator: {
        username: string,
        image: string
    },
    category: string,
    posted: string,
    views: number

} //* Not proper type def, figure it out!!!

export default function Home() {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [ loadedVideos, setLoadedVideos ] = useState/*<LoadedVideo[]>*/();

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const responseData = await sendRequest(
                    'http://localhost:5000/api/videos',
                    "GET",
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    }
                );
                
                setLoadedVideos(responseData.videos);
                
            } catch (error) {  }

        }
        fetchVideos();

    }, [ sendRequest ]);
    
    return (
        <div className='home'>
            <ErrorModal error={error} onClear={clearError} />

            { isLoading && 
                <div className='center'>
                    <LoadingSpinner />
                </div>
            }
                { !isLoading && loadedVideos && <List videos={loadedVideos} text='No Videos Posted' />}
        </div>
    )
};