import React from 'react';
import { Link, Route, Switch, useLocation } from 'react-router-dom';

interface PropType { 
    id: string,
    title: string,
    description: string,
    thumbnailPath: string,
    creator: {
        image: string,
        username: string
    },
    views: number,
    datePosted: string,
}

export default function Item(props: PropType) {
    const { id, title, description, thumbnailPath, creator, views, datePosted } = props;

    return (
        <>
            <article>
                <Link to={`/video/${id}`}>
                    <img src={`http://localhost:5000/${thumbnailPath}`} />
                    <section>
                        {creator.image && <img src={`http://localhost:5000/${creator.image}`} />}
                        {!creator.image && <img src={`http://localhost:5000/awakelogo.png`} />}
                        <article>
                            <h4>{title}</h4>
                            {creator.username && <h5>{creator.username}</h5>}
                            {!creator.username && <h5>{'username'}</h5>}
                            {(views ?? datePosted) && <span>{`${views} views    •    ${datePosted?.split('T')[0]} at ${datePosted?.split('T')[1].slice(0, 5)}`}</span>}
                        </article>
                    </section>
                </Link>
            </article>

            {/* <Switch>
                <Route path={`/video/${id}`}>
                    <Video/>
                </Route>
            </Switch> */}

        </>
    )
}
