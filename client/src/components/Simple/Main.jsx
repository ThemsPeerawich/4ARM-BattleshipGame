import React, { useState, useRef, useEffect } from 'react';
import { GameView } from './GameView';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from "axios";
const userId = sessionStorage.getItem("userId");

import {
  placeAllComputerShips,
  SQUARE_STATE,
  indexToCoords,
  putEntityInLayout,
  generateEmptyLayout,
  generateRandomIndex,
  getNeighbors,
  updateSunkShips,
  coordsToIndex,
} from './layoutHelpers';

const AVAILABLE_SHIPS = [
  {
    name: 'carrier',
    length: 4,
    placed: null,
  },
  {
    name: 'battleship',
    length: 4,
    placed: null,
  },
  {
    name: 'cruiser',
    length: 4,
    placed: null,
  },
  {
    name: 'submarine',
    length: 4,
    placed: null,
  },
  {
    name: 'destroyer',
    length: 4,
    placed: null,
  },
];

export const Main = ({ oppPlaceShip, setMyPlaceShip, setExportHitsByPlayer, importHitReceived}) => { 
  const [gameState, setGameState] = useState('placement');
  const [winner, setWinner] = useState(null);

  const [currentlyPlacing, setCurrentlyPlacing] = useState(null);
  const [placedShips, setPlacedShips] = useState([]);
  const [availableShips, setAvailableShips] = useState(AVAILABLE_SHIPS);
  const [computerShips, setComputerShips] = useState([]);
  const [hitsByPlayer, setHitsByPlayer] = useState([]);
  const [hitsByComputer, setHitsByComputer] = useState([]);

  const initExportHit = useRef(false); 
  const initImportHit = useRef(false); 

  const Navigate = useNavigate();

  // *** PLAYER ***
  const selectShip = (shipName) => {
    let shipIdx = availableShips.findIndex((ship) => ship.name === shipName);
    const shipToPlace = availableShips[shipIdx];

    setCurrentlyPlacing({
      ...shipToPlace,
      orientation: 'horizontal',
      position: null,
    });
  };

  const placeShip = (currentlyPlacing) => {
    setPlacedShips([
      ...placedShips,
      {
        ...currentlyPlacing,
        placed: true,
      },
    ]);

    setAvailableShips((previousShips) =>
      previousShips.filter((ship) => ship.name !== currentlyPlacing.name)
    );

    setCurrentlyPlacing(null);
  };

  const rotateShip = (event) => {
    if (currentlyPlacing != null && event.button === 2) {
      setCurrentlyPlacing({
        ...currentlyPlacing,
        orientation:
          currentlyPlacing.orientation === 'vertical' ? 'horizontal' : 'vertical',
      });
    }
  };


  //*import/export */
  const sendDataToParent = () => {
    const data = placedShips;
    setMyPlaceShip(data)
    
  };

  const useData = () => {
    const data = oppPlaceShip;
    setComputerShips(data)
  };

  const exportHitToParent = () => {
    const data = hitsByPlayer;
    setExportHitsByPlayer(data)
    
  };

  const importHit = () => {
    const data = importHitReceived;
    setHitsByComputer(data)
  };


  //when click button
  const startTurn = () => {
    console.log("start")
    sendDataToParent();
    generateComputerShips();
    setGameState('player-turn');
  };

  const changeTurn = () => {
    setGameState((oldGameState) =>
      oldGameState === 'player-turn' ? 'computer-turn' : 'player-turn'
    );

  };

  // *** COMPUTER ***

  //we gotta take export of placedShip then set it in setComputerShips(placedShip)

  const generateComputerShips = () => {
    let placedComputerShips = placeAllComputerShips(AVAILABLE_SHIPS.slice());
    setComputerShips(placedComputerShips);
  };

  const computerFire = (index, layout) => {
    let computerHits;

    if (layout[index] === 'ship') {
      computerHits = [
        ...hitsByComputer,
        {
          position: indexToCoords(index),
          type: SQUARE_STATE.hit,
        },
      ];
    }
    if (layout[index] === 'empty') {
      computerHits = [
        ...hitsByComputer,
        {
          position: indexToCoords(index),
          type: SQUARE_STATE.miss,
        },
      ];
    }
    //update hit
    const sunkShips = updateSunkShips(computerHits, placedShips);
    const sunkShipsAfter = sunkShips.filter((ship) => ship.sunk).length;
    const sunkShipsBefore = placedShips.filter((ship) => ship.sunk).length;
    if (sunkShipsAfter > sunkShipsBefore) {
      playSound('sunk');
    }
    setPlacedShips(sunkShips);
    setHitsByComputer(computerHits);
  };

  // Change to computer turn, check if game over and stop if yes; if not fire into an eligible square
  const handleComputerTurn = () => {
    changeTurn();

    if (checkIfGameOver()) {
      return;
    }

    // Recreate layout to get eligible squares
    let layout = placedShips.reduce(
      (prevLayout, currentShip) =>
        putEntityInLayout(prevLayout, currentShip, SQUARE_STATE.ship),
      generateEmptyLayout()
    );

    layout = hitsByComputer.reduce(
      (prevLayout, currentHit) =>
        putEntityInLayout(prevLayout, currentHit, currentHit.type),
      layout
    );

    layout = placedShips.reduce(
      (prevLayout, currentShip) =>
        currentShip.sunk
          ? putEntityInLayout(prevLayout, currentShip, SQUARE_STATE.ship_sunk)
          : prevLayout,
      layout
    );

    let successfulComputerHits = hitsByComputer.filter((hit) => hit.type === 'hit');

    let nonSunkComputerHits = successfulComputerHits.filter((hit) => {
      const hitIndex = coordsToIndex(hit.position);
      return layout[hitIndex] === 'hit';
    });

    let potentialTargets = nonSunkComputerHits
      .flatMap((hit) => getNeighbors(hit.position))
      .filter((idx) => layout[idx] === 'empty' || layout[idx] === 'ship');

    // Until there's a successful hit
    if (potentialTargets.length === 0) {
      let layoutIndices = layout.map((item, idx) => idx);
      potentialTargets = layoutIndices.filter(
        (index) => layout[index] === 'ship' || layout[index] === 'empty'
      );
    }

    let randomIndex = generateRandomIndex(potentialTargets.length);

    let target = potentialTargets[randomIndex];

    //remove the automatic computer shoot

    // setTimeout(() => {
    //   computerFire(target, layout);
    //   changeTurn();
    // }, 300);
  };

//when hit by player changed -> export hit
useEffect(() => {
  console.log("successfully export hit to parent")
  if (initExportHit.current) {
    console.log("exportHitToParent")
    setTimeout(() => {
      exportHitToParent()
      changeTurn();
      console.log("next turn is",gameState)
    }, 300);
  } else {
    initExportHit.current = true; // Set to true after the initial render
  }
}, [hitsByPlayer]);


  //when importHitReceived changed -> import opponent hit
  useEffect(() => {
    console.log("successfully import hit from parent")
    if (initImportHit.current) {
      console.log("importHit")
      setTimeout(() => {
        importHit();
        changeTurn();
        console.log("next turn is",gameState)
      }, 300);
  } else {
    initImportHit.current = true; // Set to true after the initial render
  }
}, [importHitReceived]);

  // *** END GAME ***

  // Check if either player or computer ended the game
  const checkIfGameOver = () => {
    let successfulPlayerHits = hitsByPlayer.filter((hit) => hit.type === 'hit').length;
    let successfulComputerHits = hitsByComputer.filter((hit) => hit.type === 'hit')
      .length;

    if (successfulComputerHits === 20 || successfulPlayerHits === 20) {
      setGameState('game-over');

      if (successfulComputerHits === 20) {
        setWinner('computer');
        playSound('lose');
      }
      if (successfulPlayerHits === 20) {
        setWinner('player');
        playSound('win');
      }

      return true;
    }

    return false;
  };

  // When gameState is 'game-over' and the winner is the computer, navigate to /defeat
  useEffect(() => {
    if (gameState === 'game-over' && winner === 'player') {
      axios.put(`http://localhost:3001/result/${userId}/updateScore`)
        .then(result => {
            Navigate("/victory")
        })
        .catch(err => setError(console.log(err)));
    } 
    if (gameState === 'game-over' && winner === 'computer') {
      Navigate('/defeat'); // Navigate to defeat screen
    } 
  }, [gameState, winner, Navigate]); // Dependency array to trigger when gameState or winner changes

  //useData when computership change
    useEffect(() => {
      if(computerShips&&oppPlaceShip){
        useData();
      }
  }, [startTurn]);


  const startAgain = () => {
    setGameState('placement');
    setWinner(null);
    setCurrentlyPlacing(null);
    setPlacedShips([]); //our grid
    setAvailableShips(AVAILABLE_SHIPS);
    setComputerShips([]); //enemy grid
    setHitsByPlayer([]);
    setHitsByComputer([]);
  };

  const sunkSoundRef = useRef(null);
  const clickSoundRef = useRef(null);
  const lossSoundRef = useRef(null);
  const winSoundRef = useRef(null);

  const stopSound = (sound) => {
    sound.current.pause();
    sound.current.currentTime = 0;
  };
  const playSound = (sound) => {
    if (sound === 'sunk') {
      stopSound(sunkSoundRef);
      sunkSoundRef.current.play();
    }

    if (sound === 'click') {
      stopSound(clickSoundRef);
      clickSoundRef.current.play();
    }

    if (sound === 'lose') {
      stopSound(lossSoundRef);
      lossSoundRef.current.play();
    }

    if (sound === 'win') {
      stopSound(winSoundRef);
      winSoundRef.current.play();
    }
  };
  return (
    <React.Fragment>
      <audio
        ref={sunkSoundRef}
        src="/sounds/ship_sunk.wav"
        className="clip"
        preload="auto"
      />
      <audio
        ref={clickSoundRef}
        src="/sounds/click.wav"
        className="clip"
        preload="auto"
      />
      <audio ref={lossSoundRef} src="/sounds/lose.wav" className="clip" preload="auto" />
      <audio ref={winSoundRef} src="/sounds/win.wav" className="clip" preload="auto" />
      <GameView
        availableShips={availableShips}
        selectShip={selectShip}
        currentlyPlacing={currentlyPlacing}
        setCurrentlyPlacing={setCurrentlyPlacing}
        rotateShip={rotateShip}
        placeShip={placeShip}
        placedShips={placedShips}
        startTurn={startTurn}
        computerShips={computerShips}
        gameState={gameState}
        changeTurn={changeTurn}
        hitsByPlayer={hitsByPlayer}
        setHitsByPlayer={setHitsByPlayer}
        hitsByComputer={hitsByComputer}
        setHitsByComputer={setHitsByComputer}
        handleComputerTurn={handleComputerTurn}
        checkIfGameOver={checkIfGameOver}
        startAgain={startAgain}
        winner={winner}
        setComputerShips={setComputerShips}
        playSound={playSound}
      />
    </React.Fragment>
  );
};
