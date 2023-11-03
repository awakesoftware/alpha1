import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/auth-context';
import { useHttpClient } from '../../hooks/http-hook';
import ErrorModal from '../UIElements/ErrorModal';
import LoadingSpinner from '../UIElements/LoadingSpinner';
import Reply from './Reply';

interface ReplyType {
    _id: string,
    key: string,
    text: string,
    creator: string,
    creatorName: string,
    creatorImage: string,
    belongsTo: string,
    posted: string,
    likes?: number
}

export default function Replies(props: { id: string; }) {
    const auth = useContext(AuthContext);
    const { id } = props

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [ replies, setReplies ] = useState<any>();

    useEffect(() => {
        const fetchReplies = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/replies/comment/${id}`,
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    } 
                );
            
                setReplies(responseData.replies);
                
            } catch (error) {  }
            
        }

        fetchReplies();
    }, [  ])

    const allReplies = replies ? replies.map((reply: ReplyType, index: number) => {
        return (
            <Reply
                key={reply._id}
                id={reply._id}
                text={reply.text}
                creator={reply.creator}
                creatorName={reply.creatorName}
                creatorImage={reply.creatorImage}
                belongsTo={reply.belongsTo}
                posted={reply.posted}
                likes={reply.likes}
                // creators={creators}
            />
        )
    }) : ''


    return (
        <div>
            <ErrorModal error={error} onClear={clearError} />

            { isLoading && 
                <div className='center'>
                    <LoadingSpinner />
                </div>
            }

            {
                allReplies !== undefined && allReplies !== null
                ?
                    allReplies
                :
                    null
            }            
        </div>
    )
}