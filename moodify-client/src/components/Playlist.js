/* eslint-disable array-callback-return */
import React, { useState } from 'react';
import { Toast, Dropdown, Modal } from 'react-bootstrap';
import '../styles/playlist.css';

import Cookies from 'js-cookie';
import Button from './Button';

const axios = require('axios');

const Song = (props) => {
  const { name, artists, id, albumName, albumLink, image, saved, bool, uri, play } = props;
  // console.log(props);

  const [heart, setHeart] = useState(saved ? '/heart-green.svg' : '/heart-black.svg');
  const [creditModalShow, setCreditModalShow] = useState(false);
  const [playlistModalShow, setPlaylistModalShow] = useState(false);
  const [performed, setPerformed] = useState('');
  const [written, setWritten] = useState([]);
  const [userPlaylist, setUserPlaylist] = useState([]);
  const [produced, setProduced] = useState([]);
  const [showLikeAlert, setShowLikeAlert] = useState(false);
  const [showUnlikeAlert, setShowUnlikeAlert] = useState(false);
  const [lyrics, setLyrics] = useState('');
  const [showLyricsModal, setShowLyricsModal] = useState(false);
  const [showAddSongAlert, setShowAddSongAlert] = useState(false);
  const [showAddSongFailAlert, setShowAddSongFailAlert] = useState(false);
  const [showFollowArtistAlert, setFollowArtistAlert] = useState(false);
  const [showFollowArtistFailAlert, setFollowArtistFailAlert] = useState(false);
  const [showFollowAlbumAlert, setFollowAlbumAlert] = useState(false);
  const [showFollowAlbumFailAlert, setFollowAlbumFailAlert] = useState(false);

  const accessToken = Cookies.get('SpotifyAccessToken');

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

  const addSongAlert = (
    <Toast
      className="alert"
      style={{
        position: 'fixed', top: '10%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '999999', backgroundColor: 'white',
      }}
      onClose={() => setShowAddSongAlert(false)}
      show={showAddSongAlert}
      delay={3000}
      autohide
    >
      <Toast.Body className="alert-text">Song has been added to your playlist!</Toast.Body>
      <Button color="green" type="wide" text="OK" onClick={() => setShowAddSongAlert(false)} />
    </Toast>
  );

  const addSongFailAlert = (
    <Toast
      className="alert"
      style={{
        position: 'fixed', top: '10%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: '999999',
      }}
      onClose={() => setShowAddSongFailAlert(false)}
      show={showAddSongFailAlert}
      delay={3000}
      autohide
    >
      <Toast.Body className="alert-text">Song cannot be added to your playlist!</Toast.Body>
      <Button color="green" type="wide" text="OK" onClick={() => setShowAddSongFailAlert(false)} />
    </Toast>
  );

  const creditModal = (
    <Modal
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={creditModalShow}
    >
      <Modal.Body className="modal-text">
        <h3 style={{ color: 'green' }}>Song Credits</h3>
        <b>Performed by:</b>
        <p>
          {performed}
        </p>
        <b>Written by:</b>
        <p>
          {written}
        </p>
        <b>Produced by:</b>
        <p>
          {produced}
        </p>
        <Button style={{ textAlign: 'center' }} onClick={() => setCreditModalShow(false)} color="green" type="wide" text="Close" />
      </Modal.Body>
    </Modal>
  );

  async function AddSongToPlaylist(playlistId) {
    const data = await axios.post(`http://localhost:5000/playlist/add?playlist=${playlistId}&song=${id}&token=${accessToken}`);
    console.log(data);
    if (data) {
      setShowAddSongAlert(true);
    } else {
      setShowAddSongFailAlert(true);
    }
  }

  const addToPlaylistModal = (
    <Modal
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={playlistModalShow}
    >
      <Modal.Body className="modal-text">
        <h3 style={{ color: 'green' }}>Your Playlists</h3>
        <tbody>
          {userPlaylist.map((playlist) => (
            <tr key={playlist.id}>
              <td>
                <div style={{ marginBottom: '10px' }}>{playlist.name}</div>
              </td>
              <td>
                <div style={{ marginBottom: '10px', marginLeft: '130px' }}>
                  <Button
                    color="green"
                    type="wide"
                    text="Add"
                    onClick={() => {
                      AddSongToPlaylist(
                        playlist.id,
                      );
                    }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
        <Button style={{ textAlign: 'center' }} onClick={() => setPlaylistModalShow(false)} color="green" type="wide" text="Close" />
      </Modal.Body>
    </Modal>
  );

  const lyricsModal = (
    <Modal
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={showLyricsModal}
    >
      <Modal.Body className="modal-text">
        <h3 style={{ color: 'green' }}>Song Lyrics</h3>
        <p>
          {lyrics}
        </p>
        <Button style={{ textAlign: 'center' }} onClick={() => setShowLyricsModal(false)} color="green" type="wide" text="Close" />
      </Modal.Body>
    </Modal>
  );

  const followArtistAlert = (
    <Toast
      className="alert"
      style={{
        position: 'fixed', top: '10%', left: '50%', transform: 'translate(-50%, -50%)',
      }}
      onClose={() => setFollowArtistAlert(false)}
      show={showFollowArtistAlert}
      delay={3000}
      autohide
    >
      <Toast.Body className="alert-text">Successfully followed artist!</Toast.Body>
      <Button color="green" type="wide" text="OK" onClick={() => setFollowArtistAlert(false)} />
    </Toast>
  );

  const followArtistFailAlert = (
    <Toast
      className="alert"
      style={{
        position: 'fixed', top: '10%', left: '50%', transform: 'translate(-50%, -50%)',
      }}
      onClose={() => setFollowArtistFailAlert(false)}
      show={showFollowArtistFailAlert}
      delay={3000}
      autohide
    >
      <Toast.Body className="alert-text">Failure to follow artist</Toast.Body>
      <Button color="green" type="wide" text="OK" onClick={() => setFollowArtistFailAlert(false)} />
    </Toast>
  );

  const followAlbumAlert = (
    <Toast
      className="alert"
      style={{
        position: 'fixed', top: '10%', left: '50%', transform: 'translate(-50%, -50%)',
      }}
      onClose={() => setFollowAlbumAlert(false)}
      show={showFollowAlbumAlert}
      delay={3000}
      autohide
    >
      <Toast.Body className="alert-text">Successfully followed album!</Toast.Body>
      <Button color="green" type="wide" text="OK" onClick={() => setFollowAlbumAlert(false)} />
    </Toast>
  );

  const followAlbumFailAlert = (
    <Toast
      className="alert"
      style={{
        position: 'fixed', top: '10%', left: '50%', transform: 'translate(-50%, -50%)',
      }}
      onClose={() => setFollowAlbumFailAlert(false)}
      show={showFollowAlbumFailAlert}
      delay={3000}
      autohide
    >
      <Toast.Body className="alert-text">Failure to follow album</Toast.Body>
      <Button color="green" type="wide" text="OK" onClick={() => setFollowAlbumFailAlert(false)} />
    </Toast>
  );

  async function isHeart(songId) {
    if (heart === '/heart-black.svg') {
      setHeart('/heart-green.svg');
      setShowLikeAlert(true);
      console.log('accessToken in hearting');
      console.log(accessToken);
      await axios.put(`http://localhost:5000/playlist/save?ids=${songId}&token=${accessToken}`);
    } else if (heart === '/heart-green.svg') {
      setHeart('/heart-black.svg');
      setShowUnlikeAlert(true);
      axios.delete(`http://localhost:5000/playlist/remove?ids=${songId}&token=${accessToken}`);
    }
  }

  async function SongCreditsClick(songTitle, artist) {
    const data = await axios.get(`http://localhost:5000/song/get/credits?songTitle=${songTitle}&artist=${artist}`);

    const writtenBy = data.data.writtenBy.join(', ');
    const producedBy = data.data.producedBy.join(', ');

    setPerformed(data.data.performedBy);
    setWritten(writtenBy);
    setProduced(producedBy);

    setCreditModalShow(true);
  }

  async function GetUserPlaylists() {
    console.log('accessToken from GetUserPlaylists');
    console.log(accessToken);
    const playlists = await axios.get(`http://localhost:5000/playlist/all?token=${accessToken}`);
    setUserPlaylist(playlists.data);
    console.log('user playlists');
    console.log(userPlaylist);
    setPlaylistModalShow(true);
  }

  async function showSongLyrics() {
    const data = await axios.get(`http://localhost:5000/song/lyrics/${artists[0].name}/${name}`);
    console.log(data);
    console.log(data.data);
    const lineByLine = data.data.split('\n');
    const lyrical = lineByLine.map((line) => <p key={line}>{line}</p>);
    setLyrics(lyrical);
    setShowLyricsModal(true);
  }

  async function followArtist(artistId) {
    await axios.put(`http://localhost:5000/user/follow/artist?id=${artistId}&token=${accessToken}`)
      .then((data) => {
        console.log(data);
        setFollowArtistAlert(true);
      })
      .catch((err) => {
        console.log(err);
        setFollowArtistFailAlert(true);
      });
  }

  async function followAlbum() {
    const albumSplit = albumLink.split('/');
    const albumId = albumSplit[4];
    await axios.put(`http://localhost:5000/user/follow/album?id=${albumId}&token=${accessToken}`)
      .then((data) => {
        console.log(data);
        setFollowAlbumAlert(true);
      })
      .catch((err) => {
        console.log(err);
        setFollowAlbumFailAlert(true);
      });
  }

  const style = {
    backgroundColor: 'white',
  };

  if (bool) {
    style.backgroundColor = '#cccccc';
  }

  return (
    <tr key={id} className="playlist-song" style={style}>
      <td className="c0"><button onClick={() => isHeart(id)} type="button" className="button-wrapper"><img src={heart} className="playlist-song-heart" alt="heart" /></button></td>
      <td className="c1"><img src={image} className="playlist-song-image" alt="album" /></td>
      <td className="c2">
        <span className="playlist-song-name">{name}</span>
        <button onClick={() => play(uri)} type="button" className="button-wrapper"><img src="/play-fill.svg" alt="play" /></button>
        <br />
        <span className="playlist-song-album"><a className="album-link" target="_blank" rel="noreferrer" href={albumLink}>{albumName}</a></span>
      </td>
      <td className="c3 playlist-song-artists">{artists.map((artist) => <span className="artist-comma"><a className="artist-link" target="_blank" rel="noreferrer" href={artist.url}>{artist.name}</a></span>)}</td>
      <Dropdown>
        <Dropdown.Toggle id="dropdown-basic">
          <img src="/ellipsis.svg" className="playlist-song-kebab" alt="kebab" />
        </Dropdown.Toggle>

        <Dropdown.Menu className="playlist-kebab-options">
          <Dropdown.Item className="option" href="#" onClick={() => SongCreditsClick(name, artists[0].name)}>Song Credits</Dropdown.Item>
          <Dropdown.Item className="option" onClick={() => showSongLyrics()}>Song Lyrics</Dropdown.Item>
          {artists.map((artist) => (
            <Dropdown.Item className="option" onClick={() => followArtist(artist.id)}>
              Follow&nbsp;
              {artist.name}
            </Dropdown.Item>
          ))}
          <Dropdown.Item className="option" onClick={() => followAlbum()}>
            Follow&nbsp;
            {albumName}
          </Dropdown.Item>
          <Dropdown.Item className="option" href="#" onClick={() => GetUserPlaylists()}>Add to playlist</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      {likeAlert}
      {unlikeAlert}
      {creditModal}
      {lyricsModal}
      {addToPlaylistModal}
      {addSongAlert}
      {addSongFailAlert}
      {followArtistAlert}
      {followArtistFailAlert}
      {followAlbumAlert}
      {followAlbumFailAlert}
    </tr>
  );
};

function Playlist(props) {
  const { songs, curSong, playCallback } = props;
  // console.log('songs');
  // console.log(songs);

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
        songs.map((song) => {
          let bool = false;
          if (song.id === curSong) { bool = true; }
          return (
            <Song
              key={song.id}
              id={song.id}
              name={song.name}
              artists={song.artists}
              albumName={song.album}
              albumLink={song.albumUrl}
              image={song.image.url}
              saved={song.existsInSavedTracks}
              bool={bool}
              uri={song.uri}
              play={playCallback}
            />
          );
        })
      ) : (<div />)}
    </table>
  );
}

export default Playlist;
