import React from 'react';
import axios from 'axios';
import { Col, Row, Container, Card } from 'react-bootstrap';
import Button from '../components/Button';
import { Link, useSearchParams } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import logo from '../images/logo-circle.png';

function Result() {
    const accessToken = Cookies.get('SpotifyAccessToken');

    const location = useLocation();

    const query = new URLSearchParams(location.search);
    const mood = query.get("mood");
    console.log(mood);
    const submood1 = query.get("submood1");
    console.log(submood1);
    const submood2 = query.get("submood2");
    console.log(submood2);
    const submood3 = query.get("submood3");
    console.log(submood3);
    const submood4 = query.get("submood4");
    console.log(submood4);
    const submood5 = query.get("submood5");
    console.log(submood5);

    React.useEffect(() => {
        axios.get(`http://localhost:5000/user/${accessToken}`)
          .then((data) => {
            console.log(data);
          })
          .catch((err) => {
            console.log(err);
          });
      }, []);

      let suggestButton;
      if (submood1 == null) {
        suggestButton = 
          <Link to={{pathname: `/suggest-song?mood=${mood}`}}>
            <Button color="green" type="wide" text="Suggest songs"></Button>
          </Link>;
      } else if (submood2 == null) {
        suggestButton = 
          <Link to={{pathname: `/suggest-song?mood=${mood}&submood1=${submood1}`}}>
            <Button color="green" type="wide" text="Suggest songs"></Button>
          </Link>;
      } else if (submood3 == null) {
        suggestButton = 
          <Link to={{pathname: `/suggest-song?mood=${mood}&submood1=${submood1}&submood2=${submood2}`}}>
            <Button color="green" type="wide" text="Suggest songs"></Button>
          </Link>;
      } else if (submood4 == null) {
        suggestButton = 
          <Link to={{pathname: `/suggest-song?mood=${mood}&submood1=${submood1}&submood2=${submood2}&submood3=${submood3}`}}>
            <Button color="green" type="wide" text="Suggest songs"></Button>
          </Link>;
      } else if (submood5 == null) {
        suggestButton = 
          <Link to={{pathname: `/suggest-song?mood=${mood}&submood1=${submood1}&submood2=${submood2}&submood3=${submood3}&submood4=${submood4}`}}>
            <Button color="green" type="wide" text="Suggest songs"></Button>
          </Link>;
      } else {
        suggestButton = 
          <Link to={{pathname: `/suggest-song?mood=${mood}&submood1=${submood1}&submood2=${submood2}&submood3=${submood3}&submood4=${submood4}&submood5=${submood5}`}}>
            <Button color="green" type="wide" text="Suggest songs"></Button>
          </Link>;
      }

    return (
        <div className="basic-frame">
          <Container>
            <Row>
              <Col md={{ span: 10, offset: 1 }}>
                <h1>Playlist</h1>
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
          <div style={{textAlign: "left"}}>
            {suggestButton}
          </div>
          <br></br>
          <Card>
            <Card.Body style={{color: "black"}}>Songs go here</Card.Body>
          </Card>
        </div>
    )
}

export default Result;