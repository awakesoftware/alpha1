import React, { useEffect, useContext } from 'react';
import { AuthContext } from '../../../context/auth-context';
import WelcomeVideo from '../WelcomeVideo/WelcomeVideo';

export default function Home() {
    const auth = useContext( AuthContext );

    return (
        <WelcomeVideo/>
    )
};
