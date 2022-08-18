import React, { Component, createRef } from "react";
import Api from "./api/Api";
import model from "./model/model";
import Home from "./pages/Home";
import "./assets/images/puc.png";
import "./styles/global.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.model = new model();

    this.state = {
      connected: false,
      room: {
        hasRoom: false,
        token: null,
      },
      username: "",
    };

    this.homeRef = createRef();

    // Callback functions bindings
    this.updateConnection = this.updateConnection.bind(this);
    this.handleRoomCreated = this.handleRoomCreated.bind(this);
    this.updateCanvas = this.updateCanvas.bind(this);
    this.updateMessages = this.updateMessages.bind(this);
    this.setUsername = this.setUsername.bind(this);
    this.addAttribute = this.addAttribute.bind(this);
    this.removeAttribute = this.removeAttribute.bind(this);
    this.addAttributes = this.addAttributes.bind(this);
    this.updateAttribute = this.updateAttribute.bind(this);
  }

  componentDidMount() {
    this.Api = new Api();
    this.Api.connect("https://half-edge-apy.herokuapp.com/");
    this.Api.listen(
      this.model,
      this.updateConnection,
      this.handleRoomCreated,
      this.updateCanvas,
      this.updateMessages,
      this.addAttribute,
      this.addAttributes,
      this.updateAttribute,
      this.removeAttribute
    );
  }

  updateConnection() {
    this.setState({
      ...this.state,
      connected: true,
    });
  }

  setUsername(username) {
    this.setState({
      ...this.state,
      username: username,
    });
  }

  updateMessages(message) {
    this.homeRef.current.updateMessages(message);
  }

  handleRoomCreated(room_id) {
    this.setState({
      ...this.state,
      room: {
        hasRoom: true,
        token: room_id,
      },
    });
  }

  updateCanvas() {
    this.homeRef.current.updateCanvas();
  }

  addAttribute(attribute) {
    this.homeRef.current.addAttribute(attribute);
  }

  addAttributes(attributes) {
    this.homeRef.current.addAttributes(attributes);
  }

  updateAttribute(attribute) {
    this.homeRef.current.updateAttribute(attribute);
  }

  removeAttribute(attribute) {
    this.homeRef.current.removeAttribute(attribute);
  }

  render() {
    return (
      <Home
        ref={this.homeRef}
        room={this.state.room}
        connected={this.state.connected}
        Api={this.Api}
        model={this.model}
        username={this.state.username}
        setUsername={this.setUsername}
      />
    );
  }
}

export default App;
