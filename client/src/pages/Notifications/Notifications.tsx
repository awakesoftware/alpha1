import React, { useContext, useEffect, useState } from 'react'

import Button from '../../components/FormElements/Button';

import { AuthContext } from '../../context/auth-context';
import RenderNotifications from './RenderNotifications';

import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';


export default function Notifications() {
    const auth = useContext(AuthContext);
    const history = useHistory();
    
    const [ toggleClear, setToggleClear ] = useState(false)

    const clearNotifications = async () => {
        try {
            axios({
                method: 'DELETE',
                url: `http://localhost:5000/api/notifications/${auth.userId}`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            }).then(res => {
                toast.info(res.data.msg, {position: toast.POSITION.BOTTOM_LEFT});
                history.push(`/`);
            }).catch(error => {
                toast.error('Internal error, please try again.', { position: toast.POSITION.TOP_CENTER });
            })

            // history.push(`/`);
            
        } catch (error) {
            toast.error('Internal error, please try again.', { position: toast.POSITION.TOP_CENTER });
        }
    }

    const handleToggleClear = () => {
        setToggleClear(prevToggle => !prevToggle);
    }


    return (
        <div className='notifications'>
            <h1>Notifications</h1>

            {
                toggleClear === false
                ?
                    <i className="fas fa-ellipsis-h" style={{ cursor: 'pointer' }} onClick={handleToggleClear}/>
                :
                    <>
                        <i className="far fa-times-circle" style={{ cursor: 'pointer', color: 'red' }} onClick={handleToggleClear}/>
                        <button onClick={clearNotifications} color={'orange'}>
                            Clear notifications
                        </button>
                    </>
            }

            <RenderNotifications/>   
        </div>
    )
}
