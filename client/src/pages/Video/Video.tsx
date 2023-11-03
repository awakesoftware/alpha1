import React, { ReactElement, ReactHTMLElement, useContext, useEffect, useState } from 'react';
import Button from '../../components/FormElements/Button';
import { Link, useHistory } from 'react-router-dom';
import Card from '../../components/UIElements/Card';
import ErrorModal from '../../components/UIElements/ErrorModal';
import LoadingSpinner from '../../components/UIElements/LoadingSpinner';
import Comments from '../../components/Comments/Comments';
import CreatePlaylist from '../MyPlaylists/CreatePlaylist';
import { AuthContext } from '../../context/auth-context';
import { useHttpClient } from '../../hooks/http-hook';

import axios from 'axios';

import VModal from '../../components/UIElements/VModal';
import CModal from '../../components/UIElements/CModal';

import { toast } from 'react-toastify';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import Recommended from '../../components/Recommended/Recommended';


interface loadedVideoType {
    views: number
    creator: {
        id: string
        username: string
        image: string
    },
    id: string
    title: string
    likes: number
    filePath: string
    category: string
    description: string
    posted
}

interface playlistType {
    _id: string
    videos: [{
        id: string
    }]
    name: string
    about: string
    creator: string
    private: boolean
}

export default function Video() {
    const url = window.location.href;
    const id = url.split('/').slice(-1).toString();

    const auth = useContext(AuthContext);
    const history = useHistory();

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [ loadedVideo, setLoadedVideo ] = useState<loadedVideoType>();
    const [ user, setUser ] = useState<string>();
    const [ likes, setLikes ] = useState<number>();
    const [ views, setViews ] = useState<number>();
    const [ playlists, setPlaylists ] = useState<playlistType[]>();
    const [ toggleShare, setToggleShare ] = useState(false);
    const [ toggleCreate, setToggleCreate ] = useState(false);
    const [show, setShow] = useState(false);

    
    const [ authSubs, setAuthSubs ] = useState<[{id: string}]>();


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/users/${auth.userId}`,
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    } 
                );
                
                setUser(responseData.user);
                
            } catch (error) {  }
            
        }

        fetchUser();
    }, [ sendRequest, likes ])

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/videos/${id}`,
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    } 
                );
                
                setLoadedVideo(responseData.video);
                
            } catch (error) {  }
            
        }

        fetchVideo();
    }, [ sendRequest, likes ])


    useEffect(() => {
        const addToHistory = async () => {
            try {
                axios({
                    method: 'POST',
                    url: `http://localhost:5000/api/videos/history/${id}`,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + auth.token
                    }
                })
                
                
            } catch (error) {
                
            }
        }

        addToHistory();
    }, [])


    useEffect(() => {
        const incrementViews = async () => {
            try {
                await axios({
                    method: 'PUT',
                    url: `http://localhost:5000/api/videos/views/${id}`,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + auth.token
                    }
                })
                
                await setViews( loadedVideo.views );
                
            } catch (error) {
                toast.error('Internal error, please try again.', { position: toast.POSITION.TOP_CENTER });
            }
        }

        incrementViews();
    }, [])

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
    }, [ sendRequest, likes ])


    const likeVideo = async () => {
        try {
            axios({
                method: 'PUT',
                url: `http://localhost:5000/api/videos/like/${id}`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            }).then(() => {
                toast.info('Liked video.', {position: toast.POSITION.BOTTOM_LEFT});
            }).catch(() => {
                toast.warn('You cannot like the video more than once.', { position: toast.POSITION.TOP_CENTER });
            })
            
            try {
                if(auth.userId !== loadedVideo.creator.id) {
                    await axios({
                        method: 'POST',
                        url: `http://localhost:5000/api/notifications/like/${id}/${auth.userId}/${loadedVideo.creator.id}`,
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + auth.token
                        }
                    })
                } else {
                    // toast.warn('Cannot send notification to self.', { position: toast.POSITION.TOP_CENTER });
                }

                
            } catch (error) {
                toast.error('Internal error, please try again.', { position: toast.POSITION.TOP_CENTER });
            }

            setLikes( loadedVideo.likes );
            
        } catch (error) {
            toast.error('Internal error, please try again.', { position: toast.POSITION.TOP_CENTER });
        }
    }

    const watchLater = () => {
        try {
            axios({
                method: 'POST',
                url: `http://localhost:5000/api/videos/watchlater/${id}`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            }).then(() => {
                toast.info('Added to watch later.', {position: toast.POSITION.BOTTOM_LEFT});
            }).catch(() => {
                toast.warn('Video is already in watch later.', { position: toast.POSITION.TOP_CENTER });
            })
            
            
        } catch (error) {
            toast.error('Internal error, please try again.', { position: toast.POSITION.TOP_CENTER });
        }
    }


    const addVideoToPlaylist = async (event) => {
        // const variables = {
        //     pid: event.target.id
        // }

        // try {
        //     const headers = {
        //         'Content-Type': 'application/json',
        //         Authorization: 'Bearer ' + auth.token
        //     }

        //     axios.post(`http://localhost:5000/api/playlists/playlist/${id}`, variables, {
        //         headers: headers
        //     })            
        //     .then(res => {
        //             toast.info(`Video added to playlist. ${res} 1.1`, {position: toast.POSITION.BOTTOM_LEFT});
        //     })
        //     .catch(error => {
        //         toast.warn(`Video is already in playlist. ${error} 1.2`, { position: toast.POSITION.TOP_CENTER });
        //     })

        // } catch (error) {
        //     toast.error('Internal error, please try again.', { position: toast.POSITION.TOP_CENTER });
        // }
        event.preventDefault();

        if( !auth.token || !auth.userId || !auth.username ) {
            toast.error('Please log in.', { position: toast.POSITION.TOP_CENTER });
        }
        
        // const variables = {
        //     pid: event.target.id
        // }

        try {
            axios({
                method: 'POST',
                url: `http://localhost:5000/api/playlists/playlist/${id}`,
                data: {
                    // pid: event.target.id,
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            })
            .then(res => {
                // toast.info(res.data.message, {position: toast.POSITION.BOTTOM_LEFT});
                toast.info(`Video added to playlist. ${res} 1.1`, {position: toast.POSITION.BOTTOM_LEFT});
                history.push(`/`);
            })
            .catch(error => {                
                toast.error(`Internal error, please try again. ${error} 1.1`, { position: toast.POSITION.TOP_CENTER });
            })

        } catch (error) {
            toast.error(`Internal error, please try again. ${error} 1.2`, { position: toast.POSITION.TOP_CENTER });
        }
    }

    useEffect(() => {
        const fetchAuthSubs = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/users/subscribedto/${auth.userId}`,
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    } 
                );
                
                setAuthSubs(responseData.user[0].subscribedTo);
                
            } catch (error) {  }
            
        }

        fetchAuthSubs();
    }, [ sendRequest, likes ])

    const handleSubscribe = async (event) => {
        event.preventDefault();

        if( !auth.token || !auth.userId || !auth.username ) {
            toast.error('Please log in.', { position: toast.POSITION.TOP_CENTER });
        }

        try {
            axios({
                method: 'POST',
                url: `http://localhost:5000/api/users/subscribe/${auth.userId}/${loadedVideo.creator.id}`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            }).then(res => {
                toast.info(res.data.message, {position: toast.POSITION.BOTTOM_LEFT});
                history.push(`/`);

                }).catch(error => { })


        } catch (error) {
            toast.error('Internal error, please try again.', { position: toast.POSITION.TOP_CENTER });
        }
    }




    return (
        <div className='video-grid'>
            <ErrorModal error={error} onClear={clearError} />

            { isLoading && 
                <div className='center'>
                    <LoadingSpinner />
                </div>
            }

            { !isLoading && loadedVideo && 
                <div className='video'>
                    <video
                        controls
                        className='video-video'
                        src={`http://localhost:5000/${loadedVideo.filePath}`}
                    ></video>

                    <div className='video-header'>
                        <div className='video-header__primary'>
                            <div className='video-details'>
                                <small>#{loadedVideo.category}</small>
                                <h2>{loadedVideo.title}</h2>
                                <i
                                    className="far fa-eye interaction"
                                    title='Views'
                                > {loadedVideo.views} { loadedVideo.views === 1 ? 'view' : 'views' }</i>
                                <small>  •  </small>
                                <small title='Posted'>{loadedVideo.posted.split('T')[0]}</small>
                            </div>

                            <div className='video-interactions'>
                                <Tippy placement='bottom' arrow={false} delay={0} content='Like video'>
                                    <i style={{ cursor:'pointer' }}
                                        className="far fa-thumbs-up interaction"
                                        onClick={ likeVideo }
                                    > {loadedVideo.likes}</i>
                                </Tippy>

                                <Tippy placement='bottom' arrow={false} delay={0} content='Share video'>
                                    <i
                                        onClick={() => setToggleShare(true)}
                                        style={{ cursor:'pointer' }} className="fas fa-share-square interaction">
                                    </i>
                                </Tippy>

                                <VModal title="Share video" onClose={() => setToggleShare(false)} show={toggleShare}>
                                    <div
                                        style={{ display: 'grid', gridTemplateColumns: '80% 20%', border: '1px solid grey', padding: '2.5px' }}
                                    >
                                        <input
                                            style={{ border: 'none' }}
                                            type='text'
                                            value={url}
                                            id='urlText'
                                            readOnly
                                        />
                                        <Button
                                            type='button'
                                            onClick={() => {
                                                let copiedText:any = document.getElementById('urlText');
                                                copiedText.select();
                                                copiedText.setSelectionRange(0, 99999);
                                                document.execCommand('copy');
                                                toast.info('Link copied to clipboard.', {position: toast.POSITION.BOTTOM_LEFT});
                                            }}
                                            color={'green'}
                                        >
                                            Copy
                                        </Button>
                                    </div>
                                </VModal>

                                <Tippy placement='bottom' arrow={false} delay={0} content='Watch later'>
                                    <i style={{ cursor:'pointer' }}
                                        className="far fa-clock interaction"
                                        onClick={ watchLater }
                                    />
                                </Tippy>

                                <Tippy placement='bottom' arrow={false} delay={0} content='Add to playlist'>
                                    <i style={{ cursor:'pointer' }}
                                        className='fas fa-list interaction'
                                        onClick={() => setShow(true)}
                                    ></i>
                                </Tippy>
                                    

                                <VModal title="Add to playlist" onClose={() => setShow(false)} show={show}>
                                    <div style={{ marginBottom: '5px', paddingBottom: '5px' }}>
                                        <i style={{ cursor:'pointer' }}
                                            className="fas fa-plus fa-sm"
                                        />
                                        <small
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => setToggleCreate(true)}
                                        >
                                            Create new playlist
                                        </small>
                                    </div>
                                    <hr/>
                                    {                                        
                                        show === true && playlists.length !== 0
                                        ?
                                            playlists.map(playlist =>
                                                <div style={{display: 'grid', gridTemplateColumns: '70% 30%'}}>
                                                    <button
                                                        style={{width: '100%', margin: '5px 0px', padding: '5px', border: '1px solid #818181', backgroundColor: '#dfdfdf', cursor: 'pointer'}}
                                                        onClick={addVideoToPlaylist}
                                                    >
                                                        <small style={{
                                                            cursor:'pointer',
                                                            padding: '0px 5px'
                                                        }}
                                                            id={playlist._id}
                                                        >{playlist.name}</small>
                                                    </button>
                                                    <div
                                                        style={{margin: 'auto'}}
                                                    >
                                                        {
                                                            playlist.private === true ?
                                                                <div>
                                                                    <i className='fas fa-lock'/> <small style={{color: '#8d0d37'}}>Private</small>
                                                                </div>
                                                            :
                                                                <div>
                                                                    <i className='fas fa-globe-americas'/> <small style={{color: '#2de65b'}}>Public</small>
                                                                </div>
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        :
                                            null
                                    }
                                </VModal>

                                <CModal title="Create new playlist..." onClose={() => setToggleCreate(false)} show={toggleCreate}>
                                    <CreatePlaylist/>
                                </CModal>
                            
                            </div>
                            
                        </div>


                        <hr/>

                        <div className='video-header__secondary'>
                            <div>
                                <div className='video-header__seconday-user-info'>
                                    <Link
                                        to={
                                            auth.userId === loadedVideo.creator.id
                                            ?
                                                `/profile`
                                            :
                                                `/user/${loadedVideo.creator.id}`
                                        }
                                    >
                                        <img
                                            src={`http://localhost:5000/${loadedVideo.creator.image}`}
                                            className='video-image'
                                        />

                                        <h5>{loadedVideo.creator.username}</h5>
                                    </Link>
                                </div>

                            </div>

                            <h4>{loadedVideo.description}</h4>

                            <div>
                                {
                                auth.userId === loadedVideo.creator.id
                                ?
                                    <Link to='/profile' >
                                        <button
                                            className='subscribe'
                                        >MY CHANNEL</button>
                                    </Link>
                                :
                                    authSubs !== undefined && authSubs.find(u => u.toString() === loadedVideo.creator.id)
                                    ?
                                        <button
                                            className='subscribed'
                                            onClick={() => {
                                                toast.warn(`Already subscribed to ${loadedVideo.creator.username}.`, { position: toast.POSITION.TOP_CENTER });
                                            }}
                                            disabled
                                        >SUBSCRIBED</button>
                                    :

                                    <button
                                        className='subscribe'
                                        onClick={handleSubscribe}
                                    >SUBSCRIBE</button>
                                }
                            </div>

                        </div>

                    </div>

                    <Comments
                        loadedVideo={loadedVideo}
                        authSubs={authSubs}
                    />

                </div>
            }

            <>
                <Recommended
                    id={id}
                    category={loadedVideo?.category}
                />
            </>

        </div>
    )
}
