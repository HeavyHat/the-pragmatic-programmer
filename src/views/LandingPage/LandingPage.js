import React from "react";
// @material-ui/core components
import { Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import GithubIssues from "components/GithubIssues/GithubIssues";

// @material-ui/icons


const useStyles = makeStyles({
    root: {
        padding: "0px",
        width: "100%",
        height: "100%",
        flexGrox: "1"
    },
    jumbotron: {
      display: "block",
      width: "100%",
      height: "300px",
      zIndex: "-1",
      backgroundColor: "#222222"
    },
    main: {
      background: "#FFFFFF",
      position: "relative",
      zIndex: "3"
    },
    mainRaised: {
      margin: "-60px 30px 0px",
      borderRadius: "6px",
      boxShadow:
        "0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.2)"
    }
})



export default function LandingPage(props) {
  const classes = useStyles();
  return (
      <div className={classes.root}>
        <Container>
            <GithubIssues user="Heavyhat" repo="the-pragmatic-developer" />
        </Container>
      </div>
  );
}
