import React, { useContext, useEffect, useState } from 'react';
import SubTo from './SubTo';
import MySubs from './MySubs';
import { AuthContext } from '../../../context/auth-context';
import { useHttpClient } from '../../../hooks/http-hook';
import LoadingSpinner from '../../../components/UIElements/LoadingSpinner';
import ErrorModal from '../../../components/UIElements/ErrorModal';

export default function Subscriptions() {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [ subTo, setSubTo ] = useState();
    const [ mySubs, setMySubs ] = useState();

    useEffect(() => {
        const fetchSubTo = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/users/subscribedto/${auth.userId}`,
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    } 
                );
            
                setSubTo(responseData.user[0].subscribedTo);
                
            } catch (error) {  }
            
        }

        fetchSubTo();
    }, [sendRequest])

    useEffect(() => {
        const fetchMySubs = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/users/mysubscribers/${auth.userId}`,
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    } 
                );
            
                setMySubs(responseData.user[0].mySubscribers);
                
            } catch (error) {  }
            
        }

        fetchMySubs();
    }, [sendRequest])

    return (
        <>
            <h2 className='title'>Subscriptions</h2>

            <ErrorModal error={error} onClear={clearError} />

            <section>
                <h3>Subscribed to:</h3>

                { isLoading && 
                    <div className='center'>
                        <LoadingSpinner />
                    </div>
                }

                { !isLoading && subTo &&
                    <SubTo
                        subTo={subTo}
                    />
                }

            </section>



            <hr/>



            <section>
                <h3>My Subscribers:</h3>

                { isLoading && 
                    <div className='center'>
                        <LoadingSpinner />
                    </div>
                }

                { !isLoading && mySubs &&
                        <MySubs
                            mySubs={mySubs}
                        />
                }

            </section>

        </>
    )
}
