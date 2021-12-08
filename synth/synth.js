// import React from 'react';
// import {toNumber} from 'lodash';
// import {OscillatorSelector} from './oscillator_selector.jsx';
// import {FilterSelector} from './filter_selector.jsx';

const OSCILLATORS_NUMBER = 2;

const DEFAULT_STATE = {
  oscillators: new Array(OSCILLATORS_NUMBER).fill(null).map(()=>(
    {
      // Try keep state structure as plain as possible
      // for more simple immutable state updates
      type: "sine" ,
      filterType: "lowpass",
      filterFrequency: 500,
      filterQ: 10,
      gain: 0.4,
    }
  ))
}

class Synth extends React.Component {
  constructor(props) {
    super(props);

    this.interval = null;
    this.audioContext = props.audioContext;
    this.connectNode = props.connectNode;
    this.state = DEFAULT_STATE;
    this.audioNodes = null;
  }

  componentDidMount() {
    this.buildAudioNodes();
    this.applyStateToAudioNodes();
  }

  componentDidUpdate() {
    this.applyStateToAudioNodes();
  }

  buildAudioNodes = () => {
    // We store audioNodes in the object
    // which structure corresponds to the state structure
    // to easy update its values
    // oscillatorNodes not in this array since they
    // will be created per each note play
    this.audioNodes = {oscillators: []};

    for (let i = 0; i < this.state.oscillators.length; i++) {
      const gainNode = this.audioContext.createGain();
      gainNode.connect(this.connectNode);

      const filterNode = this.audioContext.createBiquadFilter();

      this.audioNodes.oscillators.push({
        input: null,
        filterNode: filterNode,
        gainNode: gainNode,
      });
    }
  }

  applyStateToAudioNodes = () => {
    this.state.oscillators.forEach((osc, idx) => {
      let filterNode, gainNode;
      let oscillator = this.audioNodes.oscillators[idx];
      ({filterNode, gainNode} = oscillator);

      gainNode.gain.value = osc.gain;

      if (osc.filterType == "" || !osc.filterType) {
        oscillator.input = gainNode;
        filterNode.disconnect();
      } else {
        filterNode.type = osc.filterType;
        filterNode.frequency.value = osc.filterFrequency;
        filterNode.Q.value = osc.filterQ;

        filterNode.connect(gainNode);
        oscillator.input = filterNode;
      }
    })
  }

  playNote = () => {
    this.state.oscillators.forEach((osc, idx) => {
      let input = this.audioNodes.oscillators[idx].input;

      let oscNode = this.audioContext.createOscillator();
      oscNode.type = osc.type;

      oscNode.frequency.setValueAtTime(440, this.audioContext.currentTime);
      oscNode.connect(input);
      oscNode.start();
      oscNode.stop(this.audioContext.currentTime + 0.5);
    });
  }

  handlePlay = (e) => {
    this.interval = setInterval(this.playNote, 1000);
  }

  handleStop = (e) => {
    clearInterval(this.interval);
  }

  handleOscChange = (idx, key, value) => {
    let oscillators = [...this.state.oscillators];

    oscillators[idx][key] = value;
    this.setState({oscillators: oscillators});
  }

  render() {
    return(
      <>
        <h1>This is a synth</h1>
        <button onClick={this.handlePlay}>Play</button>
        <button onClick={this.handleStop}>Stop</button>
        {this.state.oscillators.map((osc, idx) => (
          <div>
            <OscillatorSelector
              defaultValue={osc.type}
              handleChange={(e) => this.handleOscChange(idx, "type", e.target.value)}
            />
            <FilterSelector
              defaultValue={osc.filterType}
              handleChange={(e) => this.handleOscChange(idx, "filterType", e.target.value)}
            />

            <input
              type="number"
              value={osc.filterFrequency}
              onChange={(e) => this.handleOscChange(idx, "filterFrequency", toNumber(e.target.value))}
            />

            <input
              type="number"
              value={osc.filterQ}
              onChange={(e) => this.handleOscChange(idx, "filterQ", toNumber(e.target.value))}
            />

            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={osc.gain}
              onChange={(e) => this.handleOscChange(idx, "gain", parseFloat(e.target.value))}
            />
          </div>
        ))}
      </>
    )
  }
}
