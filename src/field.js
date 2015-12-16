import React from "react"
import omit from "lodash/object/omit"

export default class Field extends React.Component {
  constructor(props, context) {
    super()

    this.onBlurForInput = this.onBlurForInput.bind(this)
    this.onFocusForInput = this.onFocusForInput.bind(this)
    this.onChangeForInput = this.onChangeForInput.bind(this)

    const field = context.form[props.name]
    if (field == null) {
      throw new Error(`Unknown field, '${props.name}', check form definition`)
    }

    this.state = {focus: false, empty: field.value == null}
  }

  onChangeForInput(event) {
    // Invoke the `onChange` form callback
    this.context.form[this.props.name].onChange(event)

    // Adjust empty state
    let empty = (event.target.value == null || event.target.value.length === 0)
    this.setState({empty})
  }

  onBlurForInput(event) {
    // Invoke the `onBlur` form callback
    this.context.form[this.props.name].onBlur(event)

    // Invoke the `onBlur` callback (if given)
    if (this.props.onBlur) {
      this.props.onBlur(event)
    }

    // Remove the .has-focus className
    this.setState({focus: false})
  }

  onFocusForInput(event) {
    // Invoke the `onFocus` form callback
    this.context.form[this.props.name].onFocus(event)

    // Invoke the `onFocus` callback (if given)
    if (this.props.onFocus) {
      this.props.onFocus(event)
    }

    // Add the .has-focus className
    this.setState({focus: true})
  }

  componentDidUpdate() {
    // If we have a default value -- set it now
    const field = this.context.form[this.props.name]
    const el = this.refs.input
    if ((el.value == null || el.value.length === 0) &&
        (field.defaultValue != null && field.defaultValue.length > 0)) {
      el.value = field.defaultValue

      // Adjust empty state (if needed)
      let empty = (el.value == null || el.value.length === 0)
      if (empty !== this.state.empty) {
        this.setState({empty})
      }
    }
  }

  render() {
    const field = this.context.form[this.props.name]

    // Collect onX properties
    let events = {}
    for (let key of Object.keys(this.props)) {
      if (key.startsWith("on") && ["onBlur", "onFocus"].indexOf(key) < 0) {
        events[key] = this.props[key]
      }
    }

    let label = null
    if (this.props.label || this.props.placeholder) {
      label = (<label>{this.props.label || this.props.placeholder}</label>)
    }

    let className = "input-container"

    if (this.state.focus) {
      className += " is-focused"
    }

    if (this.state.empty) {
      className += " is-empty"
    }

    let error = null
    if (field.error != null) {
      className += " is-error"
      error = (
        <div className="error-container">
          <div className="error-message">
            {field.error}
          </div>
        </div>
      )
    }

    return (
      <div className={className}>
        {label}
        <input
          ref="input"
          name={this.props.name}
          type={this.props.type}
          onBlur={this.onBlurForInput}
          onFocus={this.onFocusForInput}
          onChange={this.onChangeForInput}
          autoFocus={this.props.autoFocus || false}
          placeholder={this.props.placeholder}
          {...omit(field, ["onBlur", "onFocus", "onChange", "error"])}
          {...events} />
        {error}
      </div>
    )
  }
}

Field.propTypes = {
  // Name corresponding to a field name on the form
  name: React.PropTypes.string.isRequired,

  // Label
  label:  React.PropTypes.string,

  // <input type="X" /> (defaults to 'text')
  type: React.PropTypes.string,

  // Placeholder text on the input control
  placeholder: React.PropTypes.string,
}

Field.defaultProps = {
  type: "text"
}

Field.contextTypes = {
  form: React.PropTypes.object.isRequired
}
