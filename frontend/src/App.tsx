import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Gameplay from './pages/Gameplay';
import Home from './pages/Home';

function App() {
  const navigate = useNavigate();

  const goToHome = () => {
    navigate('/home');
  };

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          <div>
            <header className="App-header">
              <h1>Jeu de Repérage Spatial</h1>
              <p>Bienvenue dans le jardin magique !</p>
              <button 
                onClick={goToHome}
                style={{
                  backgroundColor: '#4fc3f7',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  marginTop: '20px'
                }}
              >
                Aller à l'accueil
              </button>
            </header>
          </div>
        } />
        <Route path="/home" element={<Home />} />
        <Route path="/gameplay" element={<Gameplay />} />
      </Routes>
    </div>
  );
}

export default App;
