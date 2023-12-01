import WaveSurfer from "wavesurfer.js";

export default class Player {
  constructor(selector = ".player", playlist = []) {
    this.player = document.querySelector(selector);
    this.playlist = playlist;
    this.currentTrack = null;
    this.audioContext = null;
    this.currentSrc = null;
  }

  _setCurrentSrc(audioItem) {
    this.currentTrack = audioItem;
    this.currentSrc = this.currentTrack.getAttribute("href");
  }

  _handleTrackClick(audioItem) {
    const playlistItems = this.player.querySelectorAll(".player__track");
    Array.from(playlistItems).forEach((item) => {
      if (item.src !== this.currentSrc) {
        this._setPlayIcon(item);
      }
    });

    this._setCurrentSrc(audioItem);
    this._handlePlayPause(audioItem);
  }

  _handlePlayPause(audioItem) {
    if (!this.audioContext) {
      this._createVisualiser(); // создаем визуализатор
    }

    if (this.wavesurfer.media.paused) {
      this._setPauseIcon(audioItem);
    } else this._setPlayIcon(audioItem);

    if (
      !this.audioElement.src.includes(this.currentSrc) ||
      !this.wavesurfer.media.src
    ) {
      this.audioElement.src = this.currentSrc;
      this.wavesurfer.load(this.currentSrc);
      this._startPlayWhenReady();
      this._setPauseIcon(audioItem);
    } else {
      this.wavesurfer.playPause();
    }
  }

  _startPlayWhenReady() {
    this.wavesurfer.on("ready", () => {
      this.wavesurfer.play();
    });
  }

  // метод установки слушателей событий
  _setEventListeners(audioItem) {
    // const playButton = this.player.querySelector(".player__button_play");
    // const pauseButton = this.player.querySelector(".player__button_pause");

    audioItem.addEventListener("click", (evt) => {
      evt.preventDefault();
      this._handleTrackClick(audioItem);
    });

    // playButton.addEventListener("click", () => {
    //   if (!this.currentSrc) {
    //     this._setCurrentSrc(audioItem);
    //     this.wavesurfer.load(this.currentSrc);
    //   }

    //   this._handlePlayPause();
    // });
    // pauseButton.addEventListener("click", () => this.wavesurfer.pause());

    const hover = this.player.querySelector("#hover");
    const waveform = this.player.querySelector("#waveform");
    waveform &&
      waveform.addEventListener(
        "pointermove",
        (e) => (hover.style.width = `${e.offsetX}px`)
      );
  }

  // метод создания элемента "плейлист"
  _createPlaylistElement(playlistElement) {
    // проходимся циклом по плейлисту
    this.playlist.forEach((track) => {
      // const playlistItem = document.createElement("li");
      // playlistItem.classList.add("player__track");
      // playlistElement.appendChild(playlistItem);

      const audioItem = document.createElement("a"); // для каждого трека создаем ссылку
      audioItem.classList.add("player__track");
      audioItem.innerHTML = `<i class="fa fa-play"></i>  ${track.name}`;
      audioItem.href = track.url; // присваеваем аттрибуту href значение url
      // audioItem.textContent = track.name; // в textContent записываем название трека

      this._setEventListeners(audioItem); // вешаем слушатели
      playlistElement.appendChild(audioItem);
    });
  }

  // метод создания элементов плеера
  createPlayerElements() {
    this.audioElement = new Audio(); // создаем элемент <audio>
    const playlistElement = document.createElement("div"); // создаем контейнер для плейлиста
    playlistElement.classList.add("player__playlist");
    // const playButton = document.createElement("button"); // создаем кнопку play/pause
    // playButton.classList.add("player__button", "player__button_play");
    // const pauseButton = document.createElement("button"); // создаем кнопку play/pause
    // pauseButton.classList.add("player__button", "player__button_pause");
    this.visualiser = document.createElement("canvas"); // создаем элемент <canvas> для визуализации
    this.visualiser.classList.add("player__equalizer");

    this.player.appendChild(this.audioElement);
    this.player.appendChild(playlistElement);
    this.player.appendChild(this.visualiser);
    // this.player.appendChild(playButton);
    // this.player.appendChild(pauseButton);

    this.createWaveForm();
    this._createPlaylistElement(playlistElement);
  }

  createWaveForm() {
    const container = this.player.querySelector("#waveform");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Define the waveform gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
    gradient.addColorStop(0, "#656666"); // Top color
    gradient.addColorStop((canvas.height * 0.7) / canvas.height, "#656666"); // Top color
    gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, "#ffffff"); // White line
    gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, "#ffffff"); // White line
    gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, "#B1B1B1"); // Bottom color
    gradient.addColorStop(1, "#B1B1B1"); // Bottom color

    // Define the progress gradient
    const progressGradient = ctx.createLinearGradient(
      0,
      0,
      0,
      canvas.height * 1.35
    );
    progressGradient.addColorStop(0, "#EE772F"); // Top color
    progressGradient.addColorStop(
      (canvas.height * 0.7) / canvas.height,
      "#EB4926"
    ); // Top color
    progressGradient.addColorStop(
      (canvas.height * 0.7 + 1) / canvas.height,
      "#ffffff"
    ); // White line
    progressGradient.addColorStop(
      (canvas.height * 0.7 + 2) / canvas.height,
      "#ffffff"
    ); // White line
    progressGradient.addColorStop(
      (canvas.height * 0.7 + 3) / canvas.height,
      "#F6B094"
    ); // Bottom color
    progressGradient.addColorStop(1, "#F6B094"); // Bottom color

    this.wavesurfer = WaveSurfer.create({
      container: container,
      waveColor: gradient,
      progressColor: progressGradient,
      barWidth: 2,
    });

    // Current time & duration
    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const secondsRemainder = Math.round(seconds) % 60;
      const paddedSeconds = `0${secondsRemainder}`.slice(-2);
      return `${minutes}:${paddedSeconds}`;
    };

    const timeEl = this.player.querySelector("#time");
    const durationEl = this.player.querySelector("#duration");
    this.wavesurfer.on(
      "decode",
      (duration) => (durationEl.textContent = formatTime(duration))
    );
    this.wavesurfer.on(
      "timeupdate",
      (currentTime) => (timeEl.textContent = formatTime(currentTime))
    );

    this.wavesurfer.on("interaction", () => {
      this.wavesurfer.play();
    });
  }

  // метод создания визуализатора
  _createVisualiser() {
    this.audioContext = new AudioContext();
    this.src = this.audioContext.createMediaElementSource(
      this.wavesurfer.media
    );
    // createMediaElementSource() cоздаёт объект MediaElementAudioSourceNode,
    // ассоциированный с HTMLMediaElement.  Может использоваться для воспроизведения или
    // манипулирования данными звукового потока из <video> или <audio> элементов.
    const analyser = this.audioContext.createAnalyser();
    // createAnalyser() cоздаёт объект AnalyserNode, который может быть использован для получения времени
    // воспроизведения и частоты воспроизводимого звука, что, в свою очередь может быть использовано
    // для визуализации звукового потока.
    const canvas = this.visualiser;
    canvas.classList.add("player__equalizer");
    const ctx = canvas.getContext("2d");
    this.src.connect(analyser);
    analyser.connect(this.audioContext.destination);
    // AudioContext.destination Содержит ссылку на AudioDestinationNode, представляющий собой
    // точку назначения  для всего аудио в этом контексте. Может рассматриваться как, например,
    // аудио-воспроизводящее устройство.
    analyser.fftSize = 128;
    const bufferLength = analyser.frequencyBinCount;
    // СfrequencyBinCount - свойство AnalyserNode, доступное только для чтения,
    // содержит общее количество точек данных, доступных для AudioContext sampleRate
    const dataArray = new Uint8Array(bufferLength); // создаем 8-битный массив
    const barWidth = canvas.width / bufferLength;
    let barHeight;
    let bar;

    function renderFrame() {
      // Метод requestAnimationFrame предоставляет доступ к жизненному циклу фрейма,
      // позволяя выполнять операции перед вычислением стилей и формированием макета (layout)
      // документа браузером.
      requestAnimationFrame(renderFrame);
      bar = 0;
      // Метод getByteFrequencyData() интерфейса AnalyserNode копирует текущие данные частоты
      // в переданный в него Uint8Array
      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] - 40; // высота полоски
        const r = barHeight + 25 * (i / bufferLength); // цвет полоски
        ctx.fillStyle = `rgb(${r}, 50, 255)`;
        ctx.fillRect(bar, canvas.height - barHeight, barWidth, barHeight);
        bar += barWidth + 2;
      }
    }

    renderFrame();
  }

  _setPauseIcon(elem) {
    const icon = elem.querySelector("i");
    icon.classList.add("fa-pause");
    icon.classList.remove("fa-play");
  }

  _setPlayIcon(elem) {
    const icon = elem.querySelector("i");
    icon.classList.remove("fa-pause");
    icon.classList.add("fa-play");
  }
}
