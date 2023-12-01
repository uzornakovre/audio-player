import Player from "./components/player.js";
import "../assets/styles/index.scss";
import track1 from "../assets/audio/Gaddy_Bonus.mp3";
import track2 from "../assets/audio/Intermixture_Terraforma.mp3";

const player = new Player(".player", [
  {
    name: "Gaddy - Bonus",
    url: track1,
  },
  {
    name: "Intermixture - Terraforma",
    url: track2,
  },
]);

player.createPlayerElements();
