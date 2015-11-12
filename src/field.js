import React from "react"

export default class Field extends React.Component {
  static propTypes = {
    // Name corresponding to a field name on the form
    name: React.PropTypes.string.isRequired,

    // <input type="X" /> (defaults to 'text')
    type: React.PropTypes.string,

    // Placeholder text on the input control
    placeholder: React.PropTypes.string,
  }

  static defaultPropTypes = {
    type: "text"
  }

  static contextTypes = {
    form: React.PropTypes.object.isRequired
  }

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
