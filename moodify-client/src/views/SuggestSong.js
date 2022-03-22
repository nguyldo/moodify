import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Col, Row, Container, Card, Form, Table,
} from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import Button from '../components/Button';
import logo from '../images/logo-circle.png';

function SuggestSong() {
<<<<<<< HEAD
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

  const results = [];

  const handleSong = (e) => {
    setSong(e.target.value);
  };

  function showResults(data) {
    const { items } = data.data.tracks;
    items.forEach((element) => {
      results.push({
        songID: element.id,
        songName: element.name,
        songArtist: element.artists[0].name,
        songAlbum: element.album.name,
        popularity: element.popularity,
        songURI: element.uri,
      });
    });
    console.log(results);
  }

  const getResults = async () => {
    console.log(songTitle);
    await axios.get(`http://localhost:5000/song/search?term=${songTitle}&type=track&token=${accessToken}`)
      .then((data) => {
        showResults(data);
        setSongList(results);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => getResults(), []);

  const sendSong = (id, title, artist, album, popularity, uri) => {
    const song = {
      songID: id,
      songName: title,
      songArtist: artist,
      songAlbum: album,
      popularity,
      songURI: uri,
    };
    console.log(song);

    axios.post(`http://localhost:5000/song/post/?mood=${mood}&af1=${submood1}&af2=${submood2}&af3=${submood3}&af4=${submood4}&af5=${submood5}&adminRec=false`, song)
      .then((response) => {
        console.log(response);
        console.log('sent song');
        console.log(`user${userID}`);
        console.log(`song${song.songID}`);
        axios.put(`http://localhost:5000/user/recommended?userID=${userID}&songID=${song.songID}`)
=======
    const accessToken = Cookies.get('SpotifyAccessToken');

    const location = useLocation();

    const query = new URLSearchParams(location.search);
    const mood = query.get("mood");
    const submood1 = query.get("submood1");
    const submood2 = query.get("submood2");
    const submood3 = query.get("submood3");
    const submood4 = query.get("submood4");
    const submood5 = query.get("submood5");

    const [songTitle, setSong] = useState("");
    let [songList, setResults] = useState([]);
    let [userID, setUserID] = useState("");

    let results = [];

    const handleSong = e => {
        setSong(e.target.value)
    }

    const getResults = async () => {
        console.log(songTitle);
        await axios.get(`http://localhost:5000/song/search?term=${songTitle}&type=track&token=${accessToken}`)
            .then((data) => {
                console.log(data);
                // console.log(data.data.tracks.items[0].name);
                // console.log(data.data.tracks.items[0].album.name);
                // console.log(data.data.tracks.items[0].artists[0].name);

                console.log("before show results");
                showResults(data);
                console.log("after show results");
                
                songList = results;
                setResults(songList);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => getResults(), []);

    function showResults(data) {
        let items = data.data
        items.forEach((element) => {
            results.push({
                "songID": element.songId,
                "songName": element.songName,
                "songArtist": element.songArtist,
                "artistUrl": element.artistUrl,
                "songAlbum": element.songAlbum,
                "albumUrl": element.albumUrl,
                "popularity": element.popularity,
                "explicit": element.explicit
            });
        });
        console.log(results);
    }

    const sendSong = (id, title, artist, artistUrl, album, albumUrl, popularity, explicit) => {
        const song = {
            "songId": id,
            "songName": title,
            "songArtist": artist,
            "artistUrl": artistUrl,
            "songAlbum": album,
            "albumUrl": albumUrl,
            "popularity": popularity,
            "explicit": explicit
        }
        console.log(song);

        axios.post(`http://localhost:5000/song/post/?mood=${mood}&af1=${submood1}&af2=${submood2}&af3=${submood3}&af4=${submood4}&af5=${submood5}&adminRec=false`, song)
          .then((response) => {
            console.log(response);
            console.log("sent song");
            console.log("user" + userID);
            console.log("song" + song.songID);
            axios.put(`http://localhost:5000/user/recommended?userID=${userID}&songID=${song.songID}`)
            .then((data) => {
                console.log(data);
                alert("Song successfully added")
            }).catch((err) => {
                console.log(err);
                alert("Song already exists")
            });
          })
          .catch((err) => {
            console.log(err);
          });
    }

    // useEffect(() => sendSong(), []);

    React.useEffect(() => {
        axios.get(`http://localhost:5000/user/${accessToken}`)
>>>>>>> c8ea9b52bb49c1dbae5211514e4a0274ac30fbcd
          .then((data) => {
            console.log(data);
            alert('Song successfully added');
          }).catch((err) => {
            console.log(err);
            alert('Song already exists');
          });
<<<<<<< HEAD
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
  }, []);

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
      <br />
      <h4 style={{ textAlign: 'left' }}>Song List</h4>
      <Card>
        <Card.Body style={{ color: 'black' }}>
          <Table>
            <thead>
              <tr>
                <th>Song Title</th>
                <th>Artist</th>
                <th>Album</th>
                {/*
                <th />
                */}
              </tr>
            </thead>
            {songList.map((list) => (
              <tbody>
                <tr key={list.songID}>
                  <td>{list.songName}</td>
                  <td>{list.songArtist}</td>
                  <td>{list.songAlbum}</td>
                  <td>
                    <Button
                      color="green"
                      type="wide"
                      text="Add"
                      onClick={() => {
                        sendSong(
                          list.songID,
                          list.songName,
                          list.songArtist,
                          list.songAlbum,
                          list.popularity,
                          list.songURI,
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
=======
      }, []);

    return (
        <div className="basic-frame">
            <Container>
                <Row>
                <Col md={{ span: 10, offset: 1 }}>
                    <h1>Suggest Songs</h1>
                    <h2 style={{color: "#1DAF51"}}> {mood} </h2>
                    <h4 style={{color: "#8fffb7"}}> {submood1} {submood2} {submood3} {submood4} {submood5} </h4>
                </Col>
                <Col>
                    <Link className="home-button" to={{pathname: '/dashboard'}}>
                        <img style={{width: "90%"}} alt="" src={logo}></img>
                    </Link>
                </Col>
                </Row>
            </Container>

            <br></br>
            <h4 style={{textAlign: "left"}}>Song Title</h4>
            <Form className="align-items-center">
                <Row>
                    <Col lg={10}>
                        <Form.Group style={{textAlign: "left"}} className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Control size="lg" type="text" placeholder="ex: Baby Shark" value={songTitle} onChange={handleSong} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Button color="green" type="wide" text="Submit" onClick={() => getResults()}></Button>
                    </Col>
                </Row>
            </Form>
            <br></br>
            <h4 style={{textAlign: "left"}}>Song List</h4>
            <Card>
                <Card.Body style={{color: "black"}}>
                    <Table>
                        <thead>
                            <tr>
                                <th>Song Title</th>
                                <th>Artist</th>
                                <th>Album</th>
                                <th></th>
                            </tr>
                        </thead>
                        {songList.map((list) => (
                            <tbody>
                                <tr key={list.songID}>
                                    <td>{list.songName}</td>
                                    <td>{list.songArtist}</td>
                                    <td>{list.songAlbum}</td>
                                    <td><Button color="green" type="wide" text="Add" 
                                        onClick={() => sendSong(list.songID, list.songName, list.songArtist, list.artistUrl, list.songAlbum, list.albumUrl, list.popularity, list.explicit)}>
                                    </Button></td>
                                </tr>
                            </tbody>
                        ))}
                    </Table>
                </Card.Body>
            </Card>
        </div>
    )
>>>>>>> c8ea9b52bb49c1dbae5211514e4a0274ac30fbcd
}

export default SuggestSong;
