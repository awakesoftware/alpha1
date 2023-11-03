import React, { useContext, useEffect, useState } from 'react';
import Nav from './Nav/Nav';
import UserVideos from './UserVideos/UserVideos';
import About from './About/About';
import Upload from './Upload/Upload';
import Studio from './Studio/Studio';
import Subscriptions from './Subscriptions/Subscriptions';
import Avatar from '../../components/UIElements/Avatar';
import { useHttpClient } from '../../hooks/http-hook';

import { AuthContext } from '../../context/auth-context';
import {
    Switch,
    Route
} from "react-router-dom";

import axios from 'axios';

import ProfileHome from './Home/ProfileHome';
import UpdateVideo from './UpdateVideo/UpdateVideo';
import CModal from '../../components/UIElements/CModal';
import ImageUpload from '../../components/FormElements/ImageUpload';
import Button from '../../components/FormElements/Button';
import { useForm } from '../../hooks/form-hook';


export default function Profile() {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [ editPicture, setEditPicture ] = useState(false);

    const [formState, inputHandler, setFormData] = useForm(
        {
            image: {
                value: null,
                isValid: false
            }
        }, ''
    );

    const authSubmitHandler = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('image', formState.inputs.image.value);

        axios({
            method: 'PUT',
            url: `http://localhost:5000/api/users/profile/edit/picture/${auth.userId}`,
            data: {
                formData
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth.token
            }
        })
    }

    
    return (
        <div className='profile'>
            <div className='profile-head'>
                <img className='profile-head-cover' src="https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2017/08/nature-design.jpg" />
            </div>
            <div className='profile-head__image'>
                <span className='profile-image__back'></span>
                <img
                    style={{ cursor: 'pointer' }}
                    className='profile-image'
                    src={`http://localhost:5000/${auth.image}`}
                    alt={auth.firstName}
                    onClick={() => {
                        setEditPicture(true)
                    }}
                />
            </div>
        
            <CModal title="Select new profile picture..." onClose={() => setEditPicture(false)} show={editPicture}>
                <form onSubmit={authSubmitHandler}>
                    <ImageUpload
                        center
                        id='image'
                        // initBtn='Image'
                        initValue='Please select a profile picture.'
                        onInput={inputHandler}
                        // errorText='Please provide an image.'
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        Submit
                    </Button>
                </form>
            </CModal>

            <nav>
                <Nav/>
            </nav>

            <div className='profile-main'>
                <Switch>
                    <Route exact path='/profile' component={ProfileHome}/>

                    <Route path='/profile/videos' component={UserVideos}/>

                    <Route path='/profile/about' component={About} />

                    <Route path='/profile/upload' component={Upload}/>

                    <Route path='/profile/studio' component={Studio}/>

                    <Route path='/profile/subscriptions' component={Subscriptions}/>

                    <Route path='/profile/update' component={UpdateVideo}/>
                </Switch>
            </div>

        </div>
    )
}
