import React from 'react';
import axios from 'axios';
import { Col, Row, Container } from 'react-bootstrap';
import { Link } from "react-router-dom";
import Button from '../components/Button';
import Cookies from 'js-cookie';
import logo from '../images/logo-circle.png';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    let navigate = useNavigate();
    const { hash } = window.location;
    if (typeof Cookies.get('SpotifyAccessToken') === 'undefined' && hash !== "") {
      const accessToken = hash.split('&')[0].split('=')[1];
      const tokenType = hash.split('&')[1].split('=')[1];
      const expiresIn = hash.split('&')[2].split('=')[1];

      console.log(expiresIn)
      Cookies.set('SpotifyAccessToken', accessToken, { expires: parseInt(expiresIn) / 86400 });
    }

    const accessToken = Cookies.get('SpotifyAccessToken')

    React.useEffect(() => {
        if (window.location.hash === "" && Cookies.get('SpotifyAccessToken') === 'undefined') {
          return navigate("/")
        }
        axios.get(`http://localhost:5000/user/${accessToken}`)
          .then((data) => {
            console.log(data);
            axios.post(`http://localhost:5000/user/post?id=${data.data.id}`)
              .then((data) => {
                console.log(data);
              })
              .catch((err) => {
                console.log(err);
              });
          })
          .catch((err) => {
            console.log(err);
          });
      }, []);

    function postMood(mood) {
      axios.post(`http://localhost:5000/user/update/mood?type=${mood}&token=${accessToken}`)
        .then((data) => {
          console.log(data)
        })
        .catch((err) => {
          console.log(err)
        });
    }

    return (
        <div className="basic-frame">
            {/* <p>Access token: {accessToken}</p>
            <p>Token type: {tokenType}</p>
            <p>Expires in: {expiresIn}</p> */}

            <Row>
              <Col md={{ span: 10, offset: 1 }}>
                <h1>How are you feeling?</h1>
              </Col>
              <Col>
                <Link className="home-button" to={{pathname: '/dashboard'}}>
                    <img style={{width: "90%"}} alt="" src={logo}></img>
                </Link>
              </Col>
            </Row>
            
            <br></br>
            <br></br>
            <Container>
              <Row className="justify-content-md-center">
                <Col md lg="4">
                  <Link to={{pathname: '/submood?mood=excited'}}>
                    <Button color="#ED6A20" text="excited" type="round" onClick={() => postMood("excited")}></Button>
                  </Link>
                </Col>
                <Col md="auto">
                  <Link to={{pathname: '/submood?mood=content'}}>
                    <Button color="#26CF37" text="content" type="round" onClick={() => postMood("content")}></Button>
                  </Link>
                </Col>
                <Col md lg="4">
                  <Link to={{pathname: '/submood?mood=happy'}}>
                    <Button color="#F3D226" text="happy" type="round" onClick={() => postMood("happy")}></Button>
                  </Link>
                </Col>
              </Row>
              <br></br>
              <br></br>
              <br></br>
              <Row className="justify-content-md-center">
                <Col md lg="4">
                  <Link to={{pathname: '/submood?mood=bad'}}>
                    <Button color="#A136F4" text="bad" type="round" onClick={() => postMood("bad")}></Button>
                  </Link>
                </Col>
                <Col md="auto">
                  <Link to={{pathname: '/submood?mood=sad'}}>
                    <Button color="#3D93F9" text="sad" type="round" onClick={() => postMood("sad")}></Button>
                  </Link>
                </Col>
                <Col md lg="4">
                  <Link to={{pathname: '/submood?mood=angry'}}>
                    <Button color="#F22D2D" text="angry" type="round" onClick={() => postMood("angry")}></Button>
                  </Link>
                </Col>
              </Row>
            </Container>
        </div>
    )
}

export default Dashboard;