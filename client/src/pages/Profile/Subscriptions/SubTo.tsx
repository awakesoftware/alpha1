import React, { useContext, useEffect, useState } from 'react';
import User from './User';
import {Link} from 'react-router-dom';
import { AuthContext } from '../../../context/auth-context';
import { useHttpClient } from '../../../hooks/http-hook';
import LoadingSpinner from '../../../components/UIElements/LoadingSpinner';
import ErrorModal from '../../../components/UIElements/ErrorModal';


export default function SubTo(props) {
    const { subTo } = props;
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const auth = useContext(AuthContext);

    const [ subToUsers, setSubToUsers ] = useState([]);


    useEffect(() => {
        const fetchSubToUsers = async () => {
            try {
                let responseData;

                for(let i = 0; i < subTo.length; i++) {
                    responseData = await sendRequest(
                        `http://localhost:5000/api/users/${subTo[i]}`,
                        'GET',
                        null,
                        {
                            Authorization: 'Bearer ' + auth.token
                        } 
                    );

                    setSubToUsers(prevUser => {
                        return ([
                            ...prevUser, responseData.user
                        ])
                    });
                }
                
            } catch (error) {  }
            
        }

        fetchSubToUsers();
    }, [sendRequest])

    return (
        <User
            users={subToUsers}
        />
    )
}