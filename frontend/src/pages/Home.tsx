import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #e0f7fa;
`;

const Title = styled.h1`
  color: #00796b;
  margin-bottom: 32px;
  font-family: 'Fredoka', 'Nunito', cursive;
  font-weight: 700;
  font-size: 2.8rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
`;

const LevelButton = styled.button<{ color: string }>`
  background: ${(props) => props.color};
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 16px 40px;
  margin: 12px;
  font-size: 1.3rem;
  font-family: 'Nunito', sans-serif;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  &:hover {
    background: #004d40;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0,0,0,0.3);
  }
`;

const Description = styled.p`
  font-family: 'Nunito', sans-serif;
  font-size: 1.2rem;
  font-weight: 500;
  color: #004d40;
  margin: 10px 0 30px 0;
  text-align: center;
  max-width: 500px;
  line-height: 1.6;
`;

const levels = [
  { id: "easy", label: "Niveau Facile", color: "#4fc3f7" },
  { id: "medium", label: "Niveau Moyen", color: "#ffd54f" },
  { id: "hard", label: "Niveau Difficile", color: "#a5d6a7" },
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLevelSelect = (level: string) => {
    navigate(`/gameplay?level=${level}`);
  };

  return (  
    <Container>
      <Title>Choisissez un Niveau de Jeu</Title>
      <Description>
        Testez vos compétences avec nos niveaux de jeu soigneusement conçus. Que vous soyez débutant ou expert, il y a un défi pour vous !
      </Description>
      {levels.map((level) => (
        <LevelButton
          key={level.id}
          color={level.color}
          onClick={() => handleLevelSelect(level.id)}
        >
          {level.label}
        </LevelButton>
      ))}
    </Container>    
  );
};

export default Home;
