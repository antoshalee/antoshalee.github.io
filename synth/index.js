'use strict';

// Modules don't work well with standalone babel
// import {Synth} from './synth.js';
// import React from 'react';
// import ReactDOM from 'react-dom';

const e = React.createElement;

const audioContext = new AudioContext();
const gainNode = audioContext.createGain();

// Sum of all oscillators should't be more than 1
gainNode.gain.value = 0.1;
gainNode.connect(audioContext.destination);

const synthContainer = document.querySelector('#synth_container');

const synthEngine = new SynthEngine(audioContext, gainNode);

ReactDOM.render(e(Synth, {synthEngine: synthEngine}), synthContainer);
