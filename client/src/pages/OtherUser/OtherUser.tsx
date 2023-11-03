import React, { useContext, useEffect, useState } from 'react';
import { useHttpClient } from '../../hooks/http-hook';
import axios from 'axios';
import { AuthContext } from '../../context/auth-context';
import OtherUserNav from './Nav/OtherUserNav';
import OtherUserUserVideos from './UserVideos/OtherUserUserVideos';
import OtherUserPlaylists from './Playlists/OtherUserPlaylists';
import OtherUserAbout from './About/OtherUserAbout';
import Avatar from '../../components/UIElements/Avatar';
import {
    Switch,
    Route
} from "react-router-dom";
import OtherUserHome from './Home/OtherUserHome';


export default function OtherUser(props) {
    const url = window.location.href;
    const id = url.split('/').slice(-1).toString();

    const auth = useContext(AuthContext);

    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [ loadedUser, setLoadedUser ] = useState('');


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/users/${id}`,
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    } 
                );
                
                setLoadedUser(responseData.user);
                
            } catch (error) {  }
            
        }

        fetchUser();
    }, [ sendRequest ])

    
    return (
        <div className='profile'>
            <img className='profile-head-cover' src="https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2017/08/nature-design.jpg" />
                <div className='profile-header'>
                    <OtherUserNav loadedUser={loadedUser} />
                </div>


            <div className='profile-main'>
                <Switch>
                    <Route exact path={`/user/${id}`}>
                        <OtherUserHome loadedUser={loadedUser} />
                    </Route>
                    <Route path='/user/videos'>
                        <OtherUserUserVideos loadedUser={loadedUser} />
                    </Route>
                    <Route path='/user/playlists'>
                        <OtherUserPlaylists loadedUser={loadedUser} />
                    </Route>
                    <Route path='/user/about'>
                        <OtherUserAbout loadedUser={loadedUser} />
                    </Route>
                </Switch>
            </div>

        </div>
    )
}
