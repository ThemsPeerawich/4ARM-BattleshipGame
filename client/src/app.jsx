import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './landing.jsx'
import Register from './components/register.jsx'
import Login from './components/login.jsx'
import Victory from './components/victory.jsx'
import Defeat from './components/defeat.jsx'
import Game from './components/game.jsx'
import WelcomeScreen from './components/WelcomeScreen.jsx';
import Test from './components/test.jsx';

//this app is define path

function App(){
  return(
    <BrowserRouter>
    <Routes>
      <Route index element={<Home />}></Route>
      <Route path='/register' element={<Register />}></Route>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/victory' element={<Victory />}></Route>
      <Route path='/defeat' element={<Defeat />}></Route>
      <Route path='/welcomescreen' element={<WelcomeScreen />}></Route>
      <Route path='/game' element={<Game />}></Route>
      <Route path='/test' element={<Test />}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App;