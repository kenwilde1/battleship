import "./App.css";
import Header from "./components/Header";
import GameboardContainer from "./components/GameboardContainer";
import { useEffect, useState } from "react";
import startGame from "./modules/startGame";

function App() {
  const [gArray, setgArray] = useState([]);

  useEffect(() => {
    const newArray = startGame();
    setgArray((oldArray) => [...oldArray, newArray]);
  }, []);

  const handleClickUser = (e) => {
    console.log(e.currentTarget.className);
  };

  return (
    <div className="App">
      <Header startGame={startGame} />
      <GameboardContainer
        handleClickUser={handleClickUser}
        arrayData={gArray}
      />
    </div>
  );
}

export default App;
