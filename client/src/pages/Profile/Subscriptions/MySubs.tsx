import React, { useContext, useEffect, useState } from 'react';
import User from './User';
import {Link} from 'react-router-dom';
import { AuthContext } from '../../../context/auth-context';
import { useHttpClient } from '../../../hooks/http-hook';
import LoadingSpinner from '../../../components/UIElements/LoadingSpinner';
import ErrorModal from '../../../components/UIElements/ErrorModal';


export default function MySubs(props) {
    const { mySubs } = props;
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const auth = useContext(AuthContext);

    const [ mySubdUsers, setMySubdUsers ] = useState([]);


    useEffect(() => {
        const fetchMySubdUsers = async () => {
            try {
                let responseData;

                for(let i = 0; i < mySubs.length; i++) {
                    responseData = await sendRequest(
                        `http://localhost:5000/api/users/${mySubs[i]}`,
                        'GET',
                        null,
                        {
                            Authorization: 'Bearer ' + auth.token
                        } 
                    );

                    setMySubdUsers(prevUser => {
                        return ([
                            ...prevUser, responseData.user
                        ])
                    });
                }
                
            } catch (error) {  }
            
        }

        fetchMySubdUsers();
    }, [sendRequest])

    return (
        <User
            users={mySubdUsers}
        />
    )
}