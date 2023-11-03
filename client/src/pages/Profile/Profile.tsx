import React, { useContext, useEffect, useState } from 'react';
import Nav from './Nav/Nav';
import UserVideos from './UserVideos/UserVideos';
import About from './About/About';
import Upload from './Upload/Upload';
import Studio from './Studio/Studio';
import Subscriptions from './Subscriptions/Subscriptions';
import { useHttpClient } from '../../hooks/http-hook';

import { AuthContext } from '../../context/auth-context';
import {
    Switch,
    Route
} from "react-router-dom";

import ProfileHome from './Home/ProfileHome';
import UpdateVideo from './UpdateVideo/UpdateVideo';

import Admin from './Admin/Admin';

export default function Profile() {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [ status, setStatus ] = useState(false);

    useEffect(() => {
        const setUserStatus = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/users/admin/${auth.userId}`,
                    'GET',
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    }    
                );

                setStatus(responseData.adminStatus);
    
            } catch (error) {  }
        }
        setUserStatus();
    }, [sendRequest])

    
    return (
        <div className='profile'>
            <img src="https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2017/08/nature-design.jpg" />
            <div className='profile-header'>
                <Nav
                    status={status}
                />
            </div>


            <div className='profile-main'>

                
                {/* //* Anything put here will appear on all pages */}

                <Switch>
                    <Route exact path='/profile/home' component={ProfileHome}/>

                    <Route path='/profile/videos' component={UserVideos}/>

                    <Route path='/profile/about' component={About} />

                    <Route path='/profile/upload' component={Upload}/>

                    <Route path='/profile/studio' component={Studio}/>

                    <Route path='/profile/subscriptions' component={Subscriptions}/>

                    <Route path='/profile/admin' component={Admin}/>

                    <Route path='/profile/update' component={UpdateVideo}/>
                </Switch>
            </div>

        </div>
    )
}
