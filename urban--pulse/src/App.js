import './App.css';
import react from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/homepage/Home';
import UserPage from './pages/userpage/UserPage';

function App() {
  return (
    <Router>
    <div className="App">
      <Routes>
        <Route path='/' element={<Home/>}/>,
        <Route path='userpage' element={<UserPage/>} />
      </Routes>
    </div>
    </Router>
  );
}

export default App;
