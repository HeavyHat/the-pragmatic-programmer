import React from "react";
// @material-ui/core components
import { Container, Typography, Grid, Paper, Chip } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { withRouter } from 'react-router'
import ReactMarkdown from 'react-markdown'
import parseLinkHeader from 'parse-link-header'

const styles = (theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  paper: {
    margin: theme.spacing(0.5)
  },
  chip: {
      margin: theme.spacing(0.5)
  },
    card: {
        marginTop: theme.spacing(5),
        marginBottom: theme.spacing(5)
    }
});

function ParagraphComponent(props) {
    return (
        <Typography variant="body1">{props.children}</Typography>
    );
}

function CodeComponent(props) {
    return (
        <Paper style={{margin:20, padding:20}} variant="outlined" elevation={2} >
            <pre className="prettyprint" style={{border: undefined, overflow: "auto"}}>
                <code className={props.language ? `language-${props.language}`: ""}>{props.value}</code>
            </pre>
        </Paper>
    );
}

class Post extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            issue_id: this.props.issue_id,
            title: this.props.title,
            body: this.props.body,
            labels: this.props.labels || [],
            created_at: this.props.created_at,
            loaded: this.props.title && this.props.body && this.props.created_at
        }
        this.getIssue = this.getIssue.bind(this);
    }

    componentDidMount() {
        if(!this.state.loaded) {
            let issue_id = this.props.match.params.id;
            this.setState({ issue_id: issue_id}, () => (
                this.getIssue()
            ))
        }
    }

    getIssue() {
        const headers = {
            headers: {
                Authorization: "token 60e07ff280c786e523a632be9af8f992270a5c5b",
                Accept: "application/vnd.github.v3+json,application/vnd.github.machine-man-preview+json",
            }
        };
        const baseUrl = "https://api.github.com/repos"
        let linkHeaders = ''
        let userRepoIssue = `Heavyhat/the-pragmatic-developer/issues/${this.state.issue_id}`
        let fullUrl = `${baseUrl}/${userRepoIssue}`
        console.log(fullUrl)
        fetch(fullUrl, headers)
            .then(response => {
                if (response.headers.get('Link')) {
                    linkHeaders = parseLinkHeader(response.headers.get('Link'))
                }
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Request failed.');
            })
            .then(data => {
                // set our state with the response
                this.setState({
                    title: data.title,
                    body: data.body,
                    labels: data.labels,
                    created_at: data.created_at,
                    loaded: true
                });
            })
            .catch(error => {
                this.setState({
                    loaded: true,
                    error: error
                });
            });
    }

    formatDate(date) {
        let d = new Date(date),
            month = "" + (d.getMonth() + 1),
            day = "" + (d.getDay()),
            year = "" + (d.getFullYear());
        return [day, month, year].join('/');
    }

    render() {
        const { classes } = this.props;
        const renderers = {
            paragraph: ParagraphComponent,
            code: CodeComponent
        }
        return (
            <Container style={{marginTop:120}}>
                    <Grid container spacing={2}>
                        <Grid item xs={9}>
                            <Typography variant="h4">{this.state.title}</Typography>
                        </Grid>
                        <Grid item xs={3}>
                            <Typography variant="subtitle1">{this.state.created_at}</Typography>
                        </Grid>
                        <Grid item xs={9}>
                        {
                            this.state.labels.map( (label, idx) => {
                                console.log(label.color)
                                return (<Chip key={idx} className={classes.chip} label={label.name} size="small" variant="outlined" style={{color:"#" + label.color, borderColor: "#" + label.color}} />);
                            })
                        }
                        </Grid>
                        <Grid item xs={12}>
                            <ReactMarkdown source={this.state.body} renderers={renderers}></ReactMarkdown>
                        </Grid>
                    </Grid>
                </Container>
        );
    }
}

export default withRouter(withStyles(styles)(Post));
