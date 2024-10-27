import React from 'react';
import { ReplicaBox } from './ReplicaBox';

export const PlayerFleet = ({
  availableShips,
  selectShip,
  currentlyPlacing,
  startTurn,
  startAgain,
}) => {
  let shipsLeft = availableShips.map((ship) => ship.name);

  // For every ship still available, return a Replica Box with the ship's name and as many squares as its length
  let shipReplicaBoxes = shipsLeft.map((shipName) => (
    <ReplicaBox
      selectShip={selectShip}
      key={shipName}
      isCurrentlyPlacing={currentlyPlacing && currentlyPlacing.name === shipName}
      shipName={shipName}
      availableShips={availableShips}
    />
  ));

  let fleet = (
    <div className="bg-cyan-700 m-3 rounded-3xl" id="replica-fleet">
      {shipReplicaBoxes}
      <p className="font-museo text-white text-lg">Right click to rotate before you position.</p>
      <p className="gap-2 px-6 py-3 font-montserrat font-bold text-lg leading-none ring-4 ring-white text-white rounded-full bg-sky-700 hover:bg-green-800" onClick={startAgain}>
        Restart
      </p>
    </div>
  );

  let playButton = (
    <div className="bg-cyan-700 m-3 p-3 rounded-3xl" id="play-ready">
      <p className="font-museo text-lg text-white px-3 py-4">Ships are in formation.</p>
      <button className="gap-2 px-6 py-3 font-montserrat font-bold text-lg leading-none ring-4 ring-white text-white rounded-full bg-sky-700 hover:bg-green-800" id="play-button" onClick={startTurn}>
        Confirm
      </button>
    </div>
  );

  return (
    <div id="available-ships">
      <div className="font-museo text-white text-2xl font-bold">Your Ships</div>
      {availableShips.length > 0 ? fleet : playButton}
    </div>
  );
};
