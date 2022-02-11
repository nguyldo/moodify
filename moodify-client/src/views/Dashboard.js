import React from 'react';
import axios from 'axios';
import { Col, Row, Container } from 'react-bootstrap';
import Button from '../components/Button';

function Dashboard() {
    const { hash } = window.location;
    const accessToken = hash.split('&')[0].split('=')[1];
    const tokenType = hash.split('&')[1].split('=')[1];
    const expiresIn = hash.split('&')[2].split('=')[1];

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
        <div className="basic-frame">
            {/* <p>Access token: {accessToken}</p>
            <p>Token type: {tokenType}</p>
            <p>Expires in: {expiresIn}</p> */}

            <h1>How are you feeling?</h1>
            <br></br>
            <br></br>
            <Container>
              <Row className="justify-content-md-center">
                <Col md lg="4">
                  <Button color="#ED6A20" text="Excited"></Button>
                </Col>
                <Col md="auto">
                  <Button color="#26CF37" text="Content"></Button>
                </Col>
                <Col md lg="4">
                  <Button color="#F3D226" text="Happy"></Button>
                </Col>
              </Row>
              <br></br>
              <br></br>
              <br></br>
              <Row className="justify-content-md-center">
                <Col md lg="4">
                  <Button color="#A136F4" text="Bad"></Button>
                </Col>
                <Col md="auto">
                  <Button color="#3D93F9" text="Sad"></Button>
                </Col>
                <Col md lg="4">
                  <Button color="#F22D2D" text="Angry"></Button>
                </Col>
              </Row>
            </Container>
        </div>
    )
}

export default Dashboard;