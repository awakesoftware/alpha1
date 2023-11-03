import React, { useState, useEffect, useContext, useRef } from 'react';

// import useDebounce from '../../../hooks/useDebounce'; //* useEffect but with a timer

import { useHttpClient } from '../../../hooks/http-hook';

import { AuthContext } from '../../../context/auth-context';

import { useHistory } from 'react-router-dom';

import Button from '../../FormElements/Button';

interface UserResultsType {
    userResult: {
        _id: string
        videos: []
        subscribedTo: []
        mySubscribers: []
        isAdmin: boolean
        image: string
        email: string
        username: string
        memberSince: string
        likedComments: []
    }
    map: (item: {}) => {}
}

interface VideoResultsType {
    videoResult: {
        _id: string,
        category: string,
        comments: [],
        views: number,
        likes: number,
        title: string,
        description: string,
        creator: string,
        posted: string,
    }
    map: (item: {}) => {}
}

export default function SearchBar() {
    const [suggestions, toggleSuggestions] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [searchInputValue, setSearchInputValue] = useState('')
    const [userResults, setUserResults] = useState<UserResultsType>();
    
    const [videoResults, setVideoResults] = useState<VideoResultsType>();

    const searchRef = useRef<any>(null);

    const history = useHistory();

    const auth = useContext(AuthContext);

    const { /*isLoading, error, */sendRequest/*, clearError*/ } = useHttpClient();



    useEffect(() => {
        const searcher = async () => {
            //* Filters users using Regex in user controller
            try {
                const userResponseData = await sendRequest(
                    `http://localhost:5000/api/users/search?username=${searchValue}`,
                    "GET"
                );
                setUserResults(userResponseData);
            } catch (error) {}
            //* Filters videos using Regex in video controller
            try {
                const videoResponseData = await sendRequest(
                    `http://localhost:5000/api/videos/search?title=${searchValue}`,
                    "GET",
                    null,
                    {
                        Authorization: 'Bearer ' + auth.token
                    }
                );
                setVideoResults(videoResponseData);
            } catch (error) {};
        };
        searcher();

        setSearchInputValue(searchValue);

    }, [searchValue]);
    
    // const searchHandler = () => {
    //     if(searchValue === undefined || searchValue === "" || searchValue.trim() === ''){
    //         setSearchValue('');
    //         toggleSuggestions(false);
    //         searchRef.current.blur();
    //     }
    //     else{
    //         history.push({pathname: '/search', search: searchValue, state: {userResults, videoResults, searchValue}});
    //         searchRef.current.blur();
    //     }
    // };
    const searchHandler = () => {
        if(searchValue !== undefined || searchValue !== "" || searchValue.trim() !== ''){
            console.log(searchValue);    
            history.push({pathname: '/search', search: searchValue, state: {userResults, videoResults, searchValue}});
            searchRef.current.blur();
        }
        else{
            setSearchValue('');
            toggleSuggestions(false);
            searchRef.current.blur();
        }
    };

    const updateSearchValueOnHover = () => {
        console.log(searchValue);
        
    }

    return (
        <>
            <form className='searchbar' onSubmit={(e) => {
                e.preventDefault(); 
                searchHandler();
            }}>
                <input 
                    placeholder={'Search...'}
                    onChange={(e) => {
                        setSearchValue(e.target.value);
                    }}
                    onFocus={() => {
                        toggleSuggestions(true);
                    }}
                    onBlur={() => {
                        setTimeout(() => {
                            toggleSuggestions(false);
                        }, 100);
                    }}
                    ref={searchRef}
                />
                <Button type='submit' disabled={searchValue === '' || searchValue === undefined}><i className="fas fa-search"></i></Button>
                {/* <button type='submit' disabled={searchValue === '' || searchValue === undefined}><i className="fas fa-search"></i></button> */}
            </form>
            {
                suggestions && searchValue !== '' ? (
                    <ul className='searchbar-suggestions'>
                        {/* {userResults.map(item => <li className='searchbar-result' onClick={searchHandler}>{item.username}</li>)}
                        {videoResults.map(item => <li className='searchbar-result' onClick={searchHandler}>{item.title}</li>)} */}
                        {userResults?.map(item => <li className='searchbar-result' 
                        onMouseEnter={() => {
                            setSearchInputValue(item.username);
                            console.log(searchInputValue);
                            searchRef.current.value = searchInputValue;
                        }}
                        // onMouseLeave={() => {
                        //     setSearchInputValue(searchValue)
                        //     console.log(searchInputValue);    
                        //     searchRef.current.value = searchValue
                        // }}
                        onClick={() => {
                            setSearchValue(item.username)
                            searchHandler()
                        }}
                        >{item.username}
                        </li>)
                        }

                        {videoResults?.map(item => <li className='searchbar-result' onClick={searchHandler}>{item.title}</li>)}
                    </ul>
                )
                :
                <></>
            }
        </>
    );
};




// import { useState, useEffect, useContext, useRef } from 'react';
// import { Link } from 'react-router-dom';
// import useDebounce from '../../../hooks/useDebounce';

// import { useHttpClient } from '../../../hooks/http-hook';

// import { AuthContext } from '../../../context/auth-context';

// import { useHistory } from 'react-router-dom';

// import Button from '../../FormElements/Button';

// interface User {
//     _id: string,
//     videos: [],
//     subscribedTo: [],
//     mySubscribers: [],
//     isAdmin: boolean,
//     image: string,
//     email: string,
//     username: string,
//     memberSince: string,
//     likedComments: []
// }

// interface Video {
//     _id: string,
//     category: string,
//     comments:[],
//     views: number,
//     likes: number,
//     title: string,
//     description: string,
//     creator: string,
//     posted:string,
// }

// export default function SearchBar() {
//     const [suggestions, toggleSuggestions] = useState(false);
//     const [userSuggestions, setUserSuggestions] = useState<User[]>([])
//     const [videoSuggestions, setVideoSuggestions] = useState<Video[]>([])
//     const [searchValue, setSearchValue] = useState('');

//     const [userResults, setUserResults] = useState([
//         // {
//         //     _id: '',
//         //     videos: [],
//         //     subscribedTo: [],
//         //     mySubscribers: [],
//         //     isAdmin: false,
//         //     image: '',
//         //     email: '',
//         //     username: '',
//         //     memberSince: '',
//         //     likedComments: []
//         // }
//     ]);
    
//     const [videoResults, setVideoResults] = useState([
//         // {
//         //     _id: '',
//         //     category: '',
//         //     comments:[],
//         //     views:0,
//         //     likes:0,
//         //     title: '',
//         //     description: '',
//         //     creator: '',
//         //     posted:'',
//         // }
//     ]);

//     //* useEffect that runs when user pauses typing in searchbar
//     //* This stops the server from being bombarded with GET requests every keystroke
//     // useDebounce(() => {
//     //     const searcher = async () => {
//     //         try {
//     //             const userResponseData = await sendRequest(
//     //                 `http://localhost:5000/api/users/search?username=${searchValue}`,
//     //                 "GET"
//     //             );
//     //             setUserSuggestions(userResponseData);                
//     //         } catch (error) {}
            
//     //         try {
//     //             const videoResponseData = await sendRequest(
//     //                 `http://localhost:5000/api/videos/search?title=${searchValue}`,
//     //                 "GET",
//     //                 null,
//     //                 {
//     //                     Authorization: 'Bearer ' + auth.token
//     //                 }
//     //             );
//     //             setVideoSuggestions(videoResponseData);                
//     //         } catch (error) {};
//     //     };
//     //     searcher();
//     // }, 750, [searchValue]);

//     useEffect(() => {
//         const searcher = async () => {
//             try {
//                 const userResponseData = await sendRequest(
//                     `http://localhost:5000/api/users/search?username=${searchValue}`,
//                     "GET"
//                 );
//                 setUserSuggestions(userResponseData);                
//             } catch (error) {}
            
//             try {
//                 const videoResponseData = await sendRequest(
//                     `http://localhost:5000/api/videos/search?title=${searchValue}`,
//                     "GET",
//                     null,
//                     {
//                         Authorization: 'Bearer ' + auth.token
//                     }
//                 );
//                 setVideoSuggestions(videoResponseData);                
//             } catch (error) {};
//         };
//         searcher();
//     }, [searchValue]);

//     const searchRef = useRef<any>(null);

//     const history = useHistory();

//     const auth = useContext(AuthContext);

//     const { /*isLoading, error, */sendRequest/*, clearError*/ } = useHttpClient();

//     const searchSubmitHandler = async () => {
//         //* Filters users using Regex in user controller
//         try {
//             const userResponseData = await sendRequest(
//                 `http://localhost:5000/api/users/search?username=${searchValue}`,
//                 "GET"
//             );
//             setUserResults(userResponseData);                
//         } catch (error) {}
//         //* Filters videos using Regex in video controller
//         try {
//             const videoResponseData = await sendRequest(
//                 `http://localhost:5000/api/videos/search?title=${searchValue}`,
//                 "GET",
//                 null,
//                 {
//                     Authorization: 'Bearer ' + auth.token
//                 }
//             );
//             setVideoResults(videoResponseData);                
//         } catch (error) {};
//     };
    
//     const searchHandler = () => {
//         if(searchValue === undefined || searchValue === "" || searchValue.trim() === ''){
//             setSearchValue('');
//             toggleSuggestions(false);
//             searchRef.current.blur();
//         }
//         else{
            
//             history.push({pathname: '/search', search: searchValue, state: {userResults, videoResults, searchValue}});
//             searchRef.current.blur();
//         }
//     };

//     const suggestedSearch = () => {
//         searchRef.current.append('hi')
//     }

//     return (
//         <>
//             <form className='searchbar' onSubmit={(e) => {
//                 e.preventDefault(); 
//                 searchSubmitHandler();
//             }}>
//                 <input 
//                     placeholder={'Search...'}
//                     onChange={(e) => {
//                         setSearchValue(e.target.value);
//                         console.log(e.target.value);
                        
//                     }}
//                     onFocus={() => {
//                         toggleSuggestions(true);
//                     }}
//                     onBlur={() => {
//                         setTimeout(() => {
//                             toggleSuggestions(false);
//                         }, 100);
//                     }}
//                     ref={searchRef}
//                 />
//                 <Button type='submit' disabled={searchValue === '' || searchValue === undefined}><i className="fas fa-search"></i></Button>
//                 {/* <button type='submit' disabled={searchValue === '' || searchValue === undefined}><i className="fas fa-search"></i></button> */}
//             </form>
//             {
//                 suggestions && searchValue !== '' ? (
//                     <ul className='searchbar-suggestions'>
//                         {userSuggestions.map(item => <li className='searchbar-result' onClick={searchHandler}>{item.username}</li>)}
//                         {videoSuggestions.map(item => <li className='searchbar-result' onClick={searchHandler}>{item.title}</li>)}
//                     </ul>
//                 )
//                 :
//                 <></>
//             }
//         </>
//     );
// };

