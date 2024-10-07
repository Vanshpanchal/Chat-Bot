import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Card, ListGroup } from 'react-bootstrap';
import Loading from './Loading';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faUser } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactMarkdown from 'react-markdown';

import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState('light'); // State to manage theme
  const [selectedRole, setSelectedRole] = useState('assistant'); // State to store the selected role
  const chatRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send question and selected role to backend
      const res = await axios.post('http://127.0.0.1:5000/api/generate', {
        question,
        role: selectedRole
      });
      setResponses([...responses, { question, response: res.data.response }]);
      setQuestion('');
    } catch (error) {
      console.error("Error fetching response:", error);
      setResponses([...responses, { question, response: "Error: Unable to fetch response" }]);
    } finally {
      setLoading(false);
    }
  };

  // Scroll to bottom when responses change
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [responses, loading]);

  // Function to change theme
  const changeTheme = (theme) => {
    setTheme(theme);
  };

  // Define themes
  const themes = {
    light: {
      backgroundColor: '#f7f7f7',
      cardHeader: 'bg-primary',
      buttonColor: 'primary',
    },
    dark: {
      backgroundColor: '#333333',
      cardHeader: 'bg-dark',
      buttonColor: 'dark',
    },
    green: {
      backgroundColor: '#e0f7e7',
      cardHeader: 'bg-success',
      buttonColor: 'success',
    },
  };

  const currentTheme = themes[theme];

  return (
    <Container
      fluid
      className="chat-container p-3 d-flex justify-content-center align-items-center"
      style={{ backgroundColor: currentTheme.backgroundColor, minHeight: '100vh' }}
    >
      <Row className="w-100" style={{ maxWidth: '600px' }}>
        <Col className="d-flex flex-column h-100">
          <Card
            className="chat-card shadow-sm border-0 d-flex flex-column"
            style={{ borderRadius: '15px', height: '500px', position: 'relative' }}
          >
            <Card.Body className="d-flex flex-column p-0">
              <Card.Header
                className={`${currentTheme.cardHeader} text-white text-center`}
                style={{ borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}
              >
                <Card.Title className="m-0 d-flex align-items-center justify-content-center">
                  <FontAwesomeIcon icon={faRobot} className="me-2" /> {/* Bot icon */}
                  Generative AI Chat
                </Card.Title>
              </Card.Header>

              {/* Role Selection */}
              <div className="role-selection d-flex justify-content-center mt-2 mb-2">
                <Button
                  variant={selectedRole === 'assistant' ? 'primary' : 'outline-primary'}
                  onClick={() => setSelectedRole('assistant')}
                  className="me-2"
                >
                  Assistant
                </Button>
                <Button
                  variant={selectedRole === 'expert' ? 'primary' : 'outline-primary'}
                  onClick={() => setSelectedRole('expert')}
                  className="me-2"
                >
                  Expert
                </Button>
                <Button
                  variant={selectedRole === 'friend' ? 'primary' : 'outline-primary'}
                  onClick={() => setSelectedRole('friend')}
                >
                  Friend
                </Button>
              </div>

              {/* Chat Messages - Scrollable area */}
              <ListGroup
                ref={chatRef}
                className="chat-messages flex-grow-1 overflow-auto p-3"
                style={{
                  maxHeight: '350px',
                  backgroundColor: '#ffffff',
                  borderBottom: '1px solid #e0e0e0',
                  overflowY: 'auto',
                  flexGrow: 1,
                }}
              >
                {responses.map((item, index) => (
                  <ListGroup.Item
                    key={index}
                    className="message-item border-0 mb-2 p-2"
                    style={{ backgroundColor: '#f1f1f1', borderRadius: '8px' }}
                  >
                    {/* User message */}
                    <div className="d-flex align-items-center mb-1">
                      <FontAwesomeIcon icon={faUser} className="me-2" /> {/* User icon */}
                      <strong>You:</strong>
                    </div>
                    <div>{item.question}</div>

                    {/* AI response */}
                    <div className="d-flex align-items-center mt-3">
                      <FontAwesomeIcon icon={faRobot} className="me-2" /> {/* AI bot icon */}
                      <strong>AI:</strong>
                    </div>
                    <ReactMarkdown>{item.response}</ReactMarkdown>
                  </ListGroup.Item>
                ))}
                {loading && (
                  <ListGroup.Item className="border-0 p-2">
                    <Loading />
                  </ListGroup.Item>
                )}
              </ListGroup>

              {/* Fixed Input at the Bottom */}
              <div className="chat-input" style={{ position: 'absolute', bottom: 0, width: '100%' }}>
                <Form onSubmit={handleSubmit} className="p-3" style={{ backgroundColor: '#f7f7f7' }}>
                  <Form.Group controlId="formBasicQuestion">
                    <Form.Control
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Type your message..."
                      className="p-2"
                      style={{ borderRadius: '10px', border: '1px solid #ccc' }}
                      required
                      disabled={loading}
                    />
                  </Form.Group>
                  <Button
                    variant={currentTheme.buttonColor}
                    type="submit"
                    className="mt-2 w-100 p-2"
                    style={{ borderRadius: '10px' }}
                    disabled={loading}
                  >
                    {loading ? 'Analyzing...' : 'Send'}
                  </Button>
                </Form>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
