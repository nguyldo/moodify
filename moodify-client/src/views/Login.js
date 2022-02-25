import React from 'react';
import Button from '../components/Button';
import Cookies from 'js-cookie';

import '../styles/login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
    const accessToken = Cookies.get('SpotifyAccessToken')
    let navigate = useNavigate()

    React.useEffect(() => {
        if (typeof accessToken !== 'undefined') {
            return navigate('/dashboard')
        }
    })

    const {
        REACT_APP_CLIENT_ID,
        REACT_APP_AUTHORIZE_URL,
        REACT_APP_REDIRECT_URL,
      } = process.env;
    
      const scopes = [
        'user-read-currently-playing',
        'user-read-playback-state',
        'user-top-read',
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-private',
        'playlist-modify-public',
      ];

    const authorizeSpotify = () => {
        window.location = `${REACT_APP_AUTHORIZE_URL}?client_id=${REACT_APP_CLIENT_ID}&redirect_uri=${REACT_APP_REDIRECT_URL}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
    }

    return (
        <div>
            <div className="login-page">
                <div className="login-page-items">
                    <div className="moodify-title">
                        Moodify
                    </div>
                    <div>
                        <img src="/logo-white.png" alt="logo" className="logo" />
                    </div>
                    <div>
                        <Button text="Log in with Spotify" onClick={authorizeSpotify} type="wide" color="green" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;