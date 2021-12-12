class SynthEngine {
  static oscillatorsNumber = 2

  constructor(audioContext, connectNode) {
    this.audioContext = audioContext;
    this.connectNode = connectNode;

    this.buildNodes();
  }

  buildNodes = () => {
    this.audioNodes = {oscillators: []};

    for (let i = 0; i < SynthEngine.oscillatorsNumber; i++) {
      const gainNode = this.audioContext.createGain();
      gainNode.connect(this.connectNode);

      const filterNode = this.audioContext.createBiquadFilter();

      this.audioNodes.oscillators.push({
        type: null,
        input: null,
        filterNode: filterNode,
        gainNode: gainNode,
      });
    }
  }

  // state is an object:
  // {
  //   oscillators: [{
  //     type: "sine",
  //     filterType: "lowpass",
  //     filterFrequency: 500,
  //     filterQ: 10,
  //     gain: 0.4
  //   }]
  // }
  applyState = (state) => {
    state.oscillators.forEach((osc, idx) => {      
      let filterNode, gainNode;
      let oscillator = this.audioNodes.oscillators[idx];
      oscillator.type = osc.type;
      
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
    this.audioNodes.oscillators.forEach((audioNode) => {
      let oscNode = this.audioContext.createOscillator();
      oscNode.type = audioNode.type;

      oscNode.frequency.setValueAtTime(440, this.audioContext.currentTime);
      oscNode.connect(audioNode.input);
      oscNode.start();
      oscNode.stop(this.audioContext.currentTime + 0.5);
    });
  }
}