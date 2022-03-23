import React, { useState } from 'react';
import axios from 'axios';
import {
  Col, Row, Container, Card,
} from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
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

  const [filterActive, setFilterActive] = useState(false);
  const [filterPopText, setFilterPopText] = useState('Popularity');
  const [filterPopActive, setFilterPopActive] = useState(false);
  const [songs, setSongs] = useState([]);

  function isFilterActive() {
    setFilterActive(!filterActive);
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

    setFilterPopText(filterPopText);
    setFilterPopActive(filterPopActive);
  }

  React.useEffect(() => {
    axios.get(`http://localhost:5000/user/${accessToken}`)
      .then(() => {
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

        axios.post('http://localhost:5000/playlist/recommendations', {
          mood,
          associatedFeels,
          token: accessToken,
        })
          .then((data) => {
            setSongs(data.data);
          });
      })
      .catch((err) => {
        console.log(err);
      });
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
            <h1>Playlist</h1>
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
        <Button color="#2C2C2C" type="pill" filterActive={filterActive} text="Explicit" onClick={() => isFilterActive()} />
        <Button color="#2C2C2C" type="pill" filterActive={filterPopActive} text={filterPopText} onClick={() => isFilterPopActive(filterPopText)} />
        {suggestButton}
      </div>

      <Card className="rec-playlist">
        <Card.Body><Playlist songs={songs} /></Card.Body>
      </Card>
    </div>
  );
}

export default Result;
