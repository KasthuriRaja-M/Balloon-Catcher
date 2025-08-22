import React, { useState, useEffect, useCallback } from 'react';
import './BalloonCatcher.css';
import Balloon from './Balloon';
import Basket from './Basket';

const BalloonCatcher = () => {
  const [gameState, setGameState] = useState('menu'); // menu, playing, gameOver
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [balloons, setBalloons] = useState([]);
  const [basketPosition, setBasketPosition] = useState(50);
  const [gameSpeed, setGameSpeed] = useState(2000);
  const [highScore, setHighScore] = useState(0);

  // Load high score from localStorage
  useEffect(() => {
    const savedHighScore = localStorage.getItem('balloonCatcherHighScore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }
  }, []);

  // Save high score to localStorage
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('balloonCatcherHighScore', score.toString());
    }
  }, [score, highScore]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setLevel(1);
    setBalloons([]);
    setBasketPosition(50);
    setGameSpeed(2000);
  };

  const endGame = () => {
    setGameState('gameOver');
  };

  const moveBasket = useCallback((e) => {
    if (gameState !== 'playing') return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setBasketPosition(Math.max(0, Math.min(100, percentage)));
  }, [gameState]);

  const createBalloon = useCallback(() => {
    if (gameState !== 'playing') return;

    const newBalloon = {
      id: Date.now() + Math.random(),
      x: Math.random() * 80 + 10, // 10% to 90% of screen width
      y: 100, // Start from bottom
      color: getRandomColor(),
      speed: 1 + Math.random() * 2,
      points: Math.floor(Math.random() * 3) + 1
    };

    setBalloons(prev => [...prev, newBalloon]);
  }, [gameState]);

  const getRandomColor = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const catchBalloon = (balloonId) => {
    const balloon = balloons.find(b => b.id === balloonId);
    if (balloon) {
      setScore(prev => prev + balloon.points);
      setBalloons(prev => prev.filter(b => b.id !== balloonId));
    }
  };

  const missBalloon = (balloonId) => {
    setLives(prev => {
      const newLives = prev - 1;
      if (newLives <= 0) {
        endGame();
      }
      return newLives;
    });
    setBalloons(prev => prev.filter(b => b.id !== balloonId));
  };

  // Update balloon positions
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setBalloons(prev => 
        prev.map(balloon => ({
          ...balloon,
          y: balloon.y - balloon.speed
        })).filter(balloon => {
          if (balloon.y < -10) {
            missBalloon(balloon.id);
            return false;
          }
          return true;
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [gameState]);

  // Create new balloons
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(createBalloon, gameSpeed);
    return () => clearInterval(interval);
  }, [gameState, gameSpeed, createBalloon]);

  // Level progression
  useEffect(() => {
    if (score > 0 && score % 20 === 0) {
      setLevel(prev => prev + 1);
      setGameSpeed(prev => Math.max(500, prev - 200));
    }
  }, [score]);

  // Handle mouse movement for basket
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (gameState === 'playing') {
        const percentage = (e.clientX / window.innerWidth) * 100;
        setBasketPosition(Math.max(0, Math.min(100, percentage)));
      }
    };

    if (gameState === 'playing') {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gameState]);

  const renderMenu = () => (
    <div className="menu">
      <h1>🎈 Balloon Catcher 🎈</h1>
      <p>Catch the balloons before they float away!</p>
      <div className="high-score">High Score: {highScore}</div>
      <button className="start-button" onClick={startGame}>
        Start Game
      </button>
      <div className="instructions">
        <h3>How to Play:</h3>
        <ul>
          <li>Move your mouse to control the basket</li>
          <li>Catch balloons to earn points</li>
          <li>Don't let balloons escape!</li>
          <li>You have 3 lives</li>
        </ul>
      </div>
    </div>
  );

  const renderGame = () => (
    <div className="game-container" onMouseMove={moveBasket}>
      <div className="game-header">
        <div className="score">Score: {score}</div>
        <div className="lives">Lives: {'❤️'.repeat(lives)}</div>
        <div className="level">Level: {level}</div>
      </div>
      
      <div className="game-area">
        {balloons.map(balloon => (
          <Balloon
            key={balloon.id}
            id={balloon.id}
            x={balloon.x}
            y={balloon.y}
            color={balloon.color}
            points={balloon.points}
            onCatch={catchBalloon}
          />
        ))}
        <Basket position={basketPosition} />
      </div>
    </div>
  );

  const renderGameOver = () => (
    <div className="game-over">
      <h2>Game Over!</h2>
      <div className="final-score">Final Score: {score}</div>
      <div className="high-score">High Score: {highScore}</div>
      <button className="start-button" onClick={startGame}>
        Play Again
      </button>
      <button className="menu-button" onClick={() => setGameState('menu')}>
        Main Menu
      </button>
    </div>
  );

  return (
    <div className="balloon-catcher">
      {gameState === 'menu' && renderMenu()}
      {gameState === 'playing' && renderGame()}
      {gameState === 'gameOver' && renderGameOver()}
    </div>
  );
};

export default BalloonCatcher;
