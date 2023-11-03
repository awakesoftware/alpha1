import React from 'react';
import Item from './Item';
import ErrorModal from '../../../../components/UIElements/ErrorModal';
import LoadingSpinner from '../../../../components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../../../hooks/http-hook';


export default function List(props) {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();

    return (
        <section>
            <ErrorModal error={error} onClear={clearError} />

            {isLoading && 
            <div className='center'>
                <LoadingSpinner />
            </div>}

            {
                (props.playlists !== null && props.playlists !== undefined) && props.playlists.length !== 0
                ?
                    props.playlists.map(playlist =>
                        <>
                            {/* <img
                                style={{ width: '50%' }}
                                src={`http://localhost:5000/${playlist.thumbnailPath}`}
                            /> */}
                            <Item
                                key={playlist._id}
                                id={playlist._id}
                                name={playlist.name}
                                description={playlist.description}
                            />
                            {/* <a
                                href={`http://localhost:3000/video/${video._id}`}
                            >{video.title}</a> */}
                        </>
                    )
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
