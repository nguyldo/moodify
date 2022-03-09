import React, { useState } from 'react';
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

    let [filterActive, setFilterActive] = useState(false)
    let [filterPopText, setFilterPopText] = useState("Popularity")
    let [filterPopActive, setFilterPopActive] = useState(false)

    function isFilterActive() {
      filterActive = !filterActive
      setFilterActive(filterActive)
    }
    console.log("filterActive: " + filterActive)

    const upArrow = "\u{02191}"
    const downArrow = "\u{02193}"
    async function isFilterPopActive(filterPopText) {
      if (filterPopText === "Popularity") {
        filterPopActive = true
        filterPopText = "Popularity " + upArrow

      } else if (filterPopText === "Popularity " + upArrow) {
        filterPopActive = true
        filterPopText = "Popularity " + downArrow

      } else if (filterPopText === "Popularity " + downArrow) {
        filterPopActive = false
        filterPopText = "Popularity"

      }

      setFilterPopText(filterPopText)
      setFilterPopActive(filterPopActive)
    }

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
            <Button color="#2C2C2C" type="pill" filterActive={filterActive} text="Explicit" onClick={() => isFilterActive()}></Button>
            <Button color="#2C2C2C" type="pill" filterActive={filterPopActive} text={filterPopText} onClick={() => isFilterPopActive(filterPopText)}></Button>
            {suggestButton}
          </div>

          <Card className="rec-playlist">
            <Card.Body>Songs go here</Card.Body>
          </Card>
        </div>
    )
}

export default Result;