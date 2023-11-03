import React, { useContext, useEffect, useState } from 'react';
import Comment from './Comment';
import ErrorModal from '../UIElements/ErrorModal';
import LoadingSpinner from '../UIElements/LoadingSpinner';
import { useHttpClient } from '../../hooks/http-hook';
import { AuthContext } from '../../context/auth-context';
import axios from 'axios';

import { toast } from 'react-toastify';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useHistory } from 'react-router-dom';

import Button from '../FormElements/Button';

interface PropType {
    loadedVideo: {},
    authSubs: [{}]
}

interface Comment {
    _id: string,
    text: string,
    creator: string,
    likes: number,
    posted: string,
    replies: [],
    creatorName: string,
    creatorImage: string,
    creators?: [],
    authSubs: [{id: string}]
}

export default function Comments(props: PropType) {
    const history = useHistory();
    const {loadedVideo, authSubs} = props;
    const url = window.location.href;
    const id = url.split('/').slice(-1).toString();
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const auth = useContext(AuthContext);


    const [ creators, setCreators ] = useState([]);
    const [ comments, setComments ] = useState([]);
    const [ text, setText ] = useState('');

    const [ toggleComment, setToggleComment ] = useState(false);
    const handleToggleComment = () => {
        setToggleComment(prevToggle => !prevToggle)
    }

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/comments/video/${id}`,
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    } 
                );
            
                setComments(responseData.comments);
                
            } catch (error) {  }
            
        }

        fetchComments();
    }, [  ])

    useEffect(() => {
        const fetchCreators = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/comments/video/${id}`,
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    }
                );

                setCreators(responseData.users.filter((v: {id: string},i: number,a: { id: string; }[])=>a.findIndex((t: { id: string; })=>(t.id === v.id))===i))
                
            } catch (error) {  }
            
        }

        fetchCreators();
    }, [ sendRequest ])

    const submitComment = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        if( !auth.token || !auth.userId || !auth.username ) {
            return toast.error('Please log in.', { position: toast.POSITION.TOP_CENTER });
        }
        
        const variables = {
            text: text,
            creator: auth.userId
        }
        const headers = {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + auth.token
        }

        try {
            await axios.post(`http://localhost:5000/api/comments/${id}`, variables, {
                headers: headers
            })
            // .then(res => {
            //     setComments(prevComments => ({
            //         ...prevComments,
            //         comments: [...prevComments, res.data.newComment]
            //     }))

            //     try {
            //         if(auth.userId !== loadedVideo.creator.id) {
            //             axios({
            //                 method: 'POST',
            //                 url: `http://localhost:5000/api/notifications/comment/${id}/${auth.userId}/${loadedVideo.creator.id}`,
            //                 headers: {
            //                     'Content-Type': 'application/json',
            //                     Authorization: 'Bearer ' + auth.token
            //                 }
            //             }).then((res) => {
            //                 toast.success('Comment added.', { position: toast.POSITION.BOTTOM_LEFT });
            //                 history.push(`/`);
            //             })
            //         } else {
            //             // toast.warn('Cannot send notification to self.', { position: toast.POSITION.TOP_CENTER });
            //         }
    
                    
            //     } catch (error) {
            //         toast.error('Internal error, please try again.', { position: toast.POSITION.TOP_CENTER });
            //     }

            // }).catch(() => {
            //     toast.error('Internal error, please try again.', { position: toast.POSITION.TOP_CENTER });
            // })


        } catch (error) {
            toast.error('Internal error, please try again.', { position: toast.POSITION.TOP_CENTER });
        }
    }

    // Comment state
    const handleChangeComment = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setText(event.target.value);
    }

    const comms = Array.from(comments).map((comment: Comment, index: number) => {
        return (
            <Comment
                key={comment._id}
                id={comment._id}
                text={comment.text}
                creator={comment.creator}
                likes={comment.likes}
                posted={comment.posted}
                replies={comment.replies}
                creatorName={comment.creatorName}
                creatorImage={comment.creatorImage}
                // creators={creators}
                authSubs={props.authSubs}
            />
        )
    })

    return (
        <div>
            <ErrorModal error={error} onClear={clearError} />

            { isLoading && 
                <div className='center'>
                    <LoadingSpinner />
                </div>
            }

                <div>
                    <section style={{ margin: '15px', display: 'flex' }} >
                        <p style={{ marginRight: '15px' }} ><b>{comments !== undefined ? comments.length : ''} { comments.length === 1 ? 'Comment' : 'Comments' }</b></p>

                        <Tippy placement='bottom' arrow={false} delay={0} content='Sort comments'>
                            <select 
                                style={{
                                    height: '22px',
                                    border: '1px solid grey',
                                    borderRadius: '5px',
                                    padding: '2px',
                                    cursor: 'pointer' 
                                }} 
                                // onChange={''}
                            >
                                <option value='popular' selected>Newest first</option>
                                <option value='new'>Most popular</option>
                            </select>
                        </Tippy>
                    </section>

                    <hr style={{width: '100%'}} />

                    { isLoading && 
                        <div className='center'>
                            <LoadingSpinner />
                        </div>
                    }

                    <div
                        style={{
                            marginBottom: '50px'
                        }}
                        className='video-add-comment'
                    >
                        <form onSubmit={submitComment} style={{display: 'grid', gridTemplateColumns: '60px 1fr'}}>
                            <img
                                src={`http://localhost:5000/${auth.image}`}
                                className='video-image'
                            />
                            <div>
                                <div onClick={handleToggleComment} style={{cursor: 'pointer', width: '190px'}}>
                                    { toggleComment === true ? <div className='adding-new-comment' style={{ border: '2px solid grey', width: '190px', padding: '5px', borderRadius: '15px' }}>Add comment below...</div> : <div className='add-new-comment' style={{ border: '2px solid grey', width: '190px', padding: '5px', borderRadius: '15px', textAlign: 'center' }}><i className="far fa-comment"/> Add new comment...</div>}
                                </div>
                                {
                                    <input
                                        style={{
                                            borderTop: 'none',
                                            borderRight: 'none',
                                            borderLeft: 'none',
                                            borderBottom: '1px solid grey',
                                            width: '100%',
                                            marginTop: '15px',
                                            backgroundColor: 'white'
                                        }}
                                        id='text'
                                        type='text'
                                        placeholder={toggleComment ? `Commenting as ${auth.firstName} ${auth.lastName}` : ''}
                                        autoComplete='off'
                                        required
                                        minLength={1}
                                        maxLength={250}
                                        onChange={handleChangeComment}
                                        disabled={toggleComment === true ? false : true}
                                    />
                                }
                                <div>
                                    {
                                        toggleComment === true &&
                                        <Button size='small' type='button' onClick={handleToggleComment} color={'red'}>
                                            Cancel
                                        </Button>
                                    }
                                    {
                                        ((document.getElementById('text') === document.activeElement && text.length !== 0) || (text.length !== 0 && toggleComment === true))  &&
                                        <Button disabled size='small' type='submit' color={'blue'}>
                                            Add comment
                                        </Button>
                                    }
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* <hr/> */}

                    {
                        comms !== undefined && comms !== null
                        ?
                            comms
                        :
                            null
                    }

                </div>

        </div>
    )
}
