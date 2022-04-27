import React, { useState } from 'react';
import axios from 'axios';
import {
  Col, Row, Container, Card, Form, Table, Toast,
} from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import Button from '../components/Button';
import logo from '../images/logo-circle.png';
import '../styles/playlist.css';

function SuggestSong() {
  const accessToken = Cookies.get('SpotifyAccessToken');

  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const mood = query.get('mood');
  const submood1 = query.get('submood1');
  const submood2 = query.get('submood2');
  const submood3 = query.get('submood3');
  const submood4 = query.get('submood4');
  const submood5 = query.get('submood5');

  const [songTitle, setSong] = useState('');
  const [songList, setSongList] = useState([]);
  const [userID, setUserID] = useState('');
  const [showAddSongAlert, setAddSongAlert] = useState(false);
  const [showAddSongFailAlert, setAddSongFailAlert] = useState(false);

  const results = [];

  const handleSong = (e) => {
    setSong(e.target.value);
  };

  function showResults(data) {
    const items = data.data;
    items.forEach((element) => {
      results.push({
        songId: element.songId,
        songName: element.songName,
        songArtist: element.songArtist,
        artistUrl: element.artistUrl,
        songAlbum: element.songAlbum,
        albumUrl: element.albumUrl,
        imageUrl: element.imageUrl,
        popularity: element.popularity,
        explicit: element.explicit,
      });
    });
    console.log(results);
  }

  const getResults = async () => {
    console.log(songTitle);
    await axios.get(`http://localhost:5000/song/search?term=${songTitle}&type=track&token=${accessToken}`)
      .then((data) => {
        console.log(data);

        console.log('before show results');
        showResults(data);
        console.log('after show results');

        setSongList(results);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addSongAlert = (
    <Toast
      className="alert"
      style={{
        position: 'fixed', top: '10%', left: '50%', transform: 'translate(-50%, -50%)',
      }}
      onClose={() => setAddSongAlert(false)}
      show={showAddSongAlert}
      delay={3000}
      autohide
    >
      <Toast.Body className="alert-text" style={{ color: 'black' }}>Successfully added song!</Toast.Body>
      <Button color="green" type="wide" text="OK" onClick={() => setAddSongAlert(false)} />
    </Toast>
  );

  const addSongFailAlert = (
    <Toast
      className="alert"
      style={{
        position: 'fixed', top: '10%', left: '50%', transform: 'translate(-50%, -50%)',
      }}
      onClose={() => setAddSongFailAlert(false)}
      show={showAddSongFailAlert}
      delay={3000}
      autohide
    >
      <Toast.Body className="alert-text" style={{ color: 'black' }}>Song already exists</Toast.Body>
      <Button color="green" type="wide" text="OK" onClick={() => setAddSongFailAlert(false)} />
    </Toast>
  );

  const sendSong = (id, title, artist, artistUrl, album, albumUrl, popularity, explicit) => {
    const song = {
      songId: id,
      songName: title,
      songArtist: artist,
      artistUrl,
      songAlbum: album,
      albumUrl,
      popularity,
      explicit,
    };
    console.log(song);

    axios.post(`http://localhost:5000/song/post/?mood=${mood}&af1=${submood1}&af2=${submood2}&af3=${submood3}&af4=${submood4}&af5=${submood5}&adminRec=false`, song)
      .then(() => {
        axios.put(`http://localhost:5000/user/recommended?userId=${userID}&songId=${song.songId}`)
          .then((data) => {
            console.log(data);
            setAddSongAlert(true);
          }).catch((err) => {
            console.log(err);
            setAddSongFailAlert(true);
          });
        axios.post(`http://localhost:5000/user/update/mood?type=${mood}&token=${accessToken}`)
          .then(() => {
            console.log('user mood added or updated');
          }).catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    axios.get(`http://localhost:5000/user/${accessToken}`)
      .then((data) => {
        setUserID(data.data.id);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return (
    <div className="basic-frame">
      <Container>
        <Row>
          <Col md={{ span: 10, offset: 1 }}>
            <h1>Suggest Songs</h1>
            <h2 style={{ color: '#1DAF51' }}>
              {' '}
              {mood}
              {' '}
            </h2>
            <h4 style={{ color: '#8fffb7' }}>
              {' '}
              {submood1}
              {' '}
              {submood2}
              {' '}
              {submood3}
              {' '}
              {submood4}
              {' '}
              {submood5}
              {' '}
            </h4>
          </Col>
          <Col>
            <Link className="home-button" to={{ pathname: '/dashboard' }}>
              <img style={{ width: '90%' }} alt="" src={logo} />
            </Link>
          </Col>
        </Row>
      </Container>

      <br />
      <h4 style={{ textAlign: 'left' }}>Song Title</h4>
      <Form className="align-items-center">
        <Row>
          <Col lg={10}>
            <Form.Group style={{ textAlign: 'left' }} className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Control size="lg" type="text" placeholder="ex: Baby Shark" value={songTitle} onChange={handleSong} />
            </Form.Group>
          </Col>
          <Col>
            <Button color="green" type="wide" text="Submit" onClick={() => getResults()} />
          </Col>
        </Row>
      </Form>
      {addSongAlert}
      {addSongFailAlert}
      <br />
      <h4 style={{ textAlign: 'left' }}>Song List</h4>
      <Card>
        <Card.Body style={{ color: 'black' }}>
          <Table borderless>
            <thead>
              <tr>
                <th> </th>
                <th>Song Title</th>
                <th>Artist</th>
                <th>Album</th>
              </tr>
            </thead>
            {songList.map((list) => (
              <tbody>
                <tr key={list.songId}>
                  <td><img style={{ width: '50px', height: '50px' }} alt="album-img" src={list.imageUrl} /></td>
                  <td>{list.songName}</td>
                  <td>
                    {list.songArtist.map((artist, idx) => <span className="artist-comma"><a className="artist-link" target="_blank" rel="noreferrer" href={list.artistUrl[idx]}>{artist}</a></span>)}
                  </td>
                  <td><a className="artist-link" target="_blank" rel="noreferrer" href={list.albumUrl}>{list.songAlbum}</a></td>
                  <td>
                    <Button
                      color="green"
                      type="wide"
                      text="Add"
                      onClick={() => {
                        sendSong(
                          list.songId,
                          list.songName,
                          list.songArtist,
                          list.artistUrl,
                          list.songAlbum,
                          list.albumUrl,
                          list.popularity,
                          list.explicit,
                        );
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            ))}
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
}

export default SuggestSong;
