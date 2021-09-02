import React from 'react';
import View1 from "./Views/View1"
import View2 from "./Views/View2"

export default class App extends React.Component {

    state = {
        viewName: "view1"
    }
 
    onClick2 = ()=> {
        this.setState({
            viewName: "view2"
        })
    }

    onClick1 = ()=> {
        this.setState({
            viewName: "view1"
        })
    }

    renerView(){
       const {viewName} = this.state;
       switch (viewName){
           case "view1":
               return <View1 />
            default:
                return <View2 />
       }
    }

    render(){

        return (
            <div> 
                 <button type="button" onClick={this.onClick1}>展示View1</button>
                 <button type="button" onClick={this.onClick2}>展示View2</button>
                    <hr />
                 {this.renerView()}
            </div>
        )
    }
}