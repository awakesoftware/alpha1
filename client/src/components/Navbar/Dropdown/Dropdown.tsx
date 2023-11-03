import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';

//TODO: Fix toggle where it reopens when clicked after clicking child link

interface PropType { 
    children: {},
    className: any,
    dropButtonContent: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal,
    dropMenuClassName: any
}

export default function Dropdown(props: PropType) {
    const [activeToggle, setActiveToggle] = useState(false);

    const dropdownParentRef = useRef(null);

    const history = useHistory();

    // useEffect(() => {
    //     return history.listen((location) => {
    //         setActiveToggle(false);
    //         console.log(activeToggle);
    //         console.log(`You changed the page to: ${location.pathname}`);
    //     })
    // }, [history])

    return (
        <article 
            // onFocus={e => {
            //     if (e.currentTarget === e.target){
            //         console.log('focused parent');
            //     } else {
            //         console.log('focused child', e.target);
            //     }
            //     if (e.target.contains(e.relatedTarget)){
            //         console.log('focus entered parent');
            //     }
            // }} 
            onBlur={e => {
                if (e.currentTarget !== e.target){
                    if(e.target != props.children){
                        setActiveToggle(false);
                    }
                }
                // } else {
                //     console.log('unfocused child', e.target);
                // }
                // if (e.target.contains(e.relatedTarget)){
                //     console.log('focus left parent');
                //     setActiveToggle(false)
                // }
            }} 
            ref={dropdownParentRef}
            className={`${props.className} dropdown ${activeToggle ? 'active' : ''}`}
        >
            <button className='dropdown-btn' 
                onClick={() => {
                    if(activeToggle){
                        setActiveToggle(false)
                    } else {
                        setActiveToggle(true)
                    }
                }}
            >
                {props.dropButtonContent}
            </button>
            <ul className={`dropdown-menu ${props.dropMenuClassName}`}>
                {props.children}
            </ul>
        </article>
    )
}
