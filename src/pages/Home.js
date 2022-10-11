import React, { Component, createRef } from "react";
import Canvas from "../components/Canvas/Canvas";
import Header from "../components/Header/Header";
import SideMenu from "../components/Menu/SideMenu";
import { Checkbox, Input } from "antd";
import "./Home.css";
import RoomModal from "../components/RoomModal";
import CameraOptions from "../components/CameraOptions";
import Attributes from "../components/Attributes";
import Messages from "../components/Messages";
import CreateRoom from "../components/CreateRoom";
import CommandLine from "../components/CommandLine";
import MeshManager from "../components/MeshManager";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mouseAction: null,
      isAttributeVisible: false,
      attributes: [],
    };

    this.canvasRef = createRef();
    this.roomModalRef = createRef();
    this.attributesRef = createRef();
    this.messagesRef = createRef();
    this.createRoomRef = createRef();
    this.meshModalRef = createRef();
    this.sideMenuRef = createRef();
    // Bind handle functions
    this.changeMouseAction = this.changeMouseAction.bind(this);
    this.updateMessages = this.updateMessages.bind(this);
    this.setAttibuteVisible = this.setAttibuteVisible.bind(this);
    this.setAttibuteNotVisible = this.setAttibuteNotVisible.bind(this);
    this.addAttribute = this.addAttribute.bind(this);
    this.addAttributes = this.addAttributes.bind(this);
    this.removeAttribute = this.removeAttribute.bind(this);
    this.updateAttribute = this.updateAttribute.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // Resize canvas because of canvas component is rendered
    if (this.props.room.hasRoom) {
      this.canvasRef.current.resizeGL();
    }
  }

  changeMouseAction(mouseAction) {
    this.setState({
      mouseAction: mouseAction,
    });
  }

  updateCanvas() {
    this.canvasRef.current.paint();
  }

  updateMessages(message) {
    this.messagesRef.current.setState({
      ...this.messagesRef.current.state,
      messages: [...this.messagesRef.current.state.messages, message],
    });
  }

  toggleSnap() {
    this.canvasRef.current.setState({
      ...this.canvasRef.state,
      is_SnapOn: !this.canvasRef.current.state.is_SnapOn,
    });
  }

  changeSnapDataX(e) {
    const { gridY } = this.canvasRef.current.grid.getGridSpace();
    this.canvasRef.current.grid.setSnapData(
      parseFloat(e.target.value),
      parseFloat(gridY),
      this.canvasRef.current.state.is_SnapOn
    );
    this.canvasRef.current.paint();
  }

  changeSnapDataY(e) {
    const { gridX } = this.canvasRef.current.grid.getGridSpace();
    this.canvasRef.current.grid.setSnapData(
      parseFloat(gridX),
      parseFloat(e.target.value),
      this.canvasRef.current.state.is_SnapOn
    );
    this.canvasRef.current.paint();
  }

  addAttribute(newAttribute) {
    this.setState(
      {
        ...this.state,
        attributes: [...this.state.attributes, newAttribute],
      },
      () => {
        if (this.sideMenuRef.current.selectedAttributes == null) {
          this.sideMenuRef.current.handleSelectAttribute(newAttribute.name);
        }
      }
    );
  }

  addAttributes(attributes) {
    this.setState(
      {
        ...this.state,
        attributes: attributes,
      },
      () => {
        if (this.sideMenuRef.current.selectedAttributes == null) {
          this.sideMenuRef.current.handleSelectAttribute(
            this.state.attributes[0]?.name
          );
        }
      }
    );
  }

  updateAttribute(updatedAttribute) {
    const updatedAttributes = this.state.attributes.map((attribute) => {
      if (attribute.name == updatedAttribute.name) {
        return updatedAttribute;
      }
      return attribute;
    });

    this.setState(
      {
        ...this.state,
        attributes: updatedAttributes,
      },
      () => {
        if (this.sideMenuRef.current.selectedAttributes == null) {
          this.sideMenuRef.current.handleSelectAttribute(updatedAttribute.name);
        }
      }
    );
  }

  removeAttribute(name) {
    const attributes = this.state.attributes.filter(
      (attribute) => attribute.name != name
    );

    this.setState(
      {
        ...this.state,
        attributes: attributes,
      },
      () => {
        if (this.sideMenuRef.current.selectedAttributes == null) {
          this.sideMenuRef.current.handleSelectAttribute(
            this.state.attributes[0]?.name
          );
        }
      }
    );
  }

  setAttibuteVisible() {
    this.setState({
      ...this.state,
      isAttributeVisible: true,
    });
  }

  setAttibuteNotVisible() {
    this.setState({
      ...this.state,
      isAttributeVisible: false,
    });
  }

  render() {
    return (
      <>
        <div className="container">
          <Header room={this.props.room} connected={this.props.connected} />
          <div className={`content-${this.props.room.hasRoom}`}>
            <SideMenu
              connected={this.props.connected}
              attributesRef={this.attributesRef}
              attributes={this.state.attributes}
              roomModalRef={this.roomModalRef}
              createRoomRef={this.createRoomRef}
              meshModalRef={this.meshModalRef}
              ref={this.sideMenuRef}
              Api={this.props.Api}
              canvasRef={this.canvasRef}
              model={this.props.model}
              updateAttribute={this.updateAttribute}
              removeAttribute={this.removeAttribute}
              setAttibuteVisible={this.setAttibuteVisible}
              changeMouseAction={this.changeMouseAction}
            />
            <Canvas
              ref={this.canvasRef}
              Api={this.props.Api}
              model={this.props.model}
              mouseAction={this.state.mouseAction}
            />
            {this.props.room.hasRoom && (
              <Messages
                ref={this.messagesRef}
                Api={this.props.Api}
                model={this.props.model}
                username={this.props.username}
                canvasRef={this.canvasRef}
              />
            )}
            <CameraOptions
              room={this.props.room}
              canvasRef={this.canvasRef}
              model={this.props.model}
            />
            <div className={`grid-options-${this.props.room.hasRoom}`}>
              <Checkbox
                onChange={this.toggleSnap.bind(this)}
                className="grid-snap"
              >
                Snap
              </Checkbox>
              <Input
                onChange={this.changeSnapDataX.bind(this)}
                placeholder="1.0"
                className="grid-input-x"
              />
              <Input
                onChange={this.changeSnapDataY.bind(this)}
                placeholder="1.0"
                className="grid-input-y"
              />
            </div>
          </div>
        </div>

        <RoomModal
          Api={this.props.Api}
          ref={this.roomModalRef}
          setUsername={this.props.setUsername}
        />

        <CreateRoom
          Api={this.props.Api}
          ref={this.createRoomRef}
          setUsername={this.props.setUsername}
        />

        <MeshManager Api={this.props.Api} ref={this.meshModalRef} />

        {this.state.isAttributeVisible && (
          <Attributes
            Api={this.props.Api}
            model={this.props.model}
            setAttibuteNotVisible={this.setAttibuteNotVisible}
            addAttribute={this.addAttribute}
            attributes={this.state.attributes}
            ref={this.attributesRef}
          />
        )}

        <CommandLine
          Api={this.props.Api}
          model={this.props.model}
          canvasRef={this.canvasRef}
        />
      </>
    );
  }
}
