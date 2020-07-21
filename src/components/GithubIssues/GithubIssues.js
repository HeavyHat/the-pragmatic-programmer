import React from 'react';
import parseLinkHeader from 'parse-link-header'
import GithubIssue from 'components/GithubIssue/GithubIssue'
import Post from 'components/Post/Post'
import { Pagination, Skeleton } from '@material-ui/lab'
import { withStyles } from '@material-ui/core/styles'
import { Card, CardContent, Grid, Typography, Divider } from '@material-ui/core'
import { withRouter } from 'react-router-dom'


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


const encodeParameters = (obj) => {
    return Object.entries(obj).map(kv => kv.map(encodeURIComponent).join('=')).join('&')
}

const getRand = (min, max) => {
    let range = max - min;
    range = Math.floor(Math.random() * range);
    return min + range;
}


/**
 *
 *
 * @class GithubIssues
 * @extends {React.Component}
 */
class GithubIssues extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: this.props.history,
            user: this.props.user,
            repo: this.props.repo,
            listFilter: { state: "open", choice: "issues" },
            since: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            per_page: this.props.per_page || 2,
            number: 0,
            sort: "created",
            page: 1,
            pages: {},
            issues: [],
            loading: true,
            error: null,
            showBody: {},
            loadedPost: this.props.match.params.id ? { issue_id: this.props.match.params.id } : null
        };

        // fix the this value
        this.getIssues = this.getIssues.bind(this);
        this.loadPost = this.loadPost.bind(this);
        this.renderPost = this.renderPost.bind(this);
        this.renderIssues = this.renderIssues.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        //this.handleFilterChange = this.handleFilterChange.bind(this);

    }

    componentDidMount() {
         // Get the issues and populate the panel
        this.getIssues();
    }


    shouldComponentUpdate(previousState, nextState) {
        if (previousState.page !== nextState.page) {
            return true;
        }
        if (previousState.listFilter !== nextState.listFilter) {
            return true;
        }
        if (previousState.loadedPost !== nextState.loadedPost) {
            return true;
        }
        return false;
    }

    /**
     * Fetch issues for repository
     */
    getIssues() {

        // Use auth token with Github API in order to have a higher rate limit for this example - not recommended for client-side use in production
        const headers = {
            headers: {
                Authorization: "token 60e07ff280c786e523a632be9af8f992270a5c5b",
                Accept: "application/vnd.github.v3+json,application/vnd.github.machine-man-preview+json",
            }
        };

        const baseUrl = "https://api.github.com/repos"

        // 7 days ago from today in ISO - to be used for GH API parameter
        // included as a state variable because I will add a datepicker in the future for custom time frame

        // GET parameters to send to GH Issues API
        // `this.state.listFilter.state` - this is ~confusing because GH refers to
        // 'open, closed' as 'state' of an issue/PR
        // I am calling open/close/all 'state' and issue/pr/all 'choice'
        const params = encodeParameters({ state: this.state.listFilter.state, per_page: this.state.per_page, page: this.state.page, sort: "created" })

        // Need an empty string to store Link headers from GET response since we need to reference it within promise chain - used for pagination
        let linkHeaders = ''

        let userRepo = `${baseUrl}/${this.state.user}/${this.state.repo}`
        // Build the URL from props/state(for the page) - [note: when state.page changes, we update]
        let userRepoIssues = `${this.state.user}/${this.state.repo}/issues`
        fetch(userRepo, headers)
            .then(response => {
                if (response.ok) {
                    console.log(response)
                    return response.json();
                }
                throw new Error('Request failed.');
            })
            .then(data => {
                console.log(data)
                this.setState({
                    number: data.open_issues_count
                })
            })

        let fullUrl = `${baseUrl}/${userRepoIssues}?${params}`
        fetch(`https://api.github.com/rate_limit`, headers)
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
            })
            .then(data => {
                console.log(data)
            })
        fetch(fullUrl, headers)
            .then(response => {
                // If we have Link headers, parse them in to an object to store via appHelpers.parseLinkHeaders
                if (response.headers.get('Link')) {
                    linkHeaders = parseLinkHeader(response.headers.get('Link'))
                }
                if (response.ok) {
                    console.log(response)
                    return response.json();
                }
                throw new Error('Request failed.');
            })
            .then(data => {
                console.log(data);
                // set our state with the response
                this.setState({
                    pages: linkHeaders,
                    issues: data,
                    loading: false,
                    error: null,
                    showBody: {},
                });
            })
            .catch(error => {
                this.setState({
                    loading: false,
                    error: error
                });
            });
    }

    // Render a loading bar during HTTP Request
    renderLoading() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                {
                    [...Array(this.state.per_page).keys()].map((x) => {
                        return (
                            <Card key={x} variant="outlined" className={classes.card}>
                                <CardContent className={classes.root}>
                                    <Grid container spacing={1}>
                                        <Grid item xs={9}>

                                        </Grid>
                                        <Grid item xs={2}>
                                            <Typography variant="subtitle1" displaye="block" align="right"><Skeleton animation="wave"/></Typography>
                                        </Grid>
                                    </Grid>
                                    <Typography variant="h4" display="block"><Skeleton animation="wave" width={240} /></Typography>
                                    <Typography variant="body1" display="block"><Skeleton animation="wave" /></Typography>
                                    <Typography variant="body1" display="block"><Skeleton animation="wave" /></Typography>
                                    <Typography variant="body1" display="block"><Skeleton animation="wave" width={getRand(64,400)}/></Typography>
                                    <Divider />
                                    <Skeleton animation="wave" width={64} height={44}/>
                                </CardContent>
                            </Card>
                        );
                    })
                }
            </React.Fragment>
        );
    }

    // Render an error message
    renderError() {
        return (
            <div>
                Uh oh: {this.state.error.message}
            </div>
        );
    }


     // expects a URL parameter like the end of pagination url - i.e '&page=2'
    handlePageChange(event, value) {
        this.setState({page: value, loading: true}, () => {
            this.getIssues()
        })
    }

    renderPost() {
        if(this.props.location.pathname.includes('post'))
            return (<Post issue_id={this.state.loadedPost.issue_id} title={this.state.loadedPost.title} body={this.state.loadedPost.body} labels={this.state.loadedPost.labels} created_at={this.state.loadedPost.created_at}/>)
        else if(this.state.loadedPost)
            this.setState({loadedPost: null})
        console.log("Rendering post")
        return (<React.Fragment/>);
    }

    loadPost(issue) {
        this.props.history.push(`/the-pragmatic-programmer/post/${issue.number}`)
        this.setState({
            loadedPost: issue
        })
    }

    // Renders the panel blocks that contain the issue information
    renderIssues() {
        if (this.state.error) {
            return this.renderError();
        }

        return (
            < React.Fragment >
                {
                    this.state.issues.map( (data, index) => {
                        return (<GithubIssue key={index} issue={data} onClick={() => this.loadPost(data)}></GithubIssue>)
                    })
                }
                <Grid container justify="center" alignItems="center" spacing={2}>
                    <Grid item xs={12} md={6}>
                        <Pagination style={{
                            margin: 'auto'
                        }}  count={Math.ceil(this.state.number / this.state.per_page)} page={this.state.page} onChange={this.handlePageChange} showFirstButton showLastButton />
                    </Grid>
                </Grid>
            </ React.Fragment>
        );
    }

    render() {
            return (
                <React.Fragment>
                    {
                        this.state.loading ?
                    this.renderLoading()
                    :  this.state.loadedPost ? this.renderPost() : this.renderIssues()}
                </React.Fragment>
            );
    }
}
export default withRouter(withStyles(styles)(GithubIssues));
