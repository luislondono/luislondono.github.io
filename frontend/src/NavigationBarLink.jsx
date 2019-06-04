import React, { Component } from 'react';
import './css/main.css'

// import fire from './fire';

class NavigationBarLink extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        // this.funct = this.funct.bind(this);
        // this.submitPost = this.submitPost.bind(this)
    }

    render() {
        var InnerText = this.props.InnerText
        var link = this.props.link
        var imgSource = this.props.imgSource
        console.log(imgSource)
        return (
            <div>


            {imgSource == null? 
            <li className="nav-link"><a href= {link} > {InnerText}</a></li>
            :
            <li className="social-media-link"><a href= {link}><img src= {require(`${imgSource}`)} alt={InnerText}></img></a></li>
            }
            </div>
        );
    }


}
export default NavigationBarLink;