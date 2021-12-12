// import React from 'react';
// import {toNumber} from 'lodash';
// import {OscillatorSelector} from './oscillator_selector.jsx';
// import {FilterSelector} from './filter_selector.jsx';

const DEFAULT_STATE = {
  oscillators: new Array(SynthEngine.oscillatorsNumber).fill(null).map(()=>(
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
    this.state = DEFAULT_STATE;

    this.synthEngine = props.synthEngine;
  }

  componentDidMount() {
    this.synthEngine.applyState(this.state);
  }

  componentDidUpdate() {
    this.synthEngine.applyState(this.state);
  }

  playNote = () => {
    this.synthEngine.playNote();
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
              onChange={(e) => this.handleOscChange(idx, "filterFrequency", _.toNumber(e.target.value))}
            />

            <input
              type="number"
              value={osc.filterQ}
              onChange={(e) => this.handleOscChange(idx, "filterQ", _.toNumber(e.target.value))}
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
