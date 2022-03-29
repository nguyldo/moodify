import React, { useState } from 'react';
import axios from 'axios';
import {
  Col, Row, Container, Card, Toast,
} from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import CustomButton from 'react-bootstrap/Button';
import Cookies from 'js-cookie';
import Button from '../components/Button';
import logo from '../images/logo-circle.png';
import Playlist from '../components/Playlist';

function Result() {
  const accessToken = Cookies.get('SpotifyAccessToken');

  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const mood = query.get('mood');
  const submood1 = query.get('submood1');
  const submood2 = query.get('submood2');
  const submood3 = query.get('submood3');
  const submood4 = query.get('submood4');
  const submood5 = query.get('submood5');

  const customStyle = {
    'font-size': '2rem',
    color: 'white',
  };

  const buttonStyle = {
    outline: 'none',
    'background-color': 'transparent',
    'border-color': 'transparent',
    'box-shadow': 'none',
    color: 'black',
  };

  const toastStyle = {
    position: 'absolute',
    top: '10%',
    left: '50%',
    /* bring your own prefixes */
    transform: 'translate(-50%, -50%)',
  };

  const toastBodyStyle = {
    'text-align': 'center',
    color: 'black',
  };

  const [filterActive, setFilterActive] = useState(false);
  const [filterPopText, setFilterPopText] = useState('Popularity');
  const [filterPopActive, setFilterPopActive] = useState(false);
  const [filterGenreText, setFilterGenreText] = useState('Genre');
  const [filterGenreActive, setFilterGenreActive] = useState(false);
  const [genreFilterIndex, setGenreFilterIndex] = useState(0);
  const [songs, setSongs] = useState([]);
  const [heartButton, setHeartButton] = useState(<i className="bi bi-heart" style={customStyle} />);
  const [heartFill, setHeartFill] = useState(false);
  const [toastActive, setToastActive] = useState(false);
  const [toastContent, setToastContent] = useState(undefined);
  const [filter, setFilter] = useState();
  const [genre, setGenre] = useState(['Genre']);
  const [name, setName] = useState();
  const [imgLink, setImgLink] = useState();

  function isFilterActive() {
    setFilterActive(!filterActive);
  }

  function isFilterGenreActive() {
    let newIndex = genreFilterIndex + 1;
    console.log(newIndex, genre.length);
    console.log(genre[newIndex]);
    if (newIndex % genre.length === 0) {
      newIndex = 0;
      setGenreFilterIndex(newIndex);
      setFilterGenreActive(false);
      setFilter(songs);
    } else {
      const songsToFilter = [...songs];
      console.log(songsToFilter);
      setGenreFilterIndex(newIndex);
      setFilterGenreActive(true);
      const theGenre = genre[newIndex];
      const filtered = songsToFilter.filter((track) => track.artists?.some(
        (artist) => artist.genres?.includes(theGenre),
      ));
      console.log(filtered);
      setFilter(filtered);
    }
    setFilterGenreText(genre[newIndex]);
  }

  const upArrow = '\u{02191}';
  const downArrow = '\u{02193}';

  function isFilterPopActive() {
    if (filterPopText === 'Popularity') {
      setFilterPopActive(true);
      setFilterPopText(`Popularity ${upArrow}`);
    } else if (filterPopText === `Popularity ${upArrow}`) {
      setFilterPopActive(true);
      setFilterPopText(`Popularity ${downArrow}`);
    } else if (filterPopText === `Popularity ${downArrow}`) {
      setFilterPopActive(false);
      setFilterPopText('Popularity');
    }
  }

  async function followPlaylist() {
    try {
      let link;
      if (!heartFill) {
        setToastActive(false);
        setToastContent(undefined);

        const csvSong = songs.map((song) => song.id).join();
        link = await axios.post(`http://localhost:5000/playlist/create?token=${accessToken}&name=${name}&ids=${csvSong}`, { imgLink });

        console.log(link);

        if (link) {
          setHeartFill(true);
          setHeartButton(<i className="bi bi-heart-fill" style={customStyle} />);
        }
      } else {
        setHeartFill(false);
        setHeartButton(<i className="bi bi-heart" style={customStyle} />);
      }
    } catch (err) {
      // Failed to save playlist
    }
  }

  async function sharePlaylist() {
    try {
      let link;
      if (!heartFill) {
        setToastActive(false);
        setToastContent(undefined);

        const csvSong = songs.map((song) => song.id).join();
        link = await axios.post(`http://localhost:5000/playlist/create?token=${accessToken}&name=${name}&ids=${csvSong}&`).then((data) => {
          if (data.data !== 'Failed') return data.data;
          return undefined;
        });

        console.log(link);

        if (link) {
          setHeartFill(true);
          setHeartButton(<i className="bi bi-heart-fill" style={customStyle} />);
          navigator.clipboard.writeText(link);
          // Put up success toast w/ "Link Copied To Clipboard!"
        } else {
          // Put up failure toast
        }
      }
    } catch (err) {
      // Put up failure toast
    }
  }

  const shareToast = (
    <Toast style={toastStyle}>
      <Toast.Body style={toastBodyStyle}>
        Warning! By sharing this playlist, the playlist will automatically be
        added to your account!
        <CustomButton
          style={buttonStyle}
          onClick={() => sharePlaylist()}
        >
          Confirm
        </CustomButton>
        <CustomButton
          style={buttonStyle}
          onClick={() => {
            setToastActive(false);
            setToastContent(undefined);
          }}
        >
          Deny
        </CustomButton>
      </Toast.Body>
    </Toast>
  );

  const saveToast = (
    <Toast style={toastStyle}>
      <Toast.Body style={toastBodyStyle}>
        Warning! By liking this playlist, the playlist will automatically be
        added to your account!
        <CustomButton
          style={buttonStyle}
          onClick={() => followPlaylist()}
        >
          Confirm
        </CustomButton>
        <CustomButton
          style={buttonStyle}
          onClick={() => {
            setToastActive(false);
            setToastContent(undefined);
          }}
        >
          Deny
        </CustomButton>
      </Toast.Body>
    </Toast>
  );

  function showWarning(type) {
    setToastContent(type);
    if (!toastActive) {
      setToastActive(true);
    }
  }

  React.useEffect(async () => {
    try {
      await axios.get(`http://localhost:5000/user/${accessToken}`);

      const associatedFeels = [];
      if (submood1 && submood1 !== '') {
        associatedFeels.push(submood1);
      }
      if (submood2 && submood2 !== '') {
        associatedFeels.push(submood2);
      }
      if (submood3 && submood3 !== '') {
        associatedFeels.push(submood3);
      }
      if (submood4 && submood4 !== '') {
        associatedFeels.push(submood4);
      }
      if (submood5 && submood5 !== '') {
        associatedFeels.push(submood5);
      }

      const data = await axios.post('http://localhost:5000/playlist/recommendations', {
        mood,
        associatedFeels,
        token: accessToken,
      });

      setSongs(data.data);
      setFilter(data.data);
      console.log(data.data);
      const genres = genre;
      data.data.forEach((track) => {
        if (track.artists) {
          track.artists.forEach((artist) => {
            if (artist.genres) {
              artist.genres.forEach((dat) => {
                if (dat) {
                  if (!genres.includes(dat)) { genres.push(dat); }
                }
              });
            }
          });
        }
      });
      console.log(genres);
      setGenre(genres);

      let newName = await axios.post(`http://localhost:5000/playlist/generatetitle?coremood=${mood}`);
      console.log(newName);
      newName = newName.data.split(' ').slice(1).join(' ');
      setName(newName);

      const newImgLink = await axios.post(`http://localhost:5000/playlist/generateimg?text=${newName}`);
      console.log(newImgLink.data);
      setImgLink(newImgLink.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  let suggestButton;
  if (submood1 == null) {
    suggestButton = (
      <Link to={{ pathname: `/suggest-song?mood=${mood}` }}>
        <Button color="green" type="wide" text="Suggest songs" />
      </Link>
    );
  } else if (submood2 == null) {
    suggestButton = (
      <Link to={{ pathname: `/suggest-song?mood=${mood}&submood1=${submood1}` }}>
        <Button color="green" type="wide" text="Suggest songs" />
      </Link>
    );
  } else if (submood3 == null) {
    suggestButton = (
      <Link to={{ pathname: `/suggest-song?mood=${mood}&submood1=${submood1}&submood2=${submood2}` }}>
        <Button color="green" type="wide" text="Suggest songs" />
      </Link>
    );
  } else if (submood4 == null) {
    suggestButton = (
      <Link to={{ pathname: `/suggest-song?mood=${mood}&submood1=${submood1}&submood2=${submood2}&submood3=${submood3}` }}>
        <Button color="green" type="wide" text="Suggest songs" />
      </Link>
    );
  } else if (submood5 == null) {
    suggestButton = (
      <Link to={{ pathname: `/suggest-song?mood=${mood}&submood1=${submood1}&submood2=${submood2}&submood3=${submood3}&submood4=${submood4}` }}>
        <Button color="green" type="wide" text="Suggest songs" />
      </Link>
    );
  } else {
    suggestButton = (
      <Link to={{ pathname: `/suggest-song?mood=${mood}&submood1=${submood1}&submood2=${submood2}&submood3=${submood3}&submood4=${submood4}&submood5=${submood5}` }}>
        <Button color="green" type="wide" text="Suggest songs" />
      </Link>
    );
  }

  return (
    <div className="basic-frame">
      <Container>
        <Row>
          <Col md={{ span: 10, offset: 1 }}>
            <h1>
              <img
                style={{
                  position: 'absolute',
                  width: 100,
                  height: 100,
                  top: '15%',
                  left: '8.7%',
                  /* bring your own prefixes */
                  transform: 'translate(-50%, -50%)',
                }}
                src={imgLink}
                alt=""
              />
            </h1>
          </Col>
          <Col md={{ span: 10, offset: 1 }}>
            <h1>
              {name}
            </h1>
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
      <div style={{ textAlign: 'left' }}>
        <CustomButton style={buttonStyle} onClick={() => showWarning(saveToast)}>
          {heartButton}
        </CustomButton>
        <Button color="#2C2C2C" type="pill" filterActive={filterActive} text="Explicit" onClick={() => isFilterActive()} />
        <Button color="#2C2C2C" type="pill" filterActive={filterPopActive} text={filterPopText} onClick={() => isFilterPopActive(filterPopText)} />
        <Button color="#2C2C2C" type="pill" filterActive={filterGenreActive} text={filterGenreText} onClick={() => isFilterGenreActive(filterPopText)} />
        {suggestButton}
        <CustomButton style={buttonStyle} onClick={() => showWarning(shareToast)}>
          <i className="bi bi-box-arrow-up" style={customStyle} />
        </CustomButton>
        {toastContent}
      </div>

      <Card className="rec-playlist">
        <Card.Body><Playlist songs={filter} /></Card.Body>
      </Card>
    </div>
  );
}

export default Result;
