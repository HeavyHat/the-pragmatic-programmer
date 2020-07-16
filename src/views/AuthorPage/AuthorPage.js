import React from "react";
// nodejs library that concatenates classes
// @material-ui/core components
import { Container, Typography, Card, CardContent, Divider, Grid } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

// @material-ui/icons
let styles = makeStyles(theme => (
    {
        root: {
            margin: theme.spacing(3)
        }
    }
))



export default function AuthorPage(props) {
  const classes = styles();
  return (
        <Container className={classes.root}>
            <Card>
                <CardContent>
                    <Typography variant="h4">The Author</Typography>
                    <Divider />
                    <Grid container spacing={4}>
                        <Grid item xs={8}>
                            <Typography variant="body1">Hi! My name is Josh.

                                Thanks for having a look around and let me know if theres anything in partiocular you would like to see in the future.

                            I have been working in the software development industry for {new Date().getFullYear() - 2015} years, working primarily in the financial services sector. This sector typically comes with a poor reputation and its own unique challenges which I love to see and solve. Having worked at a number of different firms I have observed a number of styfling issues which keep repeating themselves across the world. So I thought I would write about it! I'm not aiming to change much or to educate anyone but I hope to understand these issues in a more granular detail by articulating their intricacies into a blog like format.

                                I don't identify as part of a particular sect of software development as In think these boundaries are detrimental to the profession as a whole. So throughout my brief career I have immessered myself in a number of langueges, techniques and sub fields which I hope I can draw from in the future.
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Container>
  );
}
