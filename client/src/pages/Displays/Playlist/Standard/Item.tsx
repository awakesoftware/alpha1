import React from 'react';
import { Link, Route, Switch, useHistory } from 'react-router-dom';

import Card from '../../../../components/UIElements/Card';

export default function Item(props) {
    const { id, name, description } = props

    return (
        <>
            <div className='card'>
                <a href={`/playlist/${id}`}>
            {/* <Link to={`/video/${id}`}> */}
                    <img src={`http://localhost:5000/`/* Placeholder */} />
                    <h4>{name}</h4>
            {/* </Link> */}
                </a>
            </div>

            {/* <Switch>
                <Route path={`/video/${id}`}/>
            </Switch> */}
        </>
    )
}
