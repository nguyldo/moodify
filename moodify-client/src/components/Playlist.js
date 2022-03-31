/* eslint-disable array-callback-return */
import React, { useState } from 'react';
import { Toast, Dropdown, Modal } from 'react-bootstrap';
import '../styles/playlist.css';

import Cookies from 'js-cookie';
import Button from './Button';

const axios = require('axios');

const accessToken = Cookies.get('SpotifyAccessToken');
const spotifyUrl = 'https://api.spotify.com/v1';

const Song = (props) => {
  const { name, artists, id, albumName, albumLink, image, saved } = props;
  console.log(props);

  const [heart, setHeart] = useState(saved ? '/heart-green.svg' : '/heart-black.svg');
  const [modalShow, setModalShow] = useState(false);
  console.log(modalShow);
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

  async function isHeart(songId) {
    console.log('songId');
    console.log(songId);
    if (heart === '/heart-black.svg') {
      setHeart('/heart-green.svg');
      setShowLikeAlert(true);
      await axios.put(`${spotifyUrl}/me/tracks?ids=${songId}`, {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } else if (heart === '/heart-green.svg') {
      setHeart('/heart-black.svg');
      setShowUnlikeAlert(true);
      axios.delete(`${spotifyUrl}/me/tracks?ids=${songId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }
  }

  async function SongCreditsModal(songTitle, artist) {
    const data = await axios.get(`http://localhost:5000/song/get/credits?songTitle=${songTitle}&artist=${artist}`);

    console.log('performed');
    console.log(data.data.performedBy);
    console.log('written');
    console.log(data.data.writtenBy);
    console.log('produced');
    console.log(data.data.producedBy);

    console.log('going in here');
    // alert(data.data.performedBy);

    return (
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={setModalShow(true)}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Song Credits
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Performed by:</h4>
          <p>
            {data.data.performedBy}
            test
          </p>
          <h4>Written by:</h4>
          <p>
            {data.data.writtenBy.toString()}
            test
          </p>
          <h4>Produced by:</h4>
          <p>
            {data.data.producedBy.toString()}
            test
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={setModalShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
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
          <Dropdown.Item className="option" href="#" onClick={() => SongCreditsModal(name, artists[0].name)}>Song Credits</Dropdown.Item>
          {/* <SongCreditsModal
            songTitle={name}
            artist={artists[0].name}
            show={modalShow}
            onHide={() => setModalShow(false)}
          /> */}
        </Dropdown.Menu>
      </Dropdown>
      {likeAlert}
      {unlikeAlert}
    </tr>
  );
};

function Playlist(props) {
  const { songs } = props;
  console.log('songs');
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
