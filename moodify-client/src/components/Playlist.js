/* eslint-disable array-callback-return */
import React, { useState } from 'react';
import { Toast, Dropdown, Modal } from 'react-bootstrap';
import '../styles/playlist.css';

import Cookies from 'js-cookie';
import Button from './Button';

const axios = require('axios');

const accessToken = Cookies.get('SpotifyAccessToken');
// const spotifyUrl = 'https://api.spotify.com/v1';

const Song = (props) => {
  const { name, artists, id, albumName, albumLink, image, saved } = props;

  const [heart, setHeart] = useState(saved ? '/heart-green.svg' : '/heart-black.svg');
  const [modalShow, setModalShow] = useState(false);
  const [performed, setPerformed] = useState('');
  const [written, setWritten] = useState([]);
  const [produced, setProduced] = useState([]);
  const [showLikeAlert, setShowLikeAlert] = useState(false);
  const [showUnlikeAlert, setShowUnlikeAlert] = useState(false);
  const [showLyricsModal, setShowLyricsModal] = useState(false);

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

  const creditModal = (
    <Modal
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={modalShow}
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
        <Button style={{ textAlign: 'center' }} onClick={() => setModalShow(false)} color="green" type="wide" text="Close" />
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
          Lyrics
        </p>
        <Button style={{ textAlign: 'center' }} onClick={() => setShowLyricsModal(false)} color="green" type="wide" text="Close" />
      </Modal.Body>
    </Modal>
  );

  async function isHeart(songId) {
    if (heart === '/heart-black.svg') {
      setHeart('/heart-green.svg');
      setShowLikeAlert(true);
      await axios.put(`http://localhost:5000/playlist/save?ids=${songId}&token=${accessToken}`);
    } else if (heart === '/heart-green.svg') {
      setHeart('/heart-black.svg');
      setShowUnlikeAlert(true);
      axios.delete(`http://localhost:5000/playlist/remove?ids=${songId}&token=${accessToken}`);
    }
  }

  async function SongCreditsModal(songTitle, artist) {
    const data = await axios.get(`http://localhost:5000/song/get/credits?songTitle=${songTitle}&artist=${artist}`);

    const writtenBy = data.data.writtenBy.join(', ');
    const producedBy = data.data.producedBy.join(', ');

    setPerformed(data.data.performedBy);
    setWritten(writtenBy);
    setProduced(producedBy);

    setModalShow(true);
  }

  async function showSongLyrics() {
    setShowLyricsModal(true);
  }

  async function followArtist(artistId) {
    await axios.put(`http://localhost:5000/user/follow/artist?id=${artistId}&token=${accessToken}`);
  }

  async function followAlbum() {
    const albumSplit = albumLink.split('/');
    const albumId = albumSplit[4];
    await axios.put(`http://localhost:5000/user/follow/album?id=${albumId}&token=${accessToken}`);
  }

  return (
    <tr key={id} className="playlist-song">
      <td className="c0"><button onClick={() => isHeart(id)} type="button" className="button-wrapper"><img src={heart} className="playlist-song-heart" alt="heart" /></button></td>
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
          <Dropdown.Item className="option" onClick={() => SongCreditsModal(name, artists[0].name)}>Song Credits</Dropdown.Item>
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
        </Dropdown.Menu>
      </Dropdown>
      {likeAlert}
      {unlikeAlert}
      {creditModal}
      {lyricsModal}
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
            id={song.id}
            name={song.name}
            artists={song.artists}
            albumName={song.album}
            albumLink={song.albumUrl}
            image={song.image.url}
            saved={song.existsInSavedTracks}
          />
        ))
      ) : (<div />)}
    </table>
  );
}

export default Playlist;
