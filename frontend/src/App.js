import React from 'react';
import NavigationBar from './NavigationBar';

import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./pages/Home"
import Resume from "./pages/Resume"
import Work from "./pages/Work"
import Gallery from "./pages/Gallery"
import PageNotFound from "./pages/PageNotFound"

import './css/main.css'

function App() {
  return (
    <BrowserRouter>
      <NavigationBar></NavigationBar>
        <Switch>
          <Route path = "/" component = {Home} exact />
          <Route path = "/resume" component = {Resume} />
          <Route path = "/work" component = {Work} />
          <Route path = "/gallery" component = {Gallery} />
          <Route component = {PageNotFound} />
        </Switch>
    </BrowserRouter>
  );
}

export default App;
