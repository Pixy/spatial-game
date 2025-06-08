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
`;

const LevelButton = styled.button<{ color: string }>`
  background: ${(props) => props.color};
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 16px 40px;
  margin: 12px;
  font-size: 1.3rem;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #004d40;
  }
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
