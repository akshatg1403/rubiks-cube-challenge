'use client'; 
import React, { useState } from 'react';

const COLORS = ['white', 'red', 'blue', 'orange', 'green', 'yellow'];
const FACES = ['U', 'D', 'F', 'B', 'L', 'R'];

const CubePiece = ({ position, colors }) => (
  <div className="cube-piece" style={{
    transform: `translate3d(${position[0]}px, ${position[1]}px, ${position[2]}px)`
  }}>
    {colors.map((color, index) => (
      <div key={index} className={`face face-${index}`} style={{ backgroundColor: color }} />
    ))}
  </div>
);

const RubiksCube = () => {
  const [cubeState, setCubeState] = useState(() => {
    const initialState = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          initialState.push({
            position: [x, y, z],
            colors: [
              y === -1 ? COLORS[0] : COLORS[5],
              x === 1 ? COLORS[1] : COLORS[3],
              z === -1 ? COLORS[2] : COLORS[4],
              x === -1 ? COLORS[3] : COLORS[1],
              z === 1 ? COLORS[4] : COLORS[2],
              y === 1 ? COLORS[5] : COLORS[0],
            ]
          });
        }
      }
    }
    return initialState;
  });

  const [rotation, setRotation] = useState({ x: -30, y: 45, z: 0 });
  const [isRotating, setIsRotating] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);

  const rotateFace = (face, direction) => {
    if (isRotating) return;
    setIsRotating(true);

    let axis, layer;
    switch (face) {
      case 'U': axis = 'y'; layer = -1; break;
      case 'D': axis = 'y'; layer = 1; break;
      case 'F': axis = 'z'; layer = -1; break;
      case 'B': axis = 'z'; layer = 1; break;
      case 'L': axis = 'x'; layer = -1; break;
      case 'R': axis = 'x'; layer = 1; break;
    }

    const axisIndex = ['x', 'y', 'z'].indexOf(axis);
    
    setCubeState(prevState => {
      const newState = prevState.map(piece => {
        if (piece.position[axisIndex] === layer) {
          const newPosition = [...piece.position];
          const newColors = [...piece.colors];
          
          if (axis === 'x') {
            if (direction === 'clockwise') {
              [newPosition[1], newPosition[2]] = [newPosition[2], -newPosition[1]];
              [newColors[0], newColors[2], newColors[5], newColors[4]] = [newColors[4], newColors[0], newColors[2], newColors[5]];
            } else {
              [newPosition[1], newPosition[2]] = [-newPosition[2], newPosition[1]];
              [newColors[0], newColors[2], newColors[5], newColors[4]] = [newColors[2], newColors[5], newColors[4], newColors[0]];
            }
          } else if (axis === 'y') {
            if (direction === 'clockwise') {
              [newPosition[0], newPosition[2]] = [-newPosition[2], newPosition[0]];
              [newColors[1], newColors[2], newColors[3], newColors[4]] = [newColors[4], newColors[1], newColors[2], newColors[3]];
            } else {
              [newPosition[0], newPosition[2]] = [newPosition[2], -newPosition[0]];
              [newColors[1], newColors[2], newColors[3], newColors[4]] = [newColors[2], newColors[3], newColors[4], newColors[1]];
            }
          } else if (axis === 'z') {
            if (direction === 'clockwise') {
              [newPosition[0], newPosition[1]] = [newPosition[1], -newPosition[0]];
              [newColors[0], newColors[1], newColors[5], newColors[3]] = [newColors[3], newColors[0], newColors[1], newColors[5]];
            } else {
              [newPosition[0], newPosition[1]] = [-newPosition[1], newPosition[0]];
              [newColors[0], newColors[1], newColors[5], newColors[3]] = [newColors[1], newColors[5], newColors[3], newColors[0]];
            }
          }
          
          return { ...piece, position: newPosition, colors: newColors };
        }
        return piece;
      });

      setMoveHistory(prev => [...prev, { face, direction }]);
      return newState;
    });

    setTimeout(() => setIsRotating(false), 500);
  };

  const scrambleCube = () => {
    if (isRotating) return;

    const scrambleMoves = [];
    for (let i = 0; i < 20; i++) {
      const randomFace = FACES[Math.floor(Math.random() * FACES.length)];
      const randomDirection = Math.random() > 0.5 ? 'clockwise' : 'counterclockwise';
      scrambleMoves.push({ face: randomFace, direction: randomDirection });
    }

    scrambleMoves.forEach(move => {
      rotateFace(move.face, move.direction);
    });
  };

  const resetCube = () => {
    setCubeState(() => {
      const initialState = [];
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            initialState.push({
              position: [x, y, z],
              colors: [
                y === -1 ? COLORS[0] : COLORS[5],
                x === 1 ? COLORS[1] : COLORS[3],
                z === -1 ? COLORS[2] : COLORS[4],
                x === -1 ? COLORS[3] : COLORS[1],
                z === 1 ? COLORS[4] : COLORS[2],
                y === 1 ? COLORS[5] : COLORS[0],
              ]
            });
          }
        }
      }
      return initialState;
    });
    setMoveHistory([]);
  };

  return (
    <div className="game-background">
      <div className="rubiks-cube-container">
        <div className="glitch-title">Akshat's Cube Challenge</div>
        <style jsx>{`
          .game-background {
            background: linear-gradient(45deg, #0a192f, #112240);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            font-family: 'Orbitron', sans-serif;
          }
          .glitch-title {
            text-align: center;
            color: #64ffda;
            font-size: 2.5rem;
            margin-bottom: 20px;
            text-transform: uppercase;
            letter-spacing: 2px;
            text-shadow: 
              0 0 5px #64ffda,
              0 0 15px #64ffda;
            animation: glitch 1s infinite;
          }
          @keyframes glitch {
            0% { text-shadow: 0 0 5px #64ffda; }
            50% { text-shadow: 0 0 10px #64ffda, -2px 0 #64ffda; }
            100% { text-shadow: 0 0 5px #64ffda, 2px 0 #64ffda; }
          }
          .rubiks-cube-container {
            perspective: 1000px;
            width: 300px;
            background: rgba(17, 34, 64, 0.8);
            border-radius: 15px;
            padding: 20px;
            box-shadow: 
              0 0 10px #64ffda,
              0 0 20px #112240;
            backdrop-filter: blur(10px);
          }
          .rubiks-cube {
            width: 100%;
            height: 300px;
            position: relative;
            transform-style: preserve-3d;
            transition: transform 0.5s;
          }
          .cube-piece {
            position: absolute;
            width: 50px;
            height: 50px;
            transition: transform 0.5s;
            transform-style: preserve-3d;
          }
          .face {
            position: absolute;
            width: 48px;
            height: 48px;
            border: 1px solid #64ffda;
            opacity: 0.9;
            box-shadow: 0 0 5px #64ffda;
          }
          .face-0 { transform: rotateX(90deg) translateZ(25px); }
          .face-1 { transform: rotateY(90deg) translateZ(25px); }
          .face-2 { transform: translateZ(25px); }
          .face-3 { transform: rotateY(-90deg) translateZ(25px); }
          .face-4 { transform: rotateY(180deg) translateZ(25px); }
          .face-5 { transform: rotateX(-90deg) translateZ(25px); }
          .controls {
            margin-top: 20px;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
          }
          button {
            padding: 8px 15px;
            background-color: #64ffda;
            color: #0a192f;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-family: 'Orbitron', sans-serif;
            font-weight: bold;
            transition: all 0.3s ease;
            box-shadow: 0 0 10px rgba(100, 255, 218, 0.5);
          }
          button:hover {
            background-color: #0a192f;
            color: #64ffda;
            box-shadow: 0 0 15px rgba(100, 255, 218, 0.7);
          }
          .move-history {
            margin-top: 10px;
            height: 50px;
            overflow-y: auto;
            text-align: center;
            color: #64ffda;
            font-family: 'Courier New', monospace;
          }
        `}</style>
        <div className="rubiks-cube" style={{
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`
        }}>
          {cubeState.map((piece, index) => (
            <CubePiece key={index} position={piece.position.map(p => p * 55)} colors={piece.colors} />
          ))}
        </div>
        <div className="controls">
          {['U', 'D', 'F', 'B', 'L', 'R'].map(face => (
            <div key={face}>
              <button onClick={() => rotateFace(face, 'clockwise')}>
                {face}
              </button>
              <button onClick={() => rotateFace(face, 'counterclockwise')}>
                {face}'
              </button>
            </div>
          ))}
          <div>
            <button onClick={scrambleCube}>Scramble</button>
            <button onClick={resetCube}>Reset</button>
          </div>
        </div>
        <div className="move-history">
          <strong>Moves:</strong> {moveHistory.map((move, index) => 
            `${move.face}${move.direction === 'counterclockwise' ? "'" : ''} `
          )}
        </div>
      </div>
    </div>
  );
};

export default RubiksCube;
