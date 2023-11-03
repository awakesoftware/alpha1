import React, { useState, useContext } from 'react';
import Button from '../../FormElements/Button';
import { Link, Route, Switch, useHistory } from 'react-router-dom';
import { AuthContext } from '../../../context/auth-context';
import axios from 'axios';
import { toast } from 'react-toastify';


export default function Item(props) {
    const url = window.location.href;
    const pid = url.split('/').slice(-1).toString();

    const { id, title, description, thumbnailPath, creator } = props

    const auth = useContext(AuthContext)
    const history = useHistory();

    const [ toggleButton, setToggleButton ] = useState(false);


    const handleToggle = () => {
        setToggleButton(prevToggle => !prevToggle)
    }

    const handleDelete = async () => {
        try {
            axios({
                method: 'DELETE',
                url: `http://localhost:5000/api/playlists/playlist/${pid}/${id}`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + auth.token
                }
            }).then(res => {
                toast.info(res.data.msg, {position: toast.POSITION.BOTTOM_LEFT});
                history.push(`/`);
            }).catch(error => {
                toast.error('Failed to remove video.', { position: toast.POSITION.TOP_CENTER });
            })

            // history.push(`/`);
            
        } catch (error) {
            toast.error('Failed to remove video.', { position: toast.POSITION.TOP_CENTER });
        }

    }

    return (
        <>
            <div className='card'>
                <Link to={`/video/${id}`}>
                        <img className='item-thumbnail' src={`http://localhost:5000/${thumbnailPath}`} />
                        <h4>{title}</h4>
                </Link>

                {
                    auth.userId !== creator
                    ?
                        null
                    :
                        (toggleButton === false)
                        ?
                        <button className="fas fa-ellipsis-h" onClick={handleToggle} style={{ background: 'none', border: 'none', cursor: 'pointer' }} ></button>
                        :
                            <>
                                <button className="fas fa-times-circle close-btn" onClick={handleToggle} ></button>
                                <Button onClick={handleDelete} color={'orange'}>
                                    {props.text}
                                </Button>
                            </>
                }
            </div>


            <Switch>
                <Route path={`/video/${id}`}>
                </Route>
            </Switch>

        </>
    )
}
