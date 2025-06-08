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
                  borderRadius: '12px',
                  padding: '16px 32px',
                  fontSize: '18px',
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: '700',
                  cursor: 'pointer',
                  marginTop: '20px',
                  boxShadow: '0 4px 12px rgba(79, 195, 247, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(79, 195, 247, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(79, 195, 247, 0.3)';
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
