import React from 'react';


export default class View1 extends React.Component {


    refButton1 = React.createRef();

   onClick1View1 = function onClick1View1(){
    console.log('onClick1View1')
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

    onResizeView1 = function onResizeView1(){
        
    }


    componentDidMount(){
        this.refButton1.current.addEventListener('click', this.onClick1View1);
        window.addEventListener("resize", this.onResizeView1);
    }

    componentWillUnmount(){
        console.log("View1 componentWillUnmount")
        // window.removeEventListener("resize", this.onResizeView1);
    }

    render(){
        return (
            <div>
                 <div>View 1</div>
                 <button id="btn1" ref = {this.refButton1} type="button" onClick={this.onClick1View1}>Button1</button>

                 <button id="btn2" type="button" onClick={this.onClick2}>Button2</button>

                 <button type="button" onClick={this.onClick3}>Button3</button>

                <button type="button" onClick={this.onClick4}>Button4</button>
            </div>
        )
    }
}