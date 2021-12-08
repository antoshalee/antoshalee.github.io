// import React from 'react';

class FilterSelector extends React.Component {
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
          <option></option>
          <option>lowpass</option>
          <option>highpass</option>
        </select>
      </>
    )
  }
}

