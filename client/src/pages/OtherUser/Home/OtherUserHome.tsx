import React, { useState, useEffect, useContext } from 'react';
import LoadingSpinner from '../../../components/UIElements/LoadingSpinner';
import { AuthContext } from '../../../context/auth-context';
import { useHttpClient } from '../../../hooks/http-hook';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';


export default function OtherUserHome(props) {
    const { loadedUser } = props;

    const auth = useContext(AuthContext);
    const history = useHistory();
    const { sendRequest, isLoading, error, clearError } = useHttpClient();

    const [ authSubs, setAuthSubs ] = useState([]);

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
    }, [ sendRequest ])

    const handleSubscribe = async (event) => {
        event.preventDefault();

        if( !auth.token || !auth.userId || !auth.username ) {
            return toast.error('Please log in.', { position: toast.POSITION.TOP_CENTER });
        }

        try {
            // if(loadedVideo.creator.mySubscribers.find( (s => s._id.toJSON() === auth.userId) || (s => s._id.toJSON() === undefined) )) {
            //     alert('Cannot subscribe to a user more than once.');
            // } else {
                axios({
                    method: 'POST',
                    url: `http://localhost:5000/api/users/subscribe/${auth.userId}/${loadedUser.id}`,
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + auth.token
                    }
                }).then(res => {
                    toast.info(res.data.message, {position: toast.POSITION.BOTTOM_LEFT});
                    history.push(`/`);
    
                    }).catch(error => { })

            // }

        } catch (error) {
            toast.error('Internal error, please try again.', { position: toast.POSITION.TOP_CENTER });
        }
    }


    return (
        <div>
            <h1>
                {
                    isLoading
                    ?
                        <LoadingSpinner/>
                    :
                        props.loadedUser.firstName === null || props.loadedUser.firstName === undefined || props.loadedUser.firstName === ''
                        ?
                            ""
                        :
                            `${props.loadedUser.firstName}'s page`
                }
            </h1>

            {
                authSubs !== undefined && authSubs.find(u => u.toString() === loadedUser.id)
                ?
                    <button
                        className='subscribed'
                        onClick={() => {
                            toast.warn(`Already subscribed to ${loadedUser.username}.`, { position: toast.POSITION.TOP_CENTER });
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
    )
}
