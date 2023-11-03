import React from 'react';
import Item from './Item';
import ErrorModal from '../../UIElements/ErrorModal';
import LoadingSpinner from '../../UIElements/LoadingSpinner';
import { useHttpClient } from '../../../hooks/http-hook';

interface PropTypes { 
    videos: [{
        _id: string,
        title: string,
        description: string,
        thumbnailPath: string,
        creator: {
            image: string,
            username: string
        },
        posted: string,
        views: number,
        category: string
    }],
    text: string
}

export default function List(props: PropTypes) {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    return (
        <section>
            <ErrorModal error={error} onClear={clearError} />

            { isLoading && 
                <LoadingSpinner />
            }

            {
                props.videos !== null && props.videos
                ?
                    props.videos.map(video => (
                        <Item
                            key={video._id}
                            id={video._id}
                            title={video.title}
                            description={video.description}
                            thumbnailPath={video.thumbnailPath}
                            creator={video.creator}
                            datePosted={video.posted}
                            views={video.views}
                            // username={video.username}
                        />
                    ))
                :
                    <div className='center'>
                        <h2 style={{ color: 'black' }} >
                            {props.text}
                        </h2>
                    </div>
            }
        </section>
    )
    
}
