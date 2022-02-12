import React from 'react';

function Login() {
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
            <button onClick={authorizeSpotify}>Login</button>
        </div>
    )
}

export default Login;