import React, { useState, useContext, useEffect } from 'react';
import {
    NavLink
} from "react-router-dom";
import { AuthContext } from '../../../context/auth-context';
import { useHttpClient } from '../../../hooks/http-hook';
import CModal from '../../../components/UIElements/CModal';
import ImageUpload from '../../../components/FormElements/ImageUpload';
import Button from '../../../components/FormElements/Button';
import { useForm } from '../../../hooks/form-hook';
import SubCount from './SubCount';

export default function Nav(props) {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    const [ editPicture, setEditPicture ] = useState(false);

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
        <ul className='profile-nav'>
            <article>
                <img
                    style={{ cursor: 'pointer' }}
                    className='profile-image'
                    src={`http://localhost:5000/${auth.image}`}
                    alt={auth.firstName}
                    onClick={() => {
                        setEditPicture(true)
                    }}
                />
                
                <SubCount
                    {...mySubs}
                />
            </article>

            <menu>
                <NavLink to='/profile/home' activeStyle={{color: '#a11e2d', borderBottom: '2px solid currentColor'}}>
                    <i className="fas fa-home"/> <span>Home</span>
                </NavLink>
                <NavLink to='/profile/videos' activeStyle={{color: '#a11e2d', borderBottom: '2px solid currentColor'}}>
                    <i className="fas fa-film"/> <span>Videos</span>
                </NavLink>
                <NavLink to='/profile/about' activeStyle={{color: '#a11e2d', borderBottom: '2px solid currentColor'}}>
                    <i className="fas fa-info-circle"/> <span>About</span>
                </NavLink>
                <NavLink to='/profile/studio' activeStyle={{color: '#a11e2d', borderBottom: '2px solid currentColor'}}>
                    <i className="fas fa-upload"/> <span>Studio</span>
                </NavLink>
                <NavLink to='/profile/subscriptions' activeStyle={{color: '#a11e2d', borderBottom: '2px solid currentColor'}}>
                    <i className="fas fa-network-wired"/> <span>Subscriptions</span>
                </NavLink>
                {
                    props.status === true &&
                    <NavLink to='/profile/admin' className='nav-button target' activeStyle={{color: '#a11e2d', borderBottom: '2px solid currentColor'}}>
                        <i className="fas fa-user-shield"/> <span>Admin</span>
                    </NavLink>
                }
            </menu>

            <CModal title="Select new profile picture..." onClose={() => setEditPicture(false)} show={editPicture}>
                <form>
                    <ImageUpload
                        center
                        id='image'
                        // initBtn='Image'
                        initValue='Please select a profile picture.'
                        // onInput={inputHandler}
                        // errorText='Please provide an image.'
                    />
                    <hr/>
                    <Button
                        type="submit"
                        color='blue'
                        // disabled={!formState.isValid}
                    >
                        Submit
                    </Button>
                </form>
            </CModal>
        </ul>
    );
}
