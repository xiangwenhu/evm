import React from 'react';


export default class View2 extends React.Component {


    refButton1 = React.createRef();

   onClick1View1 = function onClick1View2(){
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


    componentDidMount(){
        // this.refButton1.current.addEventListener('click', this.onClick1View2);

        // window.addEventListener("resize", function onResizeView2(){

        // });
    }

    render(){
        return (
            <div>
                <div>View 2</div>
                 {/* <button ref = {this.refButton1} type="button" onClick={this.onClick1View1}>Button1</button>

                 <button type="button" onClick={this.onClick2}>Button2</button>

                 <button type="button" onClick={this.onClick3}>Button3</button>

                <button type="button" onClick={this.onClick4}>Button4</button> */}
            </div>
        )
    }
}