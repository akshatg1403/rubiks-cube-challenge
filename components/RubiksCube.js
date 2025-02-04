'use client';
import React, { useState } from 'react';
import styles from '../styles/RubiksCube.module.css';

const COLORS = ['white', 'red', 'blue', 'orange', 'green', 'yellow'];
const FACES = ['U', 'D', 'F', 'B', 'L', 'R'];

const CubePiece = ({ position, colors }) => (
  <div className={styles.cubePiece} style={{
    transform: `translate3d(${position[0]}px, ${position[1]}px, ${position[2]}px)`
  }}>
    <div className={styles.face} style={{ 
      transform: 'rotateX(90deg) translateZ(25px)',
      backgroundColor: colors[0]
    }} />
    <div className={styles.face} style={{ 
      transform: 'rotateY(90deg) translateZ(25px)',
      backgroundColor: colors[1]
    }} />
    <div className={styles.face} style={{ 
      transform: 'translateZ(25px)',
      backgroundColor: colors[2]
    }} />
    <div className={styles.face} style={{ 
      transform: 'rotateY(-90deg) translateZ(25px)',
      backgroundColor: colors[3]
    }} />
    <div className={styles.face} style={{ 
      transform: 'rotateY(180deg) translateZ(25px)',
      backgroundColor: colors[4]
    }} />
    <div className={styles.face} style={{ 
      transform: 'rotateX(-90deg) translateZ(25px)',
      backgroundColor: colors[5]
    }} />
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

  const [rotation, setRotation] = useState({ x: -25, y: 45, z: 0 });
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
              [newColors[0], newColors[2], newColors[5], newColors[4]] = 
                [newColors[4], newColors[0], newColors[2], newColors[5]];
            } else {
              [newPosition[1], newPosition[2]] = [-newPosition[2], newPosition[1]];
              [newColors[0], newColors[2], newColors[5], newColors[4]] = 
                [newColors[2], newColors[5], newColors[4], newColors[0]];
            }
          } else if (axis === 'y') {
            if (direction === 'clockwise') {
              [newPosition[0], newPosition[2]] = [-newPosition[2], newPosition[0]];
              [newColors[1], newColors[2], newColors[3], newColors[4]] = 
                [newColors[4], newColors[1], newColors[2], newColors[3]];
            } else {
              [newPosition[0], newPosition[2]] = [newPosition[2], -newPosition[0]];
              [newColors[1], newColors[2], newColors[3], newColors[4]] = 
                [newColors[2], newColors[3], newColors[4], newColors[1]];
            }
          } else if (axis === 'z') {
            if (direction === 'clockwise') {
              [newPosition[0], newPosition[1]] = [newPosition[1], -newPosition[0]];
              [newColors[0], newColors[1], newColors[5], newColors[3]] = 
                [newColors[3], newColors[0], newColors[1], newColors[5]];
            } else {
              [newPosition[0], newPosition[1]] = [-newPosition[1], newPosition[0]];
              [newColors[0], newColors[1], newColors[5], newColors[3]] = 
                [newColors[1], newColors[5], newColors[3], newColors[0]];
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

    scrambleMoves.forEach((move, index) => {
      setTimeout(() => {
        rotateFace(move.face, move.direction);
      }, index * 600);
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
    <div className={styles.gameContainer}>
      <div className={styles.cubeContainer}>
        <h1 className={styles.title}>Akshat's Cube Challenge</h1>
        
        <div className={styles.cubeWrapper}>
          <div className={styles.cube} style={{
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) rotateZ(${rotation.z}deg)`
          }}>
            {cubeState.map((piece, index) => (
              <CubePiece 
                key={index} 
                position={piece.position.map(p => p * 55)} 
                colors={piece.colors} 
              />
            ))}
          </div>
        </div>

        <div className={styles.controls}>
          {FACES.map(face => (
            <div key={face}>
              <button 
                className={styles.button} 
                onClick={() => rotateFace(face, 'clockwise')}
              >
                {face}
              </button>
              <button 
                className={styles.button} 
                onClick={() => rotateFace(face, 'counterclockwise')}
              >
                {face}'
              </button>
            </div>
          ))}
          <button className={styles.button} onClick={scrambleCube}>
            Scramble
          </button>
          <button className={styles.button} onClick={resetCube}>
            Reset
          </button>
        </div>

        <div className={styles.moveHistory}>
          <strong>Moves:</strong> {moveHistory.map((move, index) => 
            `${move.face}${move.direction === 'counterclockwise' ? "'" : ''} `
          )}
        </div>
      </div>
    </div>
  );
};

export default RubiksCube;
