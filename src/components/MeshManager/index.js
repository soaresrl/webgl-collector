import React, { Component } from "react";
import { Modal, Select, Tooltip } from "antd";
import { MESH } from '../../Constants/Constants'
import './styles.css'

export default class MeshManager extends Component {

    constructor(props){
        super(props);

        this.state = {
            isModalVisible: false,
            selectedMesh: {
                meshTypes: null,
                shapeTypes: null,
                elemTypes: null,
                diagTypes: null
            }
        }
    }

    handleSelectChange(value, item){
        const obj = MESH[item].find((obj) => obj.name == value);

        let newState = { ...this.state };
        
        newState.selectedMesh[item] = { ...obj };
        
        this.setState({ ...newState });
    }

    handleOk(){
        this.props.Api.generateMesh(this.state.selectedMesh);

        this.setState({
            ...this.state,
            isModalVisible: false,
            selectedMesh: {
                meshTypes: null,
                shapeTypes: null,
                elemTypes: null,
                diagTypes: null
            }
        });
    }

    handleCancel(){
        this.setState({
            ...this.state,
            isModalVisible: false,
            selectedMesh: {
                meshTypes: null,
                shapeTypes: null,
                elemTypes: null,
                diagTypes: null
            }
        })
    }

    render() {
        return(
            <Modal title='Mesh manager' visible={this.state.isModalVisible} onOk={this.handleOk.bind(this)} onCancel={this.handleCancel.bind(this)}>
                <div className='mesh-content'>
                    <div className='mesh-container'>
                        <span className='mesh-container-item'>Mesh type</span>
                        <Select className='mesh-container-item' style={{ width: 200 }} placeholder='Select mesh type...' value={this.state.selectedMesh.meshTypes?.name} onChange={(value)=>{this.handleSelectChange(value, 'meshTypes')}}>
                            {MESH.meshTypes.map(({ name }, index)=>(
                                <Select.Option value={name} key={`${index}-mesh-type`}> <Tooltip title={name}>{name}</Tooltip> </Select.Option>
                            ))}
                        </Select>
                    </div>
                    <div className='mesh-container'>
                        <span className='mesh-container-item'>Shape type</span>
                        <Select className='mesh-container-item' style={{ width: 200 }} placeholder='Select shape type...' value={this.state.selectedMesh.shapeTypes?.name} onChange={(value)=>{this.handleSelectChange(value, 'shapeTypes')}}>
                            {MESH.shapeTypes.map(({ name }, index)=>(
                                <Select.Option value={name} key={`${index}-mesh-type`}> {name} </Select.Option>
                            ))}
                        </Select>
                    </div>
                    <div className='mesh-container'>
                        <span className='mesh-container-item'>Element type</span>
                        <Select className='mesh-container-item' style={{ width: 200 }} placeholder='Select element type...' value={this.state.selectedMesh.elemTypes?.name} onChange={(value)=>{this.handleSelectChange(value, 'elemTypes')}}>
                            {MESH.elemTypes.map(({ name }, index)=>(
                                <Select.Option value={name} key={`${index}-mesh-type`}> {name} </Select.Option>
                            ))}
                        </Select>
                    </div>
                    <div className='mesh-container'>
                        <span className='mesh-container-item'>Diagonal type</span>
                        <Select className='mesh-container-item' 
                                style={{ width: 200 }} 
                                placeholder='Select diagonal type...' 
                                disabled={this.state.selectedMesh.shapeTypes?.name != 'Triangular'}
                                value={this.state.selectedMesh.diagTypes?.name}
                                onChange={(value)=>{this.handleSelectChange(value, 'diagTypes')}}>
                            {MESH.diagTypes.map(({ name }, index)=>(
                                <Select.Option value={name} key={`${index}-mesh-type`}> {name} </Select.Option>
                            ))}
                        </Select>
                    </div>
                </div>
            </Modal>
        )}
}