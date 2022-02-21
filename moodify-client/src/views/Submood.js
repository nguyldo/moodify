import React from 'react';
import axios from 'axios';
import { Col, Row, Container } from 'react-bootstrap';
import Button from '../components/Button';
import { Link, useSearchParams } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';

function Submood() {
    const location = useLocation();
    const accessToken = Cookies.get('SpotifyAccessToken');

    const query = new URLSearchParams(location.search);
    const mood = query.get("mood");
    console.log(query.get("mood"));
    
    const moodsDict = {
        "excited": ["lustful", "intimate", "lively", "joyful", "wild"],
        "content": ["grateful", "inspired", "nostalgic", "relaxed", "curious"],
        "happy": ["confident", "powerful", "hopeful", "energetic", "playful"],
        "bad": ["tired", "apathetic", "overwhelmed", "distracted", "chaotic"],
        "sad": ["lonely", "depressed", "pained", "ashamed", "remorse"],
        "angry":  ["irritated", "enraged", "frustated", "resentful", "jealous"],
    }

    //top, left middle, right middle, left bottom, right bottom
    const moodColor = {
        "excited": ["#FFB083", "#F36D21", "#864724", "#993700", "#FF9A61"],
        "content": ["#73FF81", "#1E9237", "#005B09", "#45B112", "#4BFA51"],
        "happy": ["#DBBF09", "#F5C929", "#CFA615", "#706310", "#F5D523"],
        "bad": ["#611F81", "#A01FDB", "#E57DF5", "#A761FF", "#840099"],
        "sad": ["#1F6481", "#003499", "#4EC0E6", "#8CE3FF", "#2175F3"],
        "angry": ["#F3212D", "#FF8C93", "#E84343", "#990012", "#811F25"],
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

    return (
        <div className="basic-frame" className={mood}>
            <Container>
                <Row className="justify-content-md-center">
                    <Col>
                        <Button color={moodColor[mood][0]} text={moodsDict[mood][0]} type="round"></Button>
                    </Col>
                </Row>
                <br></br>
                <Row className="justify-content-md-center align-items-center">
                    <Col md={{ span: 3, offset: 0 }}>
                        <Button color={moodColor[mood][1]} text={moodsDict[mood][1]} type="round"></Button>
                    </Col>
                    <Col md={{ span: 2, offset: 0 }}>
                        <h1>{mood}</h1>
                    </Col>
                    <Col md={{ span: 3, offset: 0 }}>
                        <Button color={moodColor[mood][2]} text={moodsDict[mood][2]} type="round"></Button>
                    </Col>
                </Row>
                <br></br>
                <br></br>
                <Row className="justify-content-md-center">
                    <Col md={{ span: 3, offset: 0 }}>
                        <Button color={moodColor[mood][3]} text={moodsDict[mood][3]} type="round"></Button>
                    </Col>
                    <Col md={{ span: 3, offset: 0 }}>
                        <Button color={moodColor[mood][4]} text={moodsDict[mood][4]} type="round"></Button>
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
                    <Link className="skip-butt" to={{pathname: ""}}>
                        <h4 style={{textAlign: "right"}}>Skip</h4>
                    </Link>
                </Col>
            </Row>
        </div>
    )
}

export default Submood;