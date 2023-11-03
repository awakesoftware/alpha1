import React, { useContext, useEffect, useState } from 'react';
import {Link} from 'react-router-dom';
import { AuthContext } from '../../context/auth-context';
import CModal from '../UIElements/CModal';
import Button from '../FormElements/Button';

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { toast } from 'react-toastify';
import { useHttpClient } from '../../hooks/http-hook';

import axios from 'axios';

import ReplyTo from '../Replies/ReplyTo';
import Replies from '../Replies/Replies';

interface PropType {
    key: string,
    id: string,
    text: string,
    creator: string,
    likes: number,
    posted: string,
    // creators: [],
    replies: [],
    creatorName: string,
    creatorImage: string,
    authSubs: any
}

export default function Comment(props: PropType) {
    const {
        key,
        id,
        text,
        creator,
        likes,
        posted,
        // creators,
        replies,
        creatorName,
        creatorImage,
        authSubs
    } = props;
    const auth = useContext(AuthContext);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [ loadedComment, setLoadedComment ] = useState({
        likes: Number
    })
    const [ toggleReplyTo, setToggleReplyTo ] = useState(false);
    const [ toggleShowReplies, setToggleShowReplies ] = useState(false);
    const [ toggleButton, setToggleButton ] = useState(false);
    const [ commentLikes, setCommentLikes ] = useState(0);

    useEffect(() => {
        const fetchComment = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/comments/comment/${id}`,
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    } 
                );
                
                setLoadedComment(responseData.comment);
                
            } catch (error) {  }
            
        }

        fetchComment();
    }, [ sendRequest, commentLikes ])

    const handleToggleReplyTo = () => {
        setToggleReplyTo(true);
    }

    const handleCancelToggleReplyTo = () => {
        setToggleReplyTo(false);
    }

    const handleToggleShowReplies = () => {
        setToggleShowReplies(true)
    }

    const handleCancelToggleShowReplies = () => {
        setToggleShowReplies(false)
    }

    const handleToggle = () => {
        setToggleButton(prevToggle => !prevToggle)
    }

    const likeComment = async () => {
        try {
            axios({
                method: 'PUT',
                url: `http://localhost:5000/api/comments/comment/like/${id}`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            }).then(() => {
                toast.info('Liked comment.', {position: toast.POSITION.BOTTOM_LEFT});
            }).catch((err) => {
                toast.warn(`${err} - You cannot like a comment more than once.`, { position: toast.POSITION.TOP_CENTER });
            })
            
            // try {
            //     if(auth.userId !== loadedVideo.creator.id) {
            //         await axios({
            //             method: 'POST',
            //             url: `http://localhost:5000/api/notifications/like/${id}/${auth.userId}/${loadedVideo.creator.id}`,
            //             headers: {
            //                 'Content-Type': 'application/json',
            //                 Authorization: 'Bearer ' + auth.token
            //             }
            //         })
            //     } else {
            //         // toast.warn('Cannot send notification to self.', { position: toast.POSITION.TOP_CENTER });
            //     }

                
            // } catch (error) {
            //     toast.error('Internal error, please try again.', { position: toast.POSITION.TOP_CENTER });
            // }


            setCommentLikes( loadedComment.likes );
            
        } catch (error) {
            toast.error('Internal error, please try again.', { position: toast.POSITION.TOP_CENTER });
        }
    }

    const TippyProfile = () => {
        return (
            <div style={{ textAlign: 'center' }}>
                <img
                    src={`http://localhost:5000/${creatorImage}`}
                    style={{ width:'150px' }}
                />
                <br/>
                <div>
                    {
                    auth.userId === id
                    ?
                        <Link to='/profile' >
                            <button
                                className='subscribe'
                            >MY CHANNEL</button>
                        </Link>
                    :
                        authSubs !== undefined && authSubs.find((u: { toString: () => string; }) => u.toString() === id)
                        ?
                            <button
                                className='subscribed'
                                onClick={() => {
                                    toast.warn(`Already subscribed to ${creator}.`, { position: toast.POSITION.TOP_CENTER });
                                }}
                                disabled
                            >SUBSCRIBED</button>
                        :

                        <button
                            className='subscribe'
                            // onClick={handleSubscribe}
                        >SUBSCRIBE</button>
                    }
                </div>
                <p>{creatorName}</p>
            </div>
        )
    }

    return (
        <div style={{ margin: '5px', width: '100%' }} >
            {
                text !== undefined
                ?
                    <div
                        style={{ margin: '25px 10px' }}
                    >
                        <Link
                            to={
                                auth.userId === creator
                                ?
                                    '/profile'
                                :
                                    `/user/${creator}`
                            }
                        >
                            <img
                                src={`http://localhost:5000/${creatorImage}`}
                                style={{ width:'50px', borderRadius: '50%', float: 'left' }}
                            />
                        </Link>
                        <div>
                            <div style={{}}>
                                <div style={{width: '200px'}}>
                                    <Tippy
                                        interactive
                                        placement='right'
                                        arrow={true}
                                        delay={0}
                                        content={<TippyProfile/>}
                                    >
                                        <Link to={
                                            auth.userId === creator
                                            ?
                                                '/profile'
                                            :
                                                `/user/${creator}`
                                        }>
                                            <h5>{creatorName || 'Deleted user'}</h5>
                                        </Link>
                                    </Tippy>
                                </div>
                                <p>{text}</p>
                            </div>
                        </div>

                        <div style={{ margin: '0px 0px 0px 50px' }}>
                            <Tippy placement='bottom' arrow={false} delay={0} content='Like comment'>
                                <i
                                    className="far fa-thumbs-up"
                                    style={{ cursor:'pointer', margin: '0px 15px 0px 0px' }}
                                    onClick={likeComment}
                                > {loadedComment.likes || ' ' + 0}</i> 
                            </Tippy>

                            <Tippy placement='bottom' arrow={false} delay={0} content='Reply'>
                                <i
                                    className="fas fa-reply"
                                    style={{ cursor:'pointer', margin: '0px 15px 0px 0px' }}
                                    onClick={ toggleReplyTo === true ? handleCancelToggleReplyTo : handleToggleReplyTo }
                                ></i>
                            </Tippy>

                            {
                                auth.userId === creator &&
                                <Tippy placement='bottom' arrow={false} delay={0} content='Edit comment'>
                                    <button className="fas fa-ellipsis-h" onClick={handleToggle} style={{ margin: '0px 0px 0px 0px', background: 'none', border: 'none', cursor: 'pointer' }} ></button>
                                </Tippy>
                            }
                        </div>

                        <CModal width={'500px'} title={`Edit comment`} onClose={() => setToggleButton(p => !p)} show={toggleButton}>
                            <form>
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
                                    value={text}
                                    placeholder='Edit comment...'
                                    autoComplete='off'
                                    required
                                    // minLength='1'
                                    // maxLength='250'
                                    // onChange={handleChangeComment}
                                    // disabled={toggleComment === true ? false : true}
                                />
                                <Button disabled size='small' type='submit' color={'blue'}>
                                    Submit edits
                                </Button>
                            </form>
                        </CModal>
                        
                        <br/>

                        {
                            toggleReplyTo === true
                            ?
                                <ReplyTo
                                    id={id}
                                    cancel={handleCancelToggleReplyTo}
                                />
                            :
                                null
                        }

                        {
                            (replies !== null && replies !== undefined) && replies.length !== 0
                            ?
                                <small
                                    style={{
                                        cursor: 'pointer',
                                        margin: '0px 0px 0px 55px',
                                        color: 'blue'
                                    }}
                                >
                                    {
                                        toggleShowReplies === true
                                        ?
                                            <a onClick={handleCancelToggleShowReplies}>
                                                <i className="fas fa-caret-up"/> Hide {replies.length} { replies.length === 1 ? 'reply' : 'replies' }...
                                            </a>
                                        :
                                            <a onClick={handleToggleShowReplies}>
                                                <i className="fas fa-caret-down"/> View {replies.length} { replies.length === 1 ? 'reply' : 'replies' }...
                                            </a>
                                    }
                                </small>
                            :
                                null
                        }

                        {
                            toggleShowReplies === true
                            ?
                                <Replies
                                    id={id}
                                />
                            :
                                null
                        }

                    </div>
                :
                    <p>Deleted user</p>
            }
        </div>
    )
}