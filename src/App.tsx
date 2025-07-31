import { useState } from 'react'
import { Navigate , Route , Routes  } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import './App.css'


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <div className="App">
      <Routes>
     <Route
      path="/"
      element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
    />
      <Route path="/login" element={isLoggedIn ? <Navigate to ="/"></Navigate> : <Login setIsLoggedIn={setIsLoggedIn}/>} />
      <Route path="signup" element ={<SignUp setIsLoggedIn={setIsLoggedIn}/>} />

     {/*
     <Route path="/home" element={<Home />} />
      <Route path="/detail" element={<Detail />} />*/} 
      </Routes>
   
    </div>
  );
}

export default App
