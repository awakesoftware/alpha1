import React from 'react';
import PlaylistSingle from './PlaylistSingle';



export default function PlaylistList(props) {

    if(props.playlists.length === 0) {
        return (
            <h2 style={{ color: 'black' }} >No playlists found.</h2>
        )
    }

    return (
        <ul>
            
            { props.playlists.map(playlist =>
                <PlaylistSingle
                    key={playlist.id}
                    _id={playlist._id}
                    name={playlist.name}
                    about={playlist.about}
                    creator={playlist.creator}
                    public={playlist.publicStatus}
                />    
            )}
        </ul>
    )
}
