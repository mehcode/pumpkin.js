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
    return {form: this.state.props}
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
}

Form.childContextTypes = {
  form: React.PropTypes.object.isRequired
}
