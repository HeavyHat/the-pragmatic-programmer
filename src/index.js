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
  hist.push("/")
};
const goToAbout = () => {
  hist.push("/about");
};
const goToAuthor = () => {
  console.log("goind to author")
  hist.push("/author");
};
const goToContact = () => {
  hist.push("/contact");
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
        <Route exact path="/" component={LandingPage} />
        <Route path="/post/:id" component={LandingPage} />
        <Route path="/author" component={AuthorPage} />
        <Route path="/about" component={AboutPage} />
        <Route path="/contact" component={ContactPage} />
      </Switch>
    </Router>
  </React.Fragment>,
  document.getElementById('root')
);
