import React, { Component } from 'react';
import Api from './api/Api';
import model from './model/model';
import Home from './pages/Home';

class App extends Component {

    constructor(props){
        super(props)

        this.model = new model();
    }

    componentDidMount(){
        //this.Api = new Api();
        //this.Api.connect("https://curve-colector-api.herokuapp.com/");
        //this.Api.listen(this.model);
    }

    render() {
        return(
        <Home /*Api={this.Api}*/ model={this.model}/>
        );
    }
}

export default App