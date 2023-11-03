import React, { useEffect, useState } from 'react';
import StudioStats from './StudioStats';
import StudioVideo from './StudioVideo';


export default function VideoList(props) {
    const { vids } = props;
    const [ publicVideosCount, setPublicVideosCount ] = useState(0);

    useEffect(() => {
        let videos = [];

        vids.map((v, i) => {
            if(v.private === false) {
                videos.push(v);
            }
        })

        setPublicVideosCount(videos.length);
    }, [])

    return (
        <div className='studio-list'>
            <ul>
                {
                    props.vids.length === 0
                    ?
                        null
                    :
                    <>

                        { props.vids.map(video =>
                            <StudioVideo
                                key={video.id}
                                id={video.id}
                                title={video.title}
                                description={video.description}
                                privateVid={video.private}
                                thumbnailPath={video.thumbnailPath}
                                creator={video.creator}
                            />
                        )}
                    </>
                }
            </ul>
            <StudioStats
                vids={vids}
                publicVideosCount={publicVideosCount}
            />

        </div>
    )
}
