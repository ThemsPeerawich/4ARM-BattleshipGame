import React from 'react';
import { useLocation } from 'react-router-dom';
//import './play.css';  // You can create a CSS file for styles

const gridSize = 8;

const Play = () => {
  const location = useLocation();
  const { shipPositions } = location.state || { shipPositions: [] }; // Get ship positions from location state

  // Initialize grids
  const playerGrid = Array(gridSize * gridSize).fill(null);
  const opponentGrid = Array(gridSize * gridSize).fill(null);

  // Place ships on the player's grid based on ship positions
  shipPositions.forEach(({ ship, position }) => {
    playerGrid[position] = ship; // Place the ship in the player's grid
  });

  // Render the grids
  const renderGrid = (grid, isPlayerGrid) => {
    return grid.map((ship, index) => (
      <div key={index} className={`square ${isPlayerGrid ? 'player-square' : 'opponent-square'}`}>
        {ship && (
          <div className={`ship ${ship}`} style={{ position: 'relative' }}>
            {ship}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="play-area">
      <h2>Your Ships</h2>
      <div className="grid">
        {renderGrid(playerGrid, true)}
      </div>
      <h2>Opponent's Grid</h2>
      <div className="grid">
        {renderGrid(opponentGrid, false)}
      </div>
    </div>
  );
};

export default play;