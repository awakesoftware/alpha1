import { useContext } from 'react';

import { Link, useHistory, useLocation } from 'react-router-dom';

import { AuthContext } from '../../context/auth-context';

import List from '../../components/VideoDisplays/Standard/List';

interface HistoryInterface {
    location: {
        state: {
            userResults: [{
                _id: string
                username: string
                image: string
                mySubscribers: number
                videos: string[]
                about: string
            }],
            videoResults: [{
                _id: string
                category: string
                comments: string[]
                views: number
                likes: number
                title: string
                description: string
                thumbnailPath: string
                filePath: string
                creator: {
                    username: string,
                    image: string
                },
                posted: string
            }],
            searchValue: string
        }
    }
}

export default function Results() {
    const history: HistoryInterface = useHistory();
    const auth = useContext(AuthContext);

    console.log(history);
    

    const userResults = history.location.state?.userResults;
    const videoResults = history.location.state?.videoResults;
    const searchValue = history.location.state?.searchValue;
    
    useLocation(); //* Makes a new search go into the url

    return (
        <div className='results-page'>
            {userResults !== undefined && videoResults !== undefined ? <h1>Results for {searchValue}</h1> : <h1>Oops! No matches for your search "{searchValue}"</h1>}
            <main>
                <section>
                    {userResults?.map(item => (
                        <article>
                            <Link className='results' to={auth.userId === item._id ? `/profile` : `/user/${item._id}`}>
                                <div>
                                    <img alt='profile picture' src={`http://localhost:5000/${item.image}`}/>
                                </div>
                                <section className='user-results'>
                                    <article>
                                        <h4>{item.username}</h4>
                                        <h5>{item.mySubscribers} Subscribers   •   {item.videos.length === 1 ? `${item.videos.length} Video` : `${item.videos.length} Videos`}</h5>
                                        <p>{item.about}</p>
                                    </article>
                                </section>
                            </Link>
                            <button>Subscribe</button>
                        </article>
                    ))}
                </section>
                <List videos={videoResults} text='No Results Found' />{/* Section inside List tag for styling */}
            </main>
        </div>
    );
};