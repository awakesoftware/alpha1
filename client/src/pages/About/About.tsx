import React from 'react';

export default function About() {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>About Awake Industries</h1>

            <div className='about-grid'>

                <div className='eosio'>
                    <img src='http://localhost:5000/eosio.png' />
                </div>

                <div className='about-text'>
                    Awake Industries is built
                </div>

            </div>
        </div>
    )
}
