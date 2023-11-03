import React, { useState, useEffect, useContext, useRef } from 'react';

import { useHttpClient } from '../../../hooks/http-hook';

import { AuthContext } from '../../../context/auth-context';

import { useHistory } from 'react-router-dom';

import Button from '../../../components/FormElements/Button';

export default function SearchBy() {
    const [suggestions, toggleSuggestions] = useState(false);
    const [searchValue, setSearchValue] = useState(undefined);
    const [userResults, setUserResults] = useState(null);

    const searchRef = useRef(null);

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
            
        };
        searcher();

    }, [searchValue]);
    
    const searchHandler = () => {
        if(searchValue === undefined || searchValue === "" || searchValue.trim() === ''){
            setSearchValue(undefined);
            toggleSuggestions(false);
            searchRef.current.blur();
        } else if(searchValue !== undefined || searchValue !== "" || searchValue.trim() !== '') {
            // history.push({pathname: '/search', search: searchValue, state: {userResults, searchValue}});
            searchRef.current.blur();
        }
    };

    return (
        <div className='admin-grid' style={{width: '50%', display: 'grid', gridTemplateColumns: '30% 70%'}}>
            
            <form onSubmit={(e) => {
                e.preventDefault();
                searchHandler();
            }}>
                <h4>Search by user</h4>
                <input style={{width: '200px'}}
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
            </form>
            {suggestions && searchValue !== '' &&
                (
                    <ul className='searchbar-suggestions'>
                        {userResults.map(item => <li className='searchbar-result' onClick={searchHandler}>{item.username}</li>)}
                    </ul>
                )
            }

            {
                <div>
                    { searchValue !== undefined ?
                        <h4>Manage {`${searchValue}`}</h4>
                        : <h4>Manage user</h4>
                    }
                    <select style={{width: '300px'}}>
                        <option selected disabled hidden>Choose an option...</option>
                        <option>Show private videos</option>
                        <option>Show deleted videos</option>
                        <option>Manage user</option>
                    </select>
                </div>
            }

        </div>
    );
};