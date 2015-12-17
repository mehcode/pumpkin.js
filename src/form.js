import React from "react"
import isArray from "lodash/lang/isArray"

export default class Form extends React.Component {
  constructor(props) {
    super(props)

    this.state = {state: {}}

    // Bind onSubmit
    this.onSubmit = this.onSubmit.bind(this)
  }

  getChildContext() {
    let form = this.props.form.getProps().props

    // Attach atdl.
    for (let key of Object.keys(form)) {
      // Errors
      if (this.props.errors && this.props.errors[key] != null) {
        form[key].error = this.props.errors[key]
      }

      // Initial state
      if (this.props.defaultValues && this.props.defaultValues[key] != null) {
        form[key].defaultValue = this.props.defaultValues[key]
      }

      // Current value
      if (this.state.state[key]) {
        form[key].value = this.state.state[key]
      }
    }

    return {form}
  }

  componentDidMount() {
    this.unlisten = this.props.form.store.listen((state) => {
      this.setState(state)
    })
  }

  componentWillUnmount() {
    this.unlisten()
  }

  onSubmit(event) {
    event.preventDefault()

    // Saving the form validates and calls the callback if successful
    this.props.form.getProps().save((err, state) => {
      // TODO: Do something on errors // look into validation

      if (err == null) {
        this.props.onSubmit(state)
      }
    })
  }

  render() {
    return (
      <form className={this.props.className} noValidate
            onSubmit={this.onSubmit}>
        {this.props.children}
      </form>
    )
  }
}

Form.propTypes = {
  className: React.PropTypes.string,

  // Callback for when the form is submitted successfully
  onSubmit: React.PropTypes.func.isRequired,

  // Object of errors
  errors: React.PropTypes.object,

  // Default values for the forms' fields
  defaultValues: React.PropTypes.object,
}

Form.childContextTypes = {
  form: React.PropTypes.object.isRequired
}
