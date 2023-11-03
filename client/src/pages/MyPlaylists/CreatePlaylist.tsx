import React, { useContext, useState } from 'react';
import Button from '../../components/FormElements/Button';
import axios from 'axios';

import ErrorModal from '../../components/UIElements/ErrorModal';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';
import { AuthContext } from '../../context/auth-context';
import { useHttpClient } from '../../hooks/http-hook'
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';


export default function CreatePlaylist() {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const history = useHistory();


    const [ playlistName, setPlaylistName ] = useState('');
    const [ playlistAbout, setPlaylistAbout ] = useState('');
    const [ privacy, setPrivacy ] = useState(false);

    // Playlist name state
    const handleChangeName = (event) => {
        setPlaylistName(event.target.value);
    }

    // Playlist name state
    const handleChangeAbout = (event) => {
        setPlaylistAbout(event.target.value);
    }

    // Privacy state
    const handleChangePrivacy = (event) => {
        setPrivacy(event.target.value);
    }


    // Submit form
    const onSubmit = async (event) => {
        event.preventDefault();

        if( !auth.token || !auth.userId || !auth.username ) {
            return toast.error('Please log in.', { position: toast.POSITION.TOP_CENTER });
        }

        const variables = {
            creator: auth.userId,
            name: playlistName,
            about: playlistAbout,
            private: privacy
        }

        try {
            const headers = {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth.token
            }

            await axios.post(`http://localhost:5000/api/playlists/${auth.userId}`, variables, {
                headers: headers
            }).then(res => {
                    toast.success('Playlist created successfully.', { position: toast.POSITION.BOTTOM_LEFT });
                    history.push(`/playlist/${res.data.playlist._id}`);
                }).catch(error => { toast.error('Internal error, please try again.', { position: toast.POSITION.TOP_CENTER });
            })

        } catch (error) {
            toast.error('Internal error, please try again.', { position: toast.POSITION.TOP_CENTER });
        }

    }


    return (
        <>

            <ErrorModal error={error} onClear={clearError} />

            <form onSubmit={onSubmit}>

                {
                    isLoading && <LoadingSpinner asOverlay />
                }

                <input
                    id='name'
                    className=''
                    type='text'
                    placeholder='Playlist name...'
                    autoComplete='off'
                    required
                    minLength={5}
                    onChange={handleChangeName}
                />


                <input
                    id='about'
                    className=''
                    type='text'
                    placeholder='Playlist description...'
                    autoComplete='off'
                    required
                    minLength={5}
                    onChange={handleChangeAbout}
                />


                <>
                    <label>
                        Privacy: 
                        <select required onChange={handleChangePrivacy}>
                            <option value={'false'}>Public</option>
                            <option value={'true'}>Private</option>
                        </select>
                    </label>
                </>


                <Button type='submit' color={'blue'}>
                    <i className="fas fa-plus"> Create Playlist</i>
                </Button>
            </form>
        </>
    )
}
