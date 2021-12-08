// import React from 'react';

class OscillatorSelector extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = props.handleChange;
  }

  render() {
    return(
      <>
        <select
          onChange={this.handleChange}
          defaultValue={this.props.defaultValue}
        >
          <option>sine</option>
          <option>square</option>
          <option>sawtooth</option>
          <option>triangle</option>
        </select>
      </>
    )
  }
}

