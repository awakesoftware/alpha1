import React, { useContext, useState } from 'react';
import Button from '../../../components/FormElements/Button';
import axios from 'axios';
import { Link, Route, Switch, useHistory } from 'react-router-dom';
import Video from '../../Video/Video';
import { AuthContext } from '../../../context/auth-context';

import UpdateVideo from '../UpdateVideo/UpdateVideo';
import { toast } from 'react-toastify';

import Card from '../../../components/UIElements/Card';
import VModal from '../../../components/UIElements/VModal';

export default function VideoItem(props) {
    const { id, title, description, privateVid, thumbnailPath, creator } = props

    const auth = useContext(AuthContext);

    const [ toggle, setToggle ] = useState(false);
    const [ toggleDeleteChoice, setToggleDeleteChoice ] = useState(false)
    const [ privateVideo, setPrivateVideo ] = useState(false);

    const [ toggleVisibility, setToggleVisibility ] = useState(false)

    const history = useHistory();

    const toggleHandler = () => {
        setToggle(prevToggle => !prevToggle);

        setToggleDeleteChoice( prevToggle =>
            toggleDeleteChoice === true
            ?
                prevToggle = !prevToggle
            :
                prevToggle = prevToggle
        );

        setToggleVisibility( prevToggle =>
            toggleVisibility === true
            ?
                prevToggle = !prevToggle
            :
                prevToggle = prevToggle
        );
    }

    const toggleDeleteChoices = () => {
        setToggleDeleteChoice(prevToggle => (!prevToggle));
    }

    // Private state
    const handleChangePrivate = (event) => {
        setPrivateVideo(event.target.value);
        setToggleVisibility(prevToggle => !prevToggle);
    }

    const handlePrivacySubmit = () => {
        if((privateVid === true && privateVideo !== true)) {
            setPrivateVideo(false);
        } else if((privateVid === false && privateVideo !== false)) {
            setPrivateVideo(true);
        } else {
            return toast.error('Internal error, please try again.', { position: toast.POSITION.TOP_CENTER });;
        }

        axios({
            method: 'PUT',
            url: `http://localhost:5000/api/videos/privacy/${id}`,
            data: {
                private: privateVideo
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + auth.token
            }
        })
        toast.info('Video updated successfully.', {position: toast.POSITION.BOTTOM_LEFT});
        history.push(`/profile`);
    }


    const handleDelete = async () => {
        try {
            axios({
                method: 'DELETE',
                url: `http://localhost:5000/api/videos/hide/${props.id}`,
                headers: {
                    Authorization: 'Bearer ' + auth.token
                }
            })

            toast.info(`Video: ${props.title} was deleted.`, {position: toast.POSITION.BOTTOM_LEFT});
            history.push(`/profile`);
            
        } catch (error) {
            toast.error('Internal error, please try again.', { position: toast.POSITION.TOP_CENTER });
        }

    }

    return (
        <li className={`studio-video privacy-${privateVid} card`}>

            <Link to={`/video/${id}`}>
                <img src={`http://localhost:5000/${thumbnailPath}`}/>
                <article>
                    <h4 className='studio-video-title'>{title}</h4><br/>
                    <h5 className='studio-video-desc'>{description}</h5>
                    <br/>
                    <small>
                        <b>
                            {
                                (privateVid === true)
                                ?
                                    <span style={{
                                        border: '1px solid #8d0d37',
                                        borderRadius: '5px',
                                        padding: '2px',
                                        backgroundColor: '#757575',
                                        color: '#8d0d37'
                                    }}>
                                        Private
                                    </span>
                                :
                                    <span style={{
                                        border: '1px solid #2de65b',
                                        borderRadius: '5px',
                                        padding: '2px',
                                        backgroundColor: '#757575',
                                        color: '#2de65b'
                                    }}>
                                        Public
                                    </span>
                            }
                        </b>
                    </small>
                </article>
            </Link>

            {
                (creator === auth.userId) &&
                    (toggle !== true) &&
                        <button className="fas fa-ellipsis-h " onClick={toggleHandler}></button>
            }

            <>

                <VModal title={`Manage video: ${title}`} onClose={() => setToggle(false)} show={toggle}>
                    {
                        (creator === auth.userId) &&
                            (toggle === true) &&
                                <div className='studio-modify-buttons'>
                                    <div className='studio-mod-eddel'>
                                        <Link to={`/profile/update/${id}`} >
                                            <Button type='button' color={'yellow'}>
                                                <i className='fas fa-edit' /> Edit video
                                            </Button>

                                            <Route path={`/profile/update/${id}`}>
                                                <UpdateVideo />
                                            </Route>
                                        </Link>

                                        <div>
                                            <Button type='button' onClick={toggleDeleteChoices} color={'orange'}>
                                                <i className='fas fa-trash-alt' /> Delete video
                                            </Button>
                                        </div>

                                        {
                                            (toggleDeleteChoice === true && toggle === true) &&
                                                <>
                                                    <p>Are you sure you want to delete this video?</p>
                                                    <p>This action cannot be undone.</p>
                                                    <Button onClick={toggleDeleteChoices} color={'red'}>
                                                        Cancel
                                                    </Button>
                                                    <Button onClick={handleDelete} color={'blue'}>
                                                        Delete
                                                    </Button>
                                                </>
                                        }

                                        <>
                                            <small>Video is currently: {privateVid === true && privateVideo !== true ? <b style={{ color: '#8d0d37' }}>Private</b> : <b style={{color: '#2de65b'}}>Public</b>}</small>
                                            <form onSubmit={handlePrivacySubmit}>
                                                
                                                {
                                                    toggleVisibility === true
                                                    ?
                                                        <Button type='button' onClick={() => { setToggleVisibility(prevToggle => !prevToggle) }} color={'red'}>
                                                            <i className="fas fa-ban"/> Cancel Privacy Edits
                                                        </Button>
                                                    :
                                                        <Button type='button' onClick={handleChangePrivate} color={'yellow'}>
                                                            <i className="fas fa-key"/> Edit Video Privacy
                                                        </Button>
                                                }

                                                <>
                                                    {
                                                        (privateVid !== '' && toggleVisibility === true) &&
                                                        (privateVid === true && privateVideo !== true)
                                                            ?
                                                                <Button type='submit' color={'green'}>
                                                                    <i className="fas fa-lock-open"/> Make Public
                                                                </Button>
                                                            :
                                                                ((privateVid !== '' && toggleVisibility === true) &&
                                                                (privateVid === false && privateVideo !== false)) &&
                                                                    <Button type='submit' color={'darkred'}>
                                                                        <i className="fas fa-lock"/> Make Private
                                                                    </Button>
                                                    }
                                                </>
                                            </form>

                                        </>

                                    </div>
                                </div>
                    }
                </VModal>
            </>
        </li>
    )
}
