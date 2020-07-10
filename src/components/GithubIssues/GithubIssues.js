import React from 'react';
import parseLinkHeader from 'parse-link-header'
import GithubIssue from 'components/GithubIssue/GithubIssue'
import { Pagination, Skeleton } from '@material-ui/lab'
import { withStyles } from '@material-ui/core/styles'
import { Card, CardContent, Grid, Typography, Divider, Button } from '@material-ui/core'


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
        };

        // fix the this value
        this.getIssues = this.getIssues.bind(this);
        this.handleRepoChange = this.handleRepoChange.bind(this);
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

        // Build the URL from props/state(for the page) - [note: when state.page changes, we update]
        let userRepoIssues = `${this.state.user}/${this.state.repo}/issues`

        let fullUrl = `${baseUrl}/${userRepoIssues}?${params}`
        console.log(fullUrl)
        fetch(fullUrl, headers)
            .then(response => {
                // If we have Link headers, parse them in to an object to store via appHelpers.parseLinkHeaders
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
                    pages: linkHeaders,
                    issues: data,
                    number: this.state.number || data[0].number,
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
                                    <Typography variant="body1" display="block"><Skeleton animation="wave" width={84}/></Typography>
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

    // Handles interaction with the repository switcher in the header element
    handleRepoChange(user, repo) {
        /*this.setState(changeRepo(user, repo), () => {
            this.getIssues()
        })*/
    }

    // Renders the panel blocks that contain the issue information
    renderIssues() {
        if (this.state.error) {
            return this.renderError();
        }
        console.log(this.state.issues)

        return (
            < React.Fragment >
                {
                    this.state.issues.map(function (data, index) {
                        return (<GithubIssue key={index} issue={data}></GithubIssue>)
                    })
                }

            </ React.Fragment>
        );
    }

    render() {
        return (
            <React.Fragment>
                {this.state.loading ?
                this.renderLoading()
                : this.renderIssues()}
                <Pagination style={{
                    margin: 'auto',
                    flexGrow: 1,
                    maxWidth: 500
                }}  count={Math.ceil(this.state.number / this.state.per_page)} page={this.state.page} onChange={this.handlePageChange} showFirstButton showLastButton />

            </React.Fragment>
        );
    }
}
export default withStyles(styles)(GithubIssues);
