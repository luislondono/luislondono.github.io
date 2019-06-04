import React, { Component } from 'react';

class PageNotFound extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        // this.funct = this.funct.bind(this);
        // this.submitPost = this.submitPost.bind(this)
    }

    render() {
        return (
            <div>
                Error 404: Page Not Found
            </div>
        )
    }
}
export default PageNotFound;