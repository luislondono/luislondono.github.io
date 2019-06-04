import React, { Component } from 'react';


class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        // this.funct = this.funct.bind(this);
        // this.submitPost = this.submitPost.bind(this)
    }

    render() {
        return (
            <div className= "page-content">
                <h1>About Me</h1>
                <div id="landing-page-container">
                    <div className="portrait-container">

                        <div className="circular-portrait">
                            <img src= {require("../images/hyperloopHeadshot.JPG")} alt="me"></img>
                        </div>
                    </div>

                    <div className="aboutme-container">
                        <h3> Welcome to my website!</h3>
                            <hr></hr>
                            <p> My name is Luis and I'm a sophomore computer science student at Cornell
					University with minors in Operations Research and Business. </p>

                            <p> Aside from coursework I am also active on campus in a variety of facets:</p>

                            <ul>
                                <li> I am secretary of the Society of Hispanic Professional Engineers (SHPE)</li>
                                <li>I participate in Intramural Volleyball and biking club</li>
                                <li> I am a web developer for Cornell Hyperloop</li>
                            </ul>

                            <p>I am interested in mobile & frontend app development and data analytics and I am
					currently looking for summer internships to explore these interests.</p>

                            <hr></hr>
                                <h4>Feel free to contact me for inquiries!</h4>
                                <p>lhl49@cornell.edu</p>
                            <hr></hr>
			        </div>
		        </div>
            </div>
        )
    }

}
export default Home;