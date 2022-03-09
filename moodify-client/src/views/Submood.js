import React, { useState } from 'react';
import axios from 'axios';
import { Col, Row, Container } from 'react-bootstrap';
import Button from '../components/Button';
import { Link, useSearchParams } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import logo from '../images/logo-circle.png';

function Submood() {
    const location = useLocation();
    const accessToken = Cookies.get('SpotifyAccessToken');

    const query = new URLSearchParams(location.search);
    const mood = query.get("mood");

    let [buttonsActive, setButtonsActive] = useState([false, false, false, false, false])

    let [submoods, setSubmoods] = useState([]);
    
    const moodsDict = {
        "excited": ["lustful", "intimate", "lively", "joyful", "wild"],
        "content": ["grateful", "inspired", "nostalgic", "relaxed", "curious"],
        "happy": ["confident", "powerful", "hopeful", "energetic", "playful"],
        "bad": ["tired", "apathetic", "overwhelmed", "distracted", "chaotic"],
        "sad": ["lonely", "depressed", "pained", "ashamed", "remorse"],
        "angry":  ["irritated", "enraged", "frustated", "resentful", "jealous"],
    }

    //top, left middle, right middle, left bottom, right bottom
    //0, 1, 2, 3, 4
    const moodColor = {
        "excited": ["#FFB083", "#F36D21", "#864724", "#993700", "#FF9A61"],
        "content": ["#73FF81", "#1E9237", "#005B09", "#45B112", "#4BFA51"],
        "happy": ["#DBBF09", "#F5C929", "#CFA615", "#706310", "#F5D523"],
        "bad": ["#611F81", "#A01FDB", "#E57DF5", "#A761FF", "#840099"],
        "sad": ["#1F6481", "#003499", "#4EC0E6", "#8CE3FF", "#2175F3"],
        "angry": ["#F3212D", "#FF8C93", "#E84343", "#990012", "#811F25"],
    }

    function isActive(submoodTitle, number) {
        console.log(submoodTitle);
        console.log(number);

        let newButtonsActive = [...buttonsActive]
        newButtonsActive[number] = !newButtonsActive[number]
        setButtonsActive(newButtonsActive)
        console.log(buttonsActive)

        if (buttonsActive[number] === false) {
            submoods.push(submoodTitle)
        }

        if (buttonsActive[number] === true) {
            const index = submoods.indexOf(submoodTitle)
            submoods.splice(index, 1)
        }
        setSubmoods(submoods)
    }
    console.log(submoods)

    React.useEffect(() => {
        axios.get(`http://localhost:5000/user/${accessToken}`)
          .then((data) => {
            console.log(data);
          })
          .catch((err) => {
            console.log(err);
          });
      }, []);

    
      let nextButton;
      if (submoods.length === 0) {
        nextButton = 
            <Link className="skip-butt" to={{pathname: `/result?mood=${mood}`}}>
                <h4 style={{textAlign: "right"}}>Next</h4>
            </Link>;
      } else if (submoods.length === 1) {
        nextButton = 
          <Link className="skip-butt" to={{pathname: `/result?mood=${mood}&submood1=${submoods[0]}`}}>
            <h4 style={{textAlign: "right"}}>Next</h4>
          </Link>;
      } else if (submoods.length === 2) {
        nextButton = 
          <Link className="skip-butt" to={{pathname: `/result?mood=${mood}&submood1=${submoods[0]}&submood2=${submoods[1]}`}}>
            <h4 style={{textAlign: "right"}}>Next</h4>
          </Link>;
      } else if (submoods.length === 3) {
        nextButton = 
          <Link className="skip-butt" to={{pathname: `/result?mood=${mood}&submood1=${submoods[0]}&submood2=${submoods[1]}&submood3=${submoods[2]}`}}>
            <h4 style={{textAlign: "right"}}>Next</h4>
          </Link>;
      } else if (submoods.length === 4) {
        nextButton = 
          <Link className="skip-butt" to={{pathname: `/result?mood=${mood}&submood1=${submoods[0]}&submood2=${submoods[1]}&submood3=${submoods[2]}&submood4=${submoods[3]}`}}>
            <h4 style={{textAlign: "right"}}>Next</h4>
          </Link>;
      } else {
        nextButton = 
          <Link className="skip-butt" to={{pathname: `/result?mood=${mood}&submood1=${submoods[0]}&submood2=${submoods[1]}&submood3=${submoods[2]}&submood4=${submoods[3]}&submood5=${submoods[4]}`}}>
            <h4 style={{textAlign: "right"}}>Next</h4>
          </Link>;
      }

    return (
        <div className={mood}>
            <div className="basic-frame">
                <Container>
                    <Row className="justify-content-md-center">
                        <Col md={{ span: 10, offset: 1 }}>
                            <Button active={buttonsActive[0]} color={moodColor[mood][0]} text={moodsDict[mood][0]} type="round" onClick={() => isActive(moodsDict[mood][0], 0)}></Button>
                        </Col>
                        <Col >
                            <Link className="home-button" to={{pathname: '/dashboard'}}>
                                <img style={{width: "90%"}} alt="" src={logo}></img>
                            </Link>
                        </Col>
                    </Row>
                    <br></br>
                    <Row className="justify-content-md-center align-items-center">
                        <Col md={{ span: 3, offset: 0 }}>
                            <Button active={buttonsActive[1]} color={moodColor[mood][1]} text={moodsDict[mood][1]} type="round" onClick={() => isActive(moodsDict[mood][1], 1)}></Button>
                        </Col>
                        <Col md={{ span: 2, offset: 0 }}>
                            <h1>{mood}</h1>
                            <Link className="skip-butt" to={{pathname: `/result?mood=${mood}`}}>
                                <p>(Skip)</p>
                            </Link>
                        </Col>
                        <Col md={{ span: 3, offset: 0 }}>
                            <Button active={buttonsActive[2]} color={moodColor[mood][2]} text={moodsDict[mood][2]} type="round" onClick={() => isActive(moodsDict[mood][2], 2)}></Button>
                        </Col>
                    </Row>
                    <br></br>
                    <br></br>
                    <Row className="justify-content-md-center">
                        <Col md={{ span: 3, offset: 0 }}>
                            <Button active={buttonsActive[3]} color={moodColor[mood][3]} text={moodsDict[mood][3]} type="round" onClick={() => isActive(moodsDict[mood][3], 3)}></Button>
                        </Col>
                        <Col md={{ span: 3, offset: 0 }}>
                            <Button active={buttonsActive[4]} color={moodColor[mood][4]} text={moodsDict[mood][4]} type="round" onClick={() => isActive(moodsDict[mood][4], 4)}></Button>
                        </Col>
                    </Row>
                </Container>
                <Row>
                    <Col md={{ span: 1, offset: 0 }}>
                        <Link className="back-butt" to={{pathname: '/dashboard'}}>
                            <h4 style={{textAlign: "left"}}>Back</h4>
                        </Link>
                    </Col>
                    <Col></Col>
                    <Col md={{ span: 1, offset: 0 }}>
                        {nextButton}
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Submood;