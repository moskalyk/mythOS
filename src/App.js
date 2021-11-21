// eslint-disable-next-line no-restricted-globals

import logo from './logo.svg';
import './App.css';

import {useEffect, useState} from 'react'

// import Input from '@mui/material/Input';

// require('./lib/camera_utils.js')
// require('./lib/control_utils.js')
// require('./lib/control_utils_3d.js')
// require('./lib/drawing_utils.js')
// require('./lib/hands.js')

import Port from './Port.js'
var CommitsGraph = require('react-commits-graph')
var commits = require('./commits.json')

var selected = null


function App() {

  const [isThisThingOn, setIsThisThingOn] = useState(false)
  const [ensValue, setEnsValue] = useState('')
  const [home, setHome] = useState(true)

  useEffect(async ()=> {
    const root = document.documentElement;
    const sign = document.getElementById("sign");
    const flicker = document.getElementById("flicker");


    if(!isThisThingOn){
      document.onmousemove = mouse;

      function mouse(e) {
        let x = (window.event.clientX / root.offsetWidth) * 90 - 45;
        let y = (window.event.clientY / root.offsetHeight) * 90 - 45;
        sign.style.fontVariationSettings = `'HROT' ${x}, 'VROT' ${y}`;
        sign.style.transform = `rotatex(${y * -0.25}deg) rotatey(${x * 0.25}deg)`;
      }

      setInterval(turnItOn, 50);

      function turnItOn() {
        let v = Math.round(Math.random());
        flicker.style.opacity = v;
      }
      const port = new Port()

      const cloud = await port.getCloud()
      console.log(cloud)

      const inspect = await port.inspect()
      console.log(inspect)

      setIsThisThingOn(true)
    }


    // You can change global variables here:
    var radius = 240; // how big of the radius
    var autoRotate = true; // auto rotate or not
    var rotateSpeed = -60; // unit: seconds/360 degrees
    var imgWidth = 120; // width of images (unit: px)
    var imgHeight = 170; // height of images (unit: px)

    // Link of background music - set 'null' if you dont want to play background music
    var bgMusicURL = 'https://api.soundcloud.com/tracks/143041228/stream?client_id=587aa2d384f7333a886010d5f52f302a';
    var bgMusicControls = true; // Show UI music control

    /*
         NOTE:
           + imgWidth, imgHeight will work for video
           + if imgWidth, imgHeight too small, play/pause button in <video> will be hidden
           + Music link are taken from: https://hoangtran0410.github.io/Visualyze-design-your-own-/?theme=HauMaster&playlist=1&song=1&background=28
           + Custom from code in tiktok video  https://www.facebook.com/J2TEAM.ManhTuan/videos/1353367338135935/
    */


    // ===================== start =======================
    // animation start after 1000 miliseconds
    setTimeout(init, 1000);

    var odrag = document.getElementById('drag-container');
    var ospin = document.getElementById('spin-container');
    var aImg = ospin.getElementsByTagName('img');
    var aVid = ospin.getElementsByTagName('video');
    var aEle = [...aImg, ...aVid]; // combine 2 arrays

    // Size of images
    ospin.style.width = imgWidth + "px";
    ospin.style.height = imgHeight + "px";

    // Size of ground - depend on radius
    var ground = document.getElementById('ground');
    ground.style.width = radius * 3 + "px";
    ground.style.height = radius * 3 + "px";

    function init(delayTime) {
      for (var i = 0; i < aEle.length; i++) {
        aEle[i].style.transform = "rotateY(" + (i * (360 / aEle.length)) + "deg) translateZ(" + radius + "px)";
        aEle[i].style.transition = "transform 1s";
        aEle[i].style.transitionDelay = delayTime || (aEle.length - i) / 4 + "s";
      }
    }

    function applyTranform(obj) {
      // Constrain the angle of camera (between 0 and 180)
      if(tY > 180) tY = 180;
      if(tY < 0) tY = 0;

      // Apply the angle
      obj.style.transform = "rotateX(" + (-tY) + "deg) rotateY(" + (tX) + "deg)";
    }

    function playSpin(yes) {
      ospin.style.animationPlayState = (yes?'running':'paused');
    }

    var sX, sY, nX, nY, desX = 0,
        desY = 0,
        tX = 0,
        tY = 10;

    // auto spin
    if (autoRotate) {
      var animationName = (rotateSpeed > 0 ? 'spin' : 'spinRevert');
      ospin.style.animation = `${animationName} ${Math.abs(rotateSpeed)}s infinite linear`;
    }

    // // add background music
    // if (bgMusicURL) {
    //   document.getElementById('music-container').innerHTML += `
    // <audio src="${bgMusicURL}" ${bgMusicControls? 'controls': ''} autoplay loop>    
    // <p>If you are reading this, it is because your browser does not support the audio element.</p>
    // </audio>
    // `;
    // }

    // setup events
    document.onpointerdown = function (e) {
      clearInterval(odrag.timer);
      e = e || window.event;
      var sX = e.clientX,
          sY = e.clientY;

      this.onpointermove = function (e) {
        e = e || window.event;
        var nX = e.clientX,
            nY = e.clientY;
        desX = nX - sX;
        desY = nY - sY;
        tX += desX * 0.1;
        tY += desY * 0.1;
        applyTranform(odrag);
        sX = nX;
        sY = nY;
      };

      this.onpointerup = function (e) {
        odrag.timer = setInterval(function () {
          desX *= 0.95;
          desY *= 0.95;
          tX += desX * 0.1;
          tY += desY * 0.1;
          applyTranform(odrag);
          playSpin(false);
          if (Math.abs(desX) < 0.5 && Math.abs(desY) < 0.5) {
            clearInterval(odrag.timer);
            playSpin(true);
          }
        }, 17);
        this.onpointermove = this.onpointerup = null;
      };

      return false;
    };

    document.onmousewheel = function(e) {
      e = e || window.event;
      var d = e.wheelDelta / 20 || -e.detail;
      radius += d;
      init(1);
    };

    // // ============================ //
    // const videoElement = document.getElementsByClassName('input_video')[0];
    // const canvasElement = document.getElementsByClassName('output_canvas')[0];
    // const canvasCtx = canvasElement.getContext('2d');
    // const controls = window;
    // const drawingUtils = window;

    // const controls3d = window;
    // const mpHands = window;

    // const config = { locateFile: (file) => {
    //     return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@${mpHands.VERSION}/${file}`;
    // } };

    // const landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0];
    // const grid = new controls3d.LandmarkGrid(landmarkContainer, {
    //     connectionColor: 0xfff,
    //     definedColors: [{ name: 'Left', value: 0xffa500 }, { name: 'Right', value: 0x00ffff }],
    //     range: 0.2,
    //     fitToGrid: false,
    //     labelSuffix: 'm',
    //     landmarkSize: 2,
    //     numCellsPerAxis: 4,
    //     showHidden: false,
    //     centered: true,
    // });

    // function onResults(results) {
    //     // Draw the overlays.
    //     canvasCtx.save();
    //     canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    //     canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    //     if (results.multiHandLandmarks && results.multiHandedness) {
    //         for (let index = 0; index < results.multiHandLandmarks.length; index++) {
    //             const classification = results.multiHandedness[index];
    //             const isRightHand = classification.label === 'Right';
    //             const landmarks = results.multiHandLandmarks[index];
    //             drawingUtils.drawConnectors(canvasCtx, landmarks, mpHands.HAND_CONNECTIONS, { color: isRightHand ? '#00FF00' : '#FF0000' });
    //             drawingUtils.drawLandmarks(canvasCtx, landmarks, {
    //                 color: isRightHand ? '#00FF00' : '#FF0000',
    //                 fillColor: isRightHand ? '#FF0000' : '#00FF00',
    //                 radius: (data) => {
    //                     return drawingUtils.lerp(data.from.z, -0.15, .1, 10, 1);
    //                 }
    //             });
    //         }
    //     }
    //     canvasCtx.restore();
    //     if (results.multiHandWorldLandmarks) {
    //         // We only get to call updateLandmarks once, so we need to cook the data to
    //         // fit. The landmarks just merge, but the connections need to be offset.
    //         const landmarks = results.multiHandWorldLandmarks.reduce((prev, current) => [...prev, ...current], []);
    //         const colors = [];
    //         let connections = [];
    //         // console.log(landmarks)
    //         for (let loop = 0; loop < results.multiHandWorldLandmarks.length; ++loop) {
    //             const offset = loop * mpHands.HAND_CONNECTIONS.length;
    //             const offsetConnections = mpHands.HAND_CONNECTIONS.map((connection) => [connection[0] + offset, connection[1] + offset]);
    //             // console.log(offsetConnections)
    //             connections = connections.concat(offsetConnections);
    //             const classification = results.multiHandedness[loop];
    //             colors.push({
    //                 list: offsetConnections.map((unused, i) => i + offset),
    //                 color: classification.label,
    //             });
    //             // console.log(colors)
    //         }
    //         grid.updateLandmarks(landmarks, connections, colors);
    //     }
    //     else {
    //         grid.updateLandmarks([]);
    //     }
    // }

    // const hands = new mpHands.Hands(config);
    // hands.onResults(onResults);

    // hands.setOptions({
    //   maxNumHands: 2,
    //   modelComplexity: 1,
    //   minDetectionConfidence: 0.5,
    //   minTrackingConfidence: 0.5
    // });
    // // hands.onResults(onResults);

    // const camera = new Camera(videoElement, {
    //   onFrame: async () => {
    //     await hands.send({image: videoElement});
    //   },
    //   width: 1280,
    //   height: 720
    // });
    // camera.start();

  })

  const handleChange = (e) => {
    console.log(e.state.value)
    setEnsValue(e.state.value)
  }


  function handleClick(sha) {
    selected = sha
    // render()
  }

  return (
    <div className="App">

    { home ? (
      <>
        <div id="drag-container">
          <br/>
          <div id="ground"></div>
          <div id="spin-container">
            <img src="https://www.trustedtarot.com/img/cards/ace-of-cups.png" alt=""/>
            <img src="https://www.trustedtarot.com/img/cards/five-of-wands.png" alt=""/>
            <img src="https://www.trustedtarot.com/img/cards/five-of-cups.png" alt=""/>
            <img src="https://www.trustedtarot.com/img/cards/seven-of-swords.png" alt=""/>
            <img src="https://www.trustedtarot.com/img/cards/eight-of-pentacles.png" alt=""/>
          </div>
        </div>
        <h1 contenteditable spellcheck="false" id="sign" class="sign">myth<span id="flicker" class="flicker">O</span>s</h1>
      </>
      ) : (
      <>
        <div>gaia</div>
        <CommitsGraph
          commits={commits}
          onClick={handleClick}
          selected={selected}
        />
      </>
      ) 
    }
    </div>
  );
}

export default App;
