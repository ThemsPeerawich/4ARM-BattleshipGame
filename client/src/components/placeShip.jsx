import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
//import "./placeshipTest.css";

const gridSize = 8;
const squareSize = 80;

const initialGrid = Array(gridSize * gridSize).fill(null);

// Initialize pawns for both players
const initializeShips = (grid) => {
  const newGrid = [...grid];

  newGrid[8] = "Destroyer";
  newGrid[16] = "Submarine";
  newGrid[32] = "Battlecruiser";
  newGrid[48] = "Aircraftcarrier";

  return newGrid;
};

const PlaceshipGrid = () => {
  const [grid, setGrid] = useState(initializeShips(initialGrid));
  const [draggedPiece, setDraggedPiece] = useState(null);
  const [currentSquare, setCurrentSquare] = useState(null);

  const navigate = useNavigate();  // Initialize navigate function

  // Handle when dragging starts
  const handleDragStart = (e, ship, index) => {
    setDraggedPiece(ship);
    setCurrentSquare(index);
  };

  // Handle when dragging over a square (prevent default to allow drop)
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // Handle dropping of the piece, snap it to the nearest square
  const handleDrop = (e, index) => {
    if (!grid[index]) {  // Check if the target square is empty
      const updatedGrid = [...grid];

      // Remove piece from its original position
      updatedGrid[currentSquare] = null;

      // Place piece at the new position
      updatedGrid[index] = draggedPiece;

      // Update the grid state
      setGrid(updatedGrid);
    } else {
      alert("This square is occupied. Choose another square.");
    }

    // Reset the drag state
    setDraggedPiece(null);
    setCurrentSquare(null);
  };

  // New function to get the positions of all ships
  const handleFinish = () => {
    const shipPositions = grid.reduce((positions, ship, index) => {
      if (ship) {
        positions.push({ ship, position: index });
      }
      return positions;
    }, []);

    console.log("Ship Positions:", shipPositions);
    // You can do anything with this data, like sending it to a server or storing it elsewhere

    // Navigate to the Play page after clicking the Finish button
    navigate("/play");
  };

  // Render chessboard
  const renderGrid = () => {
    return grid.map((ship, index) => {
      //const isWhiteSquare = (Math.floor(index / gridSize) + (index % gridSize)) % 2 === 0;
      //const squareColor = isWhiteSquare ? "white-square" : "black-square";

      return (
        <div
          key={index}
          className={`square ${index}`}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
        >
          {ship && (
            <div
              className={`ship ${ship}`}
              draggable
              onDragStart={(e) => handleDragStart(e, ship, index)}
              style={{ position: "relative", top: 0, left: 0 }}
            />
          )}
        </div>
      );
    });
  };

  return (
    <div>
      <div className="grid">{renderGrid()}</div>
      <button className="finish-button" onClick={handleFinish}>Finish</button>
    </div>
  
);
  
};

export default PlaceshipGrid;