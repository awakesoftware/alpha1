import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useHttpClient } from '../../hooks/http-hook';
import { AuthContext } from '../../context/auth-context';

import Card from '../../components/UIElements/Card';

export default function SingleNotification(props) {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [ senderImg, setSenderImg ] = useState();

    useEffect(() => {
        const fetchSender = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/users/${props.sendingUser}`,
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    } 
                );
            
                setSenderImg(responseData.user.image)
                
            } catch (error) {  }
            
        }

        fetchSender();
    }, [sendRequest])

    const organizeDatePosted = () => { //TODO: Fix this, time is off
        let organizedDate = props.posted.split('-');
        const fullTime = organizedDate[2].slice(3,8);
        let time = fullTime.split(':')
        parseInt(time[0]) <= 12 ? time=`${parseInt(time[0])}:${time[1]} PM` : time=`${parseInt(time[0]) - 6}:${time[1]} AM` 
        const day = organizedDate[2].slice(0,2);
        const month = organizedDate[1];
        const year = organizedDate[0];
        let newDate = `${month}-${day}-${year}`;
        return newDate;
    }

    const splitText = () => {
        let interactingUser = props.text.split(': ');
        return (
            <>
                <Link to={`/user/${props.sendingUser}`}>{interactingUser[0]}</Link><br/>
                <Link to={`/video/${props.video}`}>"{interactingUser[1]}"</Link>
            </>
        )


    }

    return (
        <>
            <section>
                <Link to={`/user/${props.sendingUser}`}>
                    <img
                        src={`http://localhost:5000/${senderImg}`}
                    />
                </Link>
                <span>{splitText()}</span>
                <span>{organizeDatePosted()}</span>
            </section>
            <hr/>
        </>
    )
}
