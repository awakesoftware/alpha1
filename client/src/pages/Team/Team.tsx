import React from 'react';
import Members from './members';

export default function Team() {

    const members = Members.map(m => {
        return (
            <div className='team-container'>
                <div className='teamCard-container'>
                    <div className='teamCard'>
                        <figure className='teamCard-front'>
                            <h2>{m.name}</h2>
                            <img className='card-img' src={`${m.photo}`} width='100%' />
                        </figure>
                        <figure className='teamCard-back'>
                            <p><b><u>{m.position}</u></b></p>
                            <p>{m.about}</p>
                        </figure>
                    </div>
                </div>
            </div>
        )
    })

    return (
        <>
            <h1>Awake Industries Team</h1>
            <div className='team' >
                {members}
            </div>
        </>
    )
}
