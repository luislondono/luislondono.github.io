import React, { Component } from 'react';
import NavigationBarLink from './NavigationBarLink'
import './css/main.css'
// import './images'

// import fire from './fire';

class NavigationBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sublinks : [
                // ["Home", "https://luislondono.com/", null],
                // ["Resume", "https://docs.google.com/document/d/1av1XlOl_ZTY2W7YGD1Kn3YUUMBhXLhLa5DjAMa0V2_I/edit?usp=sharing", null],
                // ["My Work", "https://luislondono.com/work", null],
                // ["Gallery", "https://luislondono.com/gallery",null],
                // ["Github", "https://www.github.com/LuisLondono", "./images/githubLogo.svg"],
                // ["Facebook", "https://www.facebook.com/luislondonoramos", "./images/facebookLogo.svg"],
                // ["LinkedIn","https://www.linkedin.com/in/luislondonoramos","./images/linkedinLogo.svg"]
                ["Home", "/", null],
                ["Resume", "/resume", null],
                ["My Work", "/work", null],
                ["Gallery", "/gallery",null],
                ["Github", "https://www.github.com/LuisLondono", "./images/githubLogo.svg"],
                ["Facebook", "https://www.facebook.com/luislondonoramos", "./images/facebookLogo.svg"],
                ["LinkedIn","https://www.linkedin.com/in/luislondonoramos","./images/linkedinLogo.svg"]
            ]
        };
    }

    render() {


        return (
            <div className = 'navbar-container'>
                <div className="navbar-logo">
                    <a href="https://luislondono.com/">Luis Hernando Londono</a>
                </div>
                


                <nav>
				    <ul>
                        {this.state.sublinks.map(sublinkData => <NavigationBarLink
                            InnerText = {sublinkData[0]}
                            link ={sublinkData[1]}
                            imgSource = {sublinkData[2]}
                        ></NavigationBarLink>)}
				    </ul>
			    </nav>
            </div>
        );
    }


}
export default NavigationBar;