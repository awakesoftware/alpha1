import React, { useState, useCallback, useEffect } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import './App.css'; //* This should be the only css import that isn't from a node package

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Art from './pages/Art/Art';
import Auth from './pages/Auth/Auth';
import About from './pages/About/About';
import Team from './pages/Team/Team';
import Contact from './pages/Settings/Contact/Contact';
import Terms from './pages/Terms/Terms';
import Privacy from './pages/Privacy/Privacy';
import Footer from './components/Footer/Footer';
import Home from './pages/VideoPages/Home';
import Settings from './pages/Settings/Settings';
import Results from './pages/SearchResults/Results';
import Navbar from './components/Navbar/Navbar';
import Aside from './components/Aside/Aside';
import Profile from './pages/Profile/Profile';
import Video from './pages/Video/Video';
import Playlist from './pages/Playlist/Playlist';
import OtherUser from './pages/OtherUser/OtherUser';
import FourOhFour from './pages/404/FourOhFour';

import { AuthContext } from './context/auth-context';
import MyWatchLater from './pages/VideoPages/MyWatchLater';
import MyPlaylists from './pages/MyPlaylists/MyPlaylists';
import MyLikedVideos from './pages/VideoPages/MyLikedVideos';
import MyHistory from './pages/VideoPages/MyHistory';
import Trending from './pages/VideoPages/Trending'; 
import Subscriptions from './pages/VideoPages/Subscriptions';
import Notifications from './pages/Notifications/Notifications';
import Loading from './pages/Loading/Loading';
import Activity from './pages/Activity/Activity';
import WelcomePage from './pages/WelcomePage/WelcomePage';
import FooterNavbar from './components/Navbar/FooterNavbar';

interface TokenExpiration {
  getTime: any,
  toISOString: any
}

// type LoginCallbackType = (...args: string[]) => void

let logoutTimer: any;

toast.configure();
export default function App() {
  const [ userId, setUserId ] = useState<string>('');
  const [ userEmail, setUserEmail ] = useState<string>('');
  const [ image, setImage ] = useState<string>('');
  const [ username, setUsername ] = useState<string>('');
  const [ firstName, setFirstName ] = useState<string>('');
  const [ lastName, setLastName ] = useState<string>('');
  const [ token, setToken ] = useState(false);
  const [ darkMode, setDarkMode ] = useState(false);

  const [ tokenExpiration, setTokenExpiration ] = useState<TokenExpiration>();

  const login = useCallback(( uid: string, uEmail: string, uImage: string, uname: string, uFName: string, uLName: string, token: boolean, _tokenExpiration: TokenExpiration ) => {
    setUserId( uid );
    setUserEmail( uEmail );
    setImage( uImage );
    setUsername( uname );
    setFirstName( uFName );
    setLastName( uLName );
    setToken(token);
    // 8 Hours
    const tokenExpiration = _tokenExpiration || new Date(new Date().getTime() + ((1000 * 60 * 60) * 8 ) );

    setTokenExpiration(tokenExpiration);

    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        userEmail: uEmail,
        image: uImage,
        username: uname,
        firstName: uFName,
        lastName: uLName,
        token,
        expiration: tokenExpiration.toISOString()
      })
    );
  }, []);

  const logout = useCallback(() => {
    setUserId('');
    setUserEmail('');
    setImage('');
    setUsername('');
    setFirstName('');
    setLastName('');
    setToken(false);
    setTokenExpiration(undefined);
    localStorage.removeItem('userData');
  }, []);


  useEffect(() => {
    if(token && tokenExpiration) {
      const remainingTime = tokenExpiration.getTime() - new Date().getTime();

      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout( logoutTimer );
    }
  }, [ token, logout, tokenExpiration ])


  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData') || '{}');

    if( storedData && storedData.token && new Date(storedData.expiration) > new Date() ) {
      login(
        storedData.userId,
        storedData.userEmail,
        storedData.image,
        storedData.username,
        storedData.firstName,
        storedData.lastName,
        storedData.token,
        new Date(storedData.expiration)
      );
    }

  }, [login])


  let routes: JSX.Element;

  if(token){
    routes = (
      <Switch>
        {/* Top navbar */}
        <Route path='/search'>
          <Results/>
        </Route>
        <Route path='/activity'>
          <Activity/>
        </Route>
        <Route path='/profile'>
          <Profile />
        </Route>
        <Route path='/settings'>
          <Settings/>
        </Route>
        <Route path='/notifications'>
          <Notifications/>
        </Route>

        {/* Loading */}
        <Route path='/loading'>
          <Loading/>
        </Route>

        {/* Individual video(s) */}
        <Route path='/video'>
          <Video />
        </Route>

        {/* Individual playlist(s) */}
        <Route path='/playlist'>
          <Playlist />
        </Route>

        {/* Other users profile page */}
        <Route path='/user'>
          <OtherUser/>
        </Route>

        {/* Side navbar */}
        <Route path='/subscriptions'>
          <Subscriptions/>
        </Route>

        <Route path='/playlists'>
          <MyPlaylists/>
        </Route>

        <Route path='/later'>
          <MyWatchLater/>
        </Route>

        <Route path='/liked'>
          <MyLikedVideos/>
        </Route>

        <Route path='/trending'>
          <Trending/>
        </Route>

        <Route path='/history'>
          <MyHistory/>
        </Route>

        {/* Footer */}
        <Route path='/about'>
          <About/>
        </Route>
        
        <Route path='/team'>
          <Team/>
        </Route>

        <Route path='/contact'>
          <Contact/>
        </Route>

        <Route path='/terms'>
          <Terms/>
        </Route>

        <Route path='/privacy'>
          <Privacy/>
        </Route>

        {/* Redirect to home */}
        <Route path='/' exact>
          <Home/>
        </Route>

        <Route path='/auth' exact>
          <Redirect to='/'/>
        </Route>

        <Route path='/404'>
          <FourOhFour />
        </Route>

        {/* <Route path={"/404" ? <Redirect to='/404' /> : null} component={FourOhFour} /> */}
        <Redirect to="/404" />

        {/* <Redirect to='/'/> */}
      </Switch>
    );
  }
  else{
    routes = (
      <Switch>
        <Route exact path='/'>
          <WelcomePage/>
        </Route>
        
        <Route exact path='/auth'>
          <Auth/>
        </Route>

        <Route path='/about'>
          <About/>
        </Route>

        <Route path='/team'>
          <Team/>
        </Route>

        <Route path='/contact'>
          <Contact/>
        </Route>

        <Route path='/terms'>
          <Terms/>
        </Route>

        <Route path='/privacy'>
          <Privacy/>
        </Route>

        <Route path='/404'>
          <FourOhFour />
        </Route>

        {/* <Route path={"/404" ? <Redirect to='/404' /> : null} component={FourOhFour} /> */}
        <Redirect to="/404" />

        {/* <Redirect to='/auth'/> */}
      </Switch>
    );
  };

  return ( 
    <AuthContext.Provider 
      value={{
        userId: userId,
        userEmail: userEmail,
        image: image,
        username: username,
        firstName: firstName,
        lastName: lastName,
        token: token,
        isDarkMode: darkMode,
        isLoggedIn: !!token,
        login: () => {},
        logout
      }}
    >
      <div className={`full-page ${darkMode === false ? 'light-mode' : 'dark-mode'}`}>
        <Router>
          <nav className='main-nav'>
            <Navbar/>
          </nav>
          {token && (
            <aside className='main-aside'>
              <Aside/>
            </aside>
          )}
          <main className={`main-content ${token ? 'main-content-logged-in' : 'main-content-logged-out'}`}>
            {routes}
          </main>
          <Footer/>
          <FooterNavbar />
        </Router>
      </div>
    </AuthContext.Provider>
  );
};

