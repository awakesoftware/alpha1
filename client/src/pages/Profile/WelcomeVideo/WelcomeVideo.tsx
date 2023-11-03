import React, { useEffect, useContext, useState } from 'react';
import Button from '../../../components/FormElements/Button';
import VModal from '../../../components/UIElements/VModal';
import { useHistory } from 'react-router-dom';

import { AuthContext } from '../../../context/auth-context';
import { useHttpClient } from '../../../hooks/http-hook';
import LoadingSpinner from '../../../components/UIElements/LoadingSpinner';
import { toast } from 'react-toastify';
import List from '../../../components/VideoDisplays/Standard/List';

export default function WelcomeVideo() {
    const auth = useContext(AuthContext);
    const history = useHistory();

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [ videos, setVideos ] = useState();
    const [ assignedWelcomeVideo, setAssignedWelcomeVideo ] = useState(false);


    // useEffect(() => {
    //     const fetchAbout = async () => {
    //         try {
    //             const responseData = await sendRequest(
    //                 `http://localhost:5000/api/videos/welcome/user/${auth.userId}`,
    //                 'GET',
    //                 null,
    //                 {
    //                     Authorization: 'Bearer ' + auth.token
    //                 } 
    //             );
                
    //             // console.log(responseData);
    //             setWelcomeVid(responseData.welcomeVideo);
                
    //         } catch (error) {  }
            
    //     }

    //     fetchAbout();
    // }, [ sendRequest ])

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/videos/user/${auth.userId}`,
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    } 
                );
                
                // console.log(responseData.videos);
                setVideos(responseData.videos);
                
            } catch (error) {  }
            
        }

        fetchVideos();
    }, [ sendRequest ])

    return (
        <div>
            <Button color='blue' onClick={() => {
                setAssignedWelcomeVideo(true)
            }}>
                Set a welcome video
            </Button>

            <VModal title="Select video" onClose={() => setAssignedWelcomeVideo(false)} show={assignedWelcomeVideo}>
                <List
                    videos={videos}
                    text='No Welcome Video'
                />
            </VModal>
        </div>
    )
}