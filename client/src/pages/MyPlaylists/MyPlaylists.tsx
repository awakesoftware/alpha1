import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/auth-context';
import CreatePlaylist from './CreatePlaylist';
import PlaylistList from './PlaylistList';

import { useHttpClient } from '../../hooks/http-hook';
import ErrorModal from '../../components/UIElements/ErrorModal';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';


export default function MyPlaylists() {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [ playlists, setPlaylists ] = useState([]);


    useEffect(() => {
        const fetchPlaylists = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/playlists/user/${auth.userId}`,
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
        <div className='playlist-parent'>
            <section>
                <h1>Create a Playlist</h1>
                <CreatePlaylist  />
            </section>

            <section>
                <h1>My Created Playlists</h1>

                <ErrorModal error={error} onClear={clearError} />

                {
                    isLoading && (
                        <div className='center'>
                            <LoadingSpinner  />
                        </div>
                    )
                }

                {
                    !isLoading && playlists &&
                    <PlaylistList playlists={playlists} />
                }

            </section>

        </div>
    )
}
