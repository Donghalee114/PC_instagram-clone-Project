import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import { UserProvider, useUser } from './contexts/UserContext';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import PublicProfile from './pages/PublicProfile'
import "./App.css"
import ErrorPage from './pages/error';


function AppRoutes() {
  const { isLoggedIn, user  } = useUser();

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={(isLoggedIn && user) ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" /> : <Login />}
        />
        
        <Route path="/signup" element={<SignUp />} />
        <Route path='/errorPage' element={<ErrorPage/>} />
        <Route path="/:username" element={isLoggedIn && user ? <PublicProfile />: <Navigate to="/login" />} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <UserProvider>
        <AppRoutes />
    </UserProvider>
  );
}

export default App;