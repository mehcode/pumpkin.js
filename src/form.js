import React from "react"

export default class Form extends React.Component {
  constructor(props) {
    super(props)

    // Bind onSubmit
    this.onSubmit = this.onSubmit.bind(this)

    // Initialize state from the form properties
    this.state = props.form.getProps()
  }

  getChildContext() {
    let form = this.state.props

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
    }

    return {form}
  }

  componentDidMount() {
    this.unlisten = this.props.form.store.listen(this.setState.bind(this))
  }

  componentWillUnmount() {
    this.unlisten()
  }

  onSubmit(event) {
    event.preventDefault()

    // Saving the form validates and calls the callback if successful
    this.state.save((err, state) => {
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
