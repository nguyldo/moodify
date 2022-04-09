import React from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import '../styles/login.css';

function Login() {
  const accessToken = Cookies.get('SpotifyAccessToken');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (typeof accessToken !== 'undefined') {
      return navigate('/dashboard');
    }
  });

  const {
    REACT_APP_CLIENT_ID,
    REACT_APP_AUTHORIZE_URL,
    REACT_APP_REDIRECT_URL,
  } = process.env;

  const scopes = [
    'user-modify-playback-state',
    'user-read-playback-state',
    'user-read-currently-playing',
    'user-top-read',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-private',
    'playlist-modify-public',
    'user-library-modify',
    'user-library-read',
    'ugc-image-upload',
    'user-follow-modify',
    'streaming',
    'user-read-private',
    'user-read-email',
  ];

  const authorizeSpotify = () => {
    window.location = `${REACT_APP_AUTHORIZE_URL}?client_id=${REACT_APP_CLIENT_ID}&redirect_uri=${REACT_APP_REDIRECT_URL}&scope=${scopes.join('%20')}&response_type=token&show_dialog=true`;
  };

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
  );
}

export default Login;
