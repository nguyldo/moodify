/* eslint-disable array-callback-return */
import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import '../styles/playlist.css';
// import Cookies from 'js-cookie';

const Song = (props) => {
  const { name, artists, key, albumName, albumLink, image } = props;

  const [heart, setHeart] = useState('/heart-black.svg');

  function isHeart() {
    if (heart === '/heart-black.svg') {
      setHeart('/heart-green.svg');
    } else if (heart === '/heart-green.svg') {
      setHeart('/heart-black.svg');
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
