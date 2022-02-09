import React from 'react';
import axios from 'axios';

function Dashboard() {
    const { hash } = window.location;
    const accessToken = hash.split('&')[0].split('=')[1];
    const tokenType = hash.split('&')[1].split('=')[1];
    const expiresIn = hash.split('&')[2].split('=')[1];

    React.useEffect(() => {
        axios.get(`http://localhost:5000/user/${accessToken}`)
          .then((data) => {
            console.log(data);
          })
          .catch((err) => {
            console.log(err);
          });
      }, []);

    return (
        <div>
            <p>Access token: {accessToken}</p>
            <p>Token type: {tokenType}</p>
            <p>Expires in: {expiresIn}</p>
        </div>
    )
}

export default Dashboard;