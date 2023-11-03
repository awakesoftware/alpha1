import React, { useContext, useState, useEffect } from 'react';
import { useHttpClient } from '../../../hooks/http-hook';
import ErrorModal from '../../../components/UIElements/ErrorModal';
import LoadingSpinner from '../../../components/UIElements/LoadingSpinner';
import { AuthContext } from '../../../context/auth-context';
import List from '../../Displays/Playlist/Standard/List';

export default function OtherUserPlaylists(props) {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [ playlists, setPlaylists ] = useState(null);

    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/playlists/user/${props.loadedUser.id}`,
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    } 
                );
                
                setPlaylists(responseData.playlists);
                
            } catch (error) {  }

        }

        fetchPlaylists();

    }, [ sendRequest ])

    return (
        <div className='home'>
            <h2 className='title'>{props.loadedUser.firstName}'s Public Playlists</h2>

            <ErrorModal error={error} onClear={clearError} />

            
            {isLoading && (
                <div className='center'>
                    <LoadingSpinner  />
                </div>
            )}

            
            {(!isLoading && playlists) &&
            <List
                text='No playlists found.'
                playlists={playlists}
            />}
            
        </div>
    )
}
