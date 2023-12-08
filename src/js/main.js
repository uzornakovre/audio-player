import Player from "./components/player.js";
import "../assets/styles/index.scss";
import track1 from "../assets/audio/Charles_Wright_&_The_Watts_103rd_Street_Rhythm_Band_Express_Yourself_Mocean_Worker_Remix.mp3";
import track2 from "../assets/audio/Funky_Destination_The_Ocean_Of_My_Mind.mp3";
import track3 from "../assets/audio/The_Kiffness_Hold_Onto_My_Fur.mp3";
import track4 from "../assets/audio/Manic_Focus,_ProbCause_feat_FreshQuo_Maniac_Brainiac.mp3";
import track5 from "../assets/audio/Gaddy_Bonus.mp3";
import track6 from "../assets/audio/Intermixture_Terraforma.mp3";

const player = new Player(".player", [
  {
    name: "Charles Wright & The Watts 103rd Street Rhythm Band - Express Yourself (Mocean Worker Remix)",
    url: track1,
    id: 1,
  },
  {
    name: "Funky Destination - The Ocean Of My Mind",
    url: track2,
    id: 2,
  },
  {
    name: "The Kiffness - Hold Onto My Fur",
    url: track3,
    id: 3,
  },
  {
    name: "Manic Focus, ProbCause feat. FreshQuo - Maniac Brainiac",
    url: track4,
    id: 4,
  },
  {
    name: "Gaddy - When It Goes Down",
    url: track5,
    id: 5,
  },
  {
    name: "Intermixture - Terraforma",
    url: track6,
    id: 6,
  },
]);

player.createPlayerElements();
