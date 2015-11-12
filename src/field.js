import React from "react"

export default class Field extends React.Component {
  render() {
    return (
      <input
        name={this.props.name}
        type={this.props.type}
        placeholder={this.props.placeholder}
        {...this.context.form[this.props.name]} />
    )
  }
}

Field.propTypes = {
  // Name corresponding to a field name on the form
  name: React.PropTypes.string.isRequired,

  // <input type="X" /> (defaults to 'text')
  type: React.PropTypes.string,

  // Placeholder text on the input control
  placeholder: React.PropTypes.string,
}

Field.defaultPropTypes = {
  type: "text"
}

Field.contextTypes = {
  form: React.PropTypes.object.isRequired
}
