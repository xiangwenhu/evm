import React from 'react';


export default class App extends React.Component {


    refButton1 = React.createRef();

   onClick1 = ()=> {
        console.log('onClick1')
    }

   onClick2 = ()=> {
    console.log('onClick2')
    }


    onClick3 = ()=> {
        console.log('onClick3')
    }

   onClick4 = ()=> {
    console.log('onClick4')
    }


    componentDidMount(){
        this.refButton1.current.addEventListener('click', this.onClick1);

        window.addEventListener("resize", ()=> {});
    }

    render(){
        return (
            <div>
                 <button ref = {this.refButton1} type="button" onClick={this.onClick1}>Button1</button>

                 <button type="button" onClick={this.onClick2}>Button2</button>

                 <button type="button" onClick={this.onClick3}>Button3</button>

                <button type="button" onClick={this.onClick4}>Button4</button>
            </div>
        )
    }
}