/* eslint-disable array-callback-return */
import React, { useState } from 'react';
import { Toast, Dropdown } from 'react-bootstrap';
import '../styles/playlist.css';
import Button from './Button';
// import Cookies from 'js-cookie';

const Song = (props) => {
  const { name, artists, key, albumName, albumLink, image } = props;

  const [heart, setHeart] = useState('/heart-black.svg');
  const [showLikeAlert, setShowLikeAlert] = useState(false);
  const [showUnlikeAlert, setShowUnlikeAlert] = useState(false);

  const likeAlert = (
    <Toast
      className="alert"
      style={{
        position: 'fixed', top: '10%', left: '50%', transform: 'translate(-50%, -50%)',
      }}
      onClose={() => setShowLikeAlert(false)}
      show={showLikeAlert}
      delay={3000}
      autohide
    >
      <Toast.Body className="alert-text">Song has been added to &quot;Liked Songs&quot;</Toast.Body>
      <Button color="green" type="wide" text="OK" onClick={() => setShowLikeAlert(false)} />
    </Toast>
  );

  const unlikeAlert = (
    <Toast
      className="alert"
      style={{
        position: 'fixed', top: '10%', left: '50%', transform: 'translate(-50%, -50%)',
      }}
      onClose={() => setShowUnlikeAlert(false)}
      show={showUnlikeAlert}
      delay={3000}
      autohide
    >
      <Toast.Body className="alert-text">Song has been removed from &quot;Liked Songs&quot;</Toast.Body>
      <Button color="green" type="wide" text="OK" onClick={() => setShowUnlikeAlert(false)} />
    </Toast>
  );

  function isHeart() {
    if (heart === '/heart-black.svg') {
      setHeart('/heart-green.svg');
      setShowLikeAlert(true);
    } else if (heart === '/heart-green.svg') {
      setHeart('/heart-black.svg');
      setShowUnlikeAlert(true);
    }
  }

  return (
    <tr key={key} className="playlist-song">
      <td className="c0"><button onClick={() => isHeart(heart)} type="button" className="button-wrapper"><img src={heart} className="playlist-song-heart" alt="heart" /></button></td>
      <td className="c1"><img src={image} className="playlist-song-image" alt="album" /></td>
      <td className="c2">
        <span className="playlist-song-name">{name}</span>
        <br />
        <span className="playlist-song-album"><a className="album-link" target="_blank" rel="noreferrer" href={albumLink}>{albumName}</a></span>
      </td>
      <td className="c3 playlist-song-artists">{artists.map((artist) => <span className="artist-comma"><a className="artist-link" target="_blank" rel="noreferrer" href={artist.url}>{artist.name}</a></span>)}</td>
      <Dropdown>
        <Dropdown.Toggle id="dropdown-basic">
          <img src="/ellipsis.svg" className="playlist-song-kebab" alt="kebab" />
        </Dropdown.Toggle>

        <Dropdown.Menu className="playlist-kebab-options">
          <Dropdown.Item className="option" href="#">Song Credits</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      {likeAlert}
      {unlikeAlert}
    </tr>
  );
};

function Playlist(props) {
  const { songs } = props;
  console.log(songs);

  return (
    <table className="playlist-table">
      <tr key={0} className="playlist-header">
        <td className="c0" />
        <td className="c1" />
        <td className="c2">Song</td>
        <td className="c3">Artists</td>
        <td className="c4" />
      </tr>
      {songs && songs.length > 0 ? (
        songs.map((song) => (
          <Song
            key={song.id}
            name={song.name}
            artists={song.artists}
            albumName={song.album}
            albumLink={song.albumUrl}
            image={song.image.url}
          />
        ))
      ) : (<div />)}
    </table>
  );
}

export default Playlist;
