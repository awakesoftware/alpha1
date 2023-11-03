import React, {useContext, useEffect, useState} from 'react';
import { AuthContext } from '../../context/auth-context';
import { useHttpClient } from '../../hooks/http-hook';
import List from '../VideoDisplays/Standard/List';
import ErrorModal from '../UIElements/ErrorModal';
import LoadingSpinner from '../UIElements/LoadingSpinner';

export default function Recommended(props: { id: string; category: string; }) {
    const { id, category } = props;
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();


    const [ recommendedVideos, setRecommendedVideos ] = useState(null);

    useEffect(() => {
        const fetchRecommendedVideos = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/videos/category/${id}/${category}`,
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    } 
                );
                
                setRecommendedVideos(responseData.videos);
                
            } catch (error) {  }
            
        }

        (id !== undefined && id !== null) && (category !== undefined && category !== null) && fetchRecommendedVideos();

    }, [ sendRequest, id, category ])

    return (
        <div className='recommended'>
            {/* <h2>Recommended</h2> */}
            <ErrorModal error={error} onClear={clearError} />

            { isLoading && 
                <div className='center'>
                    <LoadingSpinner />
                </div>
            }

            {
                !isLoading && recommendedVideos &&
                <List
                    videos={recommendedVideos}
                    text={'No recommended videos found.'}
                />
            }
        </div>
    )
}
