import React, { useContext, useEffect, useState } from 'react';
import Button from '../../components/FormElements/Button';
import List from '../Displays/Playlist/Standard/List';
import { Link, useHistory } from 'react-router-dom';
import ErrorModal from '../../components/UIElements/ErrorModal';
import CModal from '../../components/UIElements/CModal';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';
import { AuthContext } from '../../context/auth-context';
import { useHttpClient } from '../../hooks/http-hook';
import { toast } from 'react-toastify';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';


import axios from 'axios';


export default function Playlist(props) {
    const url = window.location.href;
    const id = url.split('/').slice(-1).toString();

    const history = useHistory();

    const auth = useContext(AuthContext);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [ loadedPlaylist, setLoadedPlaylist ] = useState({
        videos: [''],
        name: '',
        about: ''
    });
    const [ loadedName, setLoadedName ] = useState('');
    const [ loadedAbout, setLoadedAbout ] = useState('');
    const [ loadedPrivacy, setLoadedPrivacy ] = useState(Boolean);
    const [ loadedVideos, setLoadedVideos ] = useState([]);
    const [ toggleButton, setToggleButton ] = useState(false);
    const [ toggleEdit, setToggleEdit ] = useState(false);
    

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/playlists/${id}`,
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    } 
                );
                
                setLoadedPlaylist(responseData.playlist);
                setLoadedName(responseData.playlist.name)
                setLoadedAbout(responseData.playlist.about)
                setLoadedPrivacy(responseData.playlist.private)
                setLoadedVideos(responseData.playlist.videos);
                
            } catch (error) {  }
            
        }

        fetchPlaylist();
    }, [ sendRequest ])

    const mapVideos = () => {
        loadedPlaylist.videos.map(v => {
        })

    }

    const handleToggle = () => {
        setToggleButton(prevToggle => !prevToggle)
    }

    const handleEditToggle = () => {
        setToggleEdit(prevToggle => !prevToggle)
    }

    const handleDelete = async () => {
        try {
            axios({
                method: 'DELETE',
                url: `http://localhost:5000/api/playlists/${id}`,
                headers: {
                    Authorization: 'Bearer ' + auth.token
                }
            })

            toast.info('Playlist was deleted.', {position: toast.POSITION.BOTTOM_LEFT});
            history.push(`/`);
            
        } catch (error) {
            toast.error('Internal error, please try again.', { position: toast.POSITION.TOP_CENTER });
        }

    }

    useEffect(() => {
        setLoadedName(loadedPlaylist.name)
        setLoadedAbout(loadedPlaylist.about)
    }, [])

    const handleNameUpdate = (event) => {
        setLoadedName(event.target.value);
    }
    const handleAboutUpdate = (event) => {
        setLoadedAbout(event.target.value);
    }

    const handleUpdateSubmit = () => {
        if(loadedPlaylist.name === '' || loadedPlaylist.about === '') {
            toast.warn('Please add the required fields.', { position: toast.POSITION.TOP_CENTER });
            return;
        } else if(loadedPlaylist.name.length < 5 || loadedPlaylist.about.length < 5) {
            toast.info('Please ensure that both the title and description are at least 5 characters.', {position: toast.POSITION.BOTTOM_LEFT});
            return;
        } else {
            try {
                axios({
                    method: 'PUT',
                    url: `http://localhost:5000/api/playlists/${id}`,
                    data: {
                        name: loadedName,
                        about: loadedAbout
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + auth.token
                    }
                })
                toast.success('Playlist updated successfully.', { position: toast.POSITION.BOTTOM_LEFT });
                history.push(`/`);
                
            } catch (error) {
                toast.error('Internal error, please try again.', { position: toast.POSITION.TOP_CENTER });
            }
        }

    }

    const handlePrivacyOnChange = () => {
        if((loadedPrivacy === true )/* || (loadedPrivacy === 'true' )*/) {
            setLoadedPrivacy(false);
        } else if((loadedPrivacy === false ) || (loadedPrivacy === 'false' )) {
            setLoadedPrivacy(true);
        } else {
            return toast.error('Internal error, please try again.', { position: toast.POSITION.TOP_CENTER });;
        }

        axios({
            method: 'PUT',
            url: `http://localhost:5000/api/videos/privacy/${id}`,
            data: {
                private: loadedPrivacy
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth.token
            }
        }).then((res) => {
            // alert(res.message)
            toast.info('Playlist updated successfully.', {position: toast.POSITION.BOTTOM_LEFT});
            history.push(`/`);
        })
    }


    return (

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', textAlign: 'center', marginTop: '50px' }} >
            <div>
                <ErrorModal error={error} onClear={clearError} />

                { !isLoading && loadedPlaylist && 
                    <div>
                        {
                            toggleEdit === false
                            ?
                                <>
                                    <h1>{loadedPlaylist.name}</h1>
                                    <p>{loadedPlaylist.about}</p>
                                </>
                            :
                                <form onSubmit={handleUpdateSubmit} >
                                    <label>Title</label>
                                    <br/>
                                    <input
                                        id='name'
                                        type='text'
                                        placeholder={loadedName}
                                        minLength={5}
                                        value={loadedName}
                                        onChange={handleNameUpdate}
                                    />
                                    <br/>
                                    <br/>
                                    <label>Description</label>
                                    <br/>
                                    <input
                                        id='about'
                                        type='text'
                                        placeholder={loadedAbout}
                                        minLength={5}
                                        value={loadedAbout}
                                        onChange={handleAboutUpdate}
                                    />
                                    <br/>
                                    <Button type='submit' color={'blue'}>
                                        Submit edits
                                    </Button>
                                    <br/>
                                </form>
                        }
                        
                        {
                            toggleButton === false && toggleEdit === false
                            ?
                                <button className="fas fa-ellipsis-h" onClick={handleToggle} style={{ background: 'none', border: 'none', cursor: 'pointer' }} ></button>
                            :
                                toggleEdit === false
                                ?
                                    <button className="fas fa-times-circle close-btn" onClick={handleToggle} ></button>
                                :
                                    null
                        }
                    </div>
                }

                {
                    toggleButton === false
                    ?
                        null
                    :
                        toggleEdit === true
                        ?
                            <Button type='button' onClick={handleEditToggle} color={'red'}>
                                Cancel edits
                            </Button>
                        :
                            <>
                                <Button type='button' onClick={handleEditToggle} color={'yellow'}>
                                    Edit playlist
                                </Button>
                                <br/>
                                <Button type='button' onClick={handleDelete} color={'orange'}>
                                    Delete playlist
                                </Button>
                                <br/>
                                <div>
                                    <label>Currently: {loadedPrivacy === true ? 'Private' : 'Public'}</label>
                                    <br/>
                                    <Tippy placement='bottom' arrow={true} delay={0} content={`Make ${loadedPrivacy === true ? 'public' : 'private'}`}>
                                        {/* <label className="switch">
                                            <input type="checkbox" checked={loadedPrivacy} onChange={ handlePrivacyOnChange }/>
                                            <span className="slider round"/>
                                        </label> */}
                                        <form>
                                            <Button type='submit' color=''>
                                                Make 
                                            </Button>
                                        </form>
                                    </Tippy>
                                </div>
                            </>
                }


            </div>

            <div>
                { 
                    isLoading && loadedVideos.length === 0
                    ? 
                        <div className='center'>
                            <LoadingSpinner />
                        </div>
                    :
                        loadedPlaylist.videos === undefined
                        ?
                            'No videos'
                        :
                            <List
                                vids={loadedVideos}
                                text='Remove from playlist'
                            />
                    
                }
            </div>

        </div>
    )
}
