import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";
import { useHistory } from 'react-router-dom'
import NavigationComponent from 'components/NavigationComponent/NavigationComponent.js'

import LandingPage from "./views/LandingPage/LandingPage.js";
import AboutPage from "./views/AboutPage/AboutPage.js";
import AuthorPage from "./views/AuthorPage/AuthorPage.js";
import ContactPage from "./views/ContactPage/ContactPage.js";

var hist = createBrowserHistory();

const goToWeekly = () => {
  hist.push("/the-pragmatic-programmer")
};
const goToAbout = () => {
  hist.push("/the-pragmatic-programmer/about");
};
const goToAuthor = () => {
  console.log("goind to author")
  hist.push("/the-pragmatic-programmer/author");
};
const goToContact = () => {
  hist.push("/the-pragmatic-programmer/contact");
};
const pagesConfig= [
    { name: "Weekly", clickHandler: goToWeekly },
    { name: "About", clickHandler: goToAbout },
    { name: "The Author", clickHandler: goToAuthor },
    { name: "Contact", clickHandler: goToContact}
];

ReactDOM.render(
  <React.Fragment>
    <NavigationComponent pages={pagesConfig} />
    <Router history={hist}>
      <Switch>
        <Route exact path="/the-pragmatic-programmer" component={LandingPage} />
        <Route path="/the-pragmatic-programmer/post/:id" component={LandingPage} />
        <Route path="/the-pragmatic-programmer/author" component={AuthorPage} />
      </Switch>
    </Router>
  </React.Fragment>,
  document.getElementById('root')
);
