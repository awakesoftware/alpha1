import React from 'react';
import Item from './Item';


export default function List(props) {

    return (
        <ul className='item-item'>
            {
                props.vids.length
                ?
                    props.vids.map(video =>
                        <Item
                            key={video._id}
                            id={video._id}
                            title={video.title}
                            description={video.description}
                            thumbnailPath={video.thumbnailPath}
                            creator={video.creator}
                            text={props.text}
                        />
                    )
                :
                    <div className='center'>
                        <h2>No videos found.</h2>
                    </div>
                
            }
        </ul>
    )
    
}
