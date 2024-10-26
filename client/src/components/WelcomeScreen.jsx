import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import logoImg from '../assets/images/front-logo.png';

const WelcomeScreen = ({ startPlay }) => {
  const userId = sessionStorage.getItem("userId");
  const opponentId = "maipro"

  const Navigate = useNavigate();

  //Wait for non

  // const opponentId = sessionStorage.getItem("opponentId");

  // useEffect(() => {
  //   if (!userId || !opponentId) {
  //     console.error("User or opponent ID is missing");
  //     setError("User or opponent information is missing.");
  //     return;
  //   } },[userId, opponentId]);

  const startGame = () => {
    Navigate("/game")
  };

  return (
    <div class="bg-front bg-cover bg-black/20 bg-blend-darken h-screen w-screen bg-no-repeat bg-center py-16 px-24 flex flex-col items-center justify-center">
       <img 
          src={logoImg}
          width={300}
          className="pb-8"
      />
      <h1 className="font-montserrat text-3xl font-black text-white drop-shadow-xl">Rules</h1>
      <div className="flex flex-col px-24 py-12 bg-white/20 rounded-3xl max-w-screen-lg m-6">
        <div className="flex justify-center">
          <h2 className='font-museo text-white font-bold text-2xl text-center'>Welcome {userId}.</h2>
        </div>
        <p className="font-museo text-white font-medium text-lg indent-12">
          You and your opponent are competing navy commanders. Your fleets are positioned at
          secret coordinates, and you take turns firing torpedoes at each other. The first
          to sink the other person’s whole fleet wins!
        </p>
        <div className="flex justify-center">
          <h2 className="font-museo text-white font-bold text-xl">Your opponent is {opponentId}.</h2>
        </div>
      </div>
      <button className="flex justify-center items-center gap-2 px-7 py-4 font-montserrat font-bold text-xl leading-none ring-4 ring-white text-white rounded-full bg-sky-700 hover:bg-green-800" onClick={startGame}>Play</button>
    </div>
  );
};

export default WelcomeScreen;

