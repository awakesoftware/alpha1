import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Button from '../../../components/FormElements/Button';
import LoadingSpinner from '../../../components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../../hooks/http-hook';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../../context/auth-context';
import { toast } from 'react-toastify';


export default function UpdateVideo(props) {
    const url = window.location.href;
    const id = url.split('/').slice(-1).toString();

    const auth = useContext(AuthContext);

    const history = useHistory();


    const [ loadedVideo, setLoadedVideo ] = useState('');
    const [ title, setTitle ] = useState('');
    const [ description, setDescription ] = useState('');


    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:5000/api/videos/${id}`,
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    }
                );
                
                setLoadedVideo(responseData.video);
                setTitle(responseData.video.title);
                setDescription(responseData.video.description);
                
            } catch (error) {  }
            
        }

        fetchVideo();
    }, [ sendRequest ])

    const handleTitleUpdate = (event) => {
        setTitle(event.target.value);
    }
    
    const handleDescriptionUpdate = (event) => {
        setDescription(event.target.value);
    }

    const handleUpdateSubmit = () => {
        if(title === '' || description === '') {
            toast.warn('Please add the required fields.', { position: toast.POSITION.TOP_CENTER });
            return;
        } else if(title.length <= 4 || description.length <= 4) {
            toast.warn('Please ensure that both the title and description are longer than 5 characters.', { position: toast.POSITION.TOP_CENTER });
            return;
        } else {
            try {
                axios({
                    method: 'PUT',
                    url: `http://localhost:5000/api/videos/${id}`,
                    data: {
                        title: title,
                        description: description
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: 'Bearer ' + auth.token
                    }
                })
                toast.success('Video updated successfully.', { position: toast.POSITION.BOTTOM_LEFT });
                history.push(`/profile`);
                
            } catch (error) {
                toast.error('Internal error, please try again.', { position: toast.POSITION.TOP_CENTER });
            }
        }

    }


    return (
        <div>

            {
                isLoading && <LoadingSpinner/>
            }

            <h1>Update video</h1>

            <br/>
            <br/>

            <form onSubmit={handleUpdateSubmit} >

                <div>
                    <label>
                        <h4>Update Title</h4>
                    </label>
                    <input
                        id='title'
                        type='text'
                        minLength={5}
                        onChange={handleTitleUpdate}
                        placeholder={title}
                        value={title}
                    />
                </div>

                <br/>
                <hr style={{ width:'12.5%' }}/>
                <br/>

                <div>
                    <label>
                        <h4>Update Description</h4>
                    </label>
                    <textarea
                        id='description'
                        minLength={5}
                        onChange={handleDescriptionUpdate}
                        placeholder={description}
                        value={description}
                    />
                </div>

                <br/>
                <hr style={{ width:'25%' }}/>
                <br/>


                <Button type='submit' color={'blue'}>
                    Update
                </Button>

            </form>
        </div>
    )
}
