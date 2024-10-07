// Loading.js
import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loading = () => {
  return (
    <div className="text-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Analyzing...</span>
      </Spinner>
      <p>Analyzing...</p>
    </div>
  );
};

export default Loading;
