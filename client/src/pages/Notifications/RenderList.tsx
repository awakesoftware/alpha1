import React from 'react';
import RenderSingle from './RenderSingle';

export default function Notifications(props) {

    if(props.notifications.length === 0) {
        return (
            <div className='center'>
                <h2 style={{ color: 'black' }} >No notifications.</h2>
            </div>
        )
    }

    // console.log(props.items); //TODO: map through notifications 6 times in the dropdown

    return (
        <ul>
            { props.notifications.map(notification =>
                <RenderSingle
                    key={notification.id}
                    id={notification.id}
                    text={notification.text}
                    sendingUser={notification.sendingUser}
                    video={notification.video}
                    posted={notification.posted}
                />    
            )}
        </ul>
    )
}
