import React from 'react';
import { render } from 'react-dom';

import './style/style.css';

const App = () => {
  return <h1>
    Hello World!
  </h1>
};

render(
  <App/>,
  document.getElementById('app')
);
