import React, { useContext, useEffect, useState } from 'react';
import Button from '../../../components/FormElements/Button';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import { AuthContext } from '../../../context/auth-context';
import { useHttpClient } from '../../../hooks/http-hook';
import LoadingSpinner from '../../../components/UIElements/LoadingSpinner';
import { toast } from 'react-toastify';


export default function About() {
    const auth = useContext(AuthContext);
    const history = useHistory();


    const [ toggleEdit, setToggleEdit ] = useState(false);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [ about, setAbout ] = useState('');


    const handleToggleEdit = () => {
        setToggleEdit(prevToggle => !prevToggle);
    }

    useEffect(() => {
        const fetchAbout = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/users/about/${auth.userId}`,
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    } 
                );
                
                setAbout(responseData.user.about);
                
            } catch (error) {  }
            
        }

        fetchAbout();
    }, [ sendRequest ])


    const handleAboutUpdate = (event) => {
        setAbout(event.target.value);
    }

    const handleUpdateSubmit = () => {
        if(about === '') {
            toast.warn('Please add the required fields.', { position: toast.POSITION.TOP_CENTER });
            return;
        } else {
            try {
                axios({
                    method: 'PUT',
                    url: `http://localhost:5000/api/users/about/${auth.userId}`,
                    data: {
                        about: about
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + auth.token
                    }
                })
                toast.success('About updated successfully.', { position: toast.POSITION.BOTTOM_LEFT });
                history.push(`/profile`);
                
            } catch (error) {
                toast.error('Internal error, please try again.', { position: toast.POSITION.TOP_CENTER });
            }
        }

    }


    return (
        <div>
            <h2 className='title'>About</h2>

            <h4>{
                isLoading
                ?
                    <LoadingSpinner/>
                :
                    about === ''
                    ?
                        "Welcome to my page!"
                    :
                        about
            }</h4>
            {/* {about === '' ? <LoadingSpinner/> : about} */}

            <br/>

            {
                !toggleEdit
                ?
                    <div>
                        <Button type='button' onClick={handleToggleEdit} color={'yellow'}>
                            <i className="fas fa-edit"/> Edit
                        </Button>
                    </div>
                :
                <>
                    <div>
                        <form onSubmit={handleUpdateSubmit} >
                            <textarea
                                id='about'
                                // type='text'
                                required
                                onChange={handleAboutUpdate}
                                placeholder={about}
                                value={about}
                            />
                            <div>
                                <Button type='submit' color={'blue'}>
                                    <i className="fas fa-check"/> Update
                                </Button>
                            </div>
                        </form>
                        <Button type='button' onClick={handleToggleEdit} color={'red'}>
                            <i className="fas fa-window-close "/> Cancel
                        </Button>
                    </div>
                </>
            }

        </div>
    )
}
