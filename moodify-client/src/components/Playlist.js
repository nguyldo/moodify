/* eslint-disable array-callback-return */
import React from 'react';
import '../styles/playlist.css';
// import Cookies from 'js-cookie';

const Song = (props) => {
  const { name, artists, key } = props;

  return (
    <tr key={key} className="playlist-song">
      <td className="c0"><img src="/heart-black.svg" className="playlist-song-heart" alt="album" /></td>
      <td className="c1"><img src="/logo192.png" className="playlist-song-image" alt="album" /></td>
      <td className="c2">
        <span className="playlist-song-name">{name}</span>
        <br />
        <span className="playlist-song-album">Album Name</span>
      </td>
      <td className="c3 playlist-song-artists">{artists.join(', ')}</td>
      <td className="c4"><img src="/ellipsis.svg" className="playlist-song-kebab" alt="kebab" /></td>
    </tr>
  );
};

function Playlist(props) {
  const { songs } = props;

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
          />
        ))
      ) : (<div />)}
    </table>
  );
}

export default Playlist;
