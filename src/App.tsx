import React from 'react';
import logo from './logo.svg'
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';
import AutoLogout from './components/autoLogOut';

function App() {
  return (
    <BrowserRouter>
      <div>
        {/* <AutoLogout timeout={10000} />  */}
        <Routes />
      </div>
    </BrowserRouter>

  );
}

export default App;
