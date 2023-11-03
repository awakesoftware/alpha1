import React, { useEffect, useContext, useState } from 'react';
import Button from '../../components/FormElements/Button';
import axios from 'axios';
import { AuthContext } from '../../context/auth-context';
import { useHttpClient } from '../../hooks/http-hook';
import ErrorModal from '../../components/UIElements/ErrorModal';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';
import List from '../../components/VideoDisplays/Standard/List'
import { toast } from 'react-toastify';

import { useHistory } from 'react-router-dom';

export default function MyLikedVideos() {
    // const url = window.location.href;
    // const id = url.split('/').slice(-1).toString();

    const history = useHistory();

    const auth = useContext(AuthContext);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [ loadedVideos, setLoadedVideos ] = useState();
    const [ loadedUsers, setLoadedUsers ] = useState();
    const [ clearToggle, setClearToggle ] = useState(false);


    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/videos/history/user/${auth.userId}`,
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

    const handleClear = async () => {
        try {
            axios({
                method: 'DELETE',
                url: `http://localhost:5000/api/videos/history`,
                headers: {
                    Authorization: 'Bearer ' + auth.token
                }
            })

            toast.info('History cleared.', {position: toast.POSITION.BOTTOM_LEFT});
            history.push(`/`);
            
        } catch (error) {
            toast.error('Failed to clear history.', { position: toast.POSITION.TOP_CENTER });
        }

    }

    const handleClearToggle = () => {
        setClearToggle(prevToggle => !prevToggle);
    }


    return (
        <div className='history' >
            <h1>History</h1>
                <div>
                    {
                        clearToggle === false
                        ?
                            <i className="fas fa-ellipsis-h" onClick={handleClearToggle}/>
                        :
                            <i className="far fa-times-circle" onClick={handleClearToggle}/>
                    }
                    

                    {
                        clearToggle === true &&
                        <Button onClick={handleClear} color={'orange'}>
                            Clear history
                        </Button>
                    }
                </div>


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
                <List videos={loadedVideos} text='No Videos in Watch History' />
            }

        </div>
    )
}
