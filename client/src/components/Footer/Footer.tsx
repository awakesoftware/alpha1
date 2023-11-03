import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer data-testid='footer' className='footer' >
            
            <ul>
                {/* <li>
                    <Link to='/about' className='company-details'>
                        About
                    </Link>
                </li>
                <li>
                    <Link to='/team' className='company-details'>
                        Our Team
                    </Link>
                </li> */}
            </ul>

            <section>
                <p>
                    Copyright © 2020 - 2021 Awake Industries LLC. All rights reserved.   
                </p>
                <article>
                    {/* <Link to='/terms' className='terms'>Terms of Use</Link>  |  <Link to='/privacy' className='terms'>Privacy Policy</Link> */}
                </article>
            </section>

            <section>
                <a className='social-link-a youtube' href='https://www.youtube.com' target='_blank' >
                    <i className="fab fa-youtube fa-lg social-link"/>
                </a>
                <a className='social-link-a instagram' href='https://www.instagram.com' target='_blank' >
                    <i className="fab fa-instagram fa-lg social-link"/>
                </a>
                <br/>
                <a className='social-link-a facebook' href='https://www.facebook.com' target='_blank' >
                    <i className="fab fa-facebook fa-lg social-link"/>
                </a>
                <a className='social-link-a linkedin' href='https://www.linkedin.com' target='_blank' >
                    <i className="fab fa-linkedin-in fa-lg social-link"/>
                </a>
            </section>

        </footer>
    )
}
