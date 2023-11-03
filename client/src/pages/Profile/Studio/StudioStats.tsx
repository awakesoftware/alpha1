import React, { useEffect, useState } from 'react';

export default function StudioStats(props) {
    const { vids, publicVideosCount } = props;

    const [ views, setViews ] = useState(Number);

    useEffect(() => {
        const getViews = async () => {
            let count = 0;
    
            (vids !== null && vids !== undefined) &&
            await vids.map(v => {
                count += Number(v.views);
                // console.log(v.views);
            })
    
            setViews(count);
        }

        getViews();
    }, [])

    return (
        <div>
            <div>
                <h3>Statistics</h3>
                <ul style={{ listStyle: 'none', border: '2px solid grey', backgroundColor: 'darkgrey', width: '175px', padding: '5px' }}>
                    <li>
                        <h4><u>Total Videos:</u> { vids !== null || vids !== undefined ? vids.length : null }</h4>
                    </li>
                    <li><b style={{color: '#2de65b'}}>Public</b> Videos: { publicVideosCount !== null || publicVideosCount !== undefined ? publicVideosCount : null }</li>
                    <li><b style={{color: '#8d0d37'}}>Private</b> Videos: { vids.length - publicVideosCount }</li>
                    <br/>
                    <li>Total views: {views}</li>
                </ul>
            </div>

            <br/>

            <div>
                <h3>Chart</h3>
                
            </div>

        </div>
    )
}
