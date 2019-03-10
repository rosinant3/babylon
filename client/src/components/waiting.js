import React from 'react';

function Waiting(props) {
  return <section className="waiting">
    
  <h1>Welcome, {props.username}!</h1>
  <h2>Please confirm your E-mail before we move on.</h2>
  <div className="loading-dots">
  <h3 className="dot one">.</h3><h3 className="dot two">.</h3><h3 className="dot three">.</h3>
  </div>
  </section>;

}

export default Waiting;