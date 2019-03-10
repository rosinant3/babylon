import React, { Component } from 'react';
import SingUp2 from './singup';
import Login2 from './login';

class Screen extends Component {


  render() {
    return (
    <section className="screen">
    <header className="header">
    <Login2 />
    </header>
    <div className="presentation">
    <h1>Babylon</h1>
    <h3>We do not forget.</h3>
    </div>
    <div className="enterence">
    <SingUp2 />
    </div>

    </section>
    )
  }
}

export default Screen;