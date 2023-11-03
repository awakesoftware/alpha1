import React from 'react';
import Playlist from '../Playlist/Playlist';
import { Link, Route, Switch, useHistory } from 'react-router-dom';
import Card from '../../components/UIElements/Card';


export default function PlaylistSingle(props) {
    const { 
        key,
        _id,
        name,
        about,
        creator,
        publicStatus
     } = props

    return (
        <>   
            <li>
                <Link to={`/playlist/${_id}`}>
                    <img src="https://www.shutterstock.com/blog/wp-content/uploads/sites/5/2017/08/nature-design.jpg" />
                    <section>
                        <i className="fas fa-list-ul"></i>        
                        <h2>{name}</h2>
                        <p>{about}</p>
                    </section>
                </Link>
            </li>

            <Switch>
                <Route path={`/playlist/${_id}`}>
                    <Playlist id={_id} />
                </Route>
            </Switch>
        </>
    )
}
