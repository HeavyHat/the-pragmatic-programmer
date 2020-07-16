import React from 'react'
import ReactMarkdown from 'react-markdown'
import { withStyles } from '@material-ui/core/styles'
import { Card, CardContent, Typography, Divider, Button, Grid, Chip } from '@material-ui/core'

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

class GithubIssue extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            issue_id: this.props.issue.number,
            title: this.props.issue.title,
            body: this.props.issue.body,
            labels: this.props.issue.labels,
            created_at: this.props.issue.created_at,
            onClick: this.props.onClick
        };
    }

    componentDidMount() {
    }

    shouldComponentUpdate(previousState, nextState) {
        return previousState.title !== nextState.title;
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
            paragraph: ParagraphComponent
        }
        let bodyArray = this.state.body.split("\n").filter(x => x.trim().length !== 0);
        return (
            <Card variant="outlined" className={classes.card}>
                <CardContent className={classes.root}>
                    <Grid container spacing={1}>
                        <Grid item xs={9}>
                        {
                            this.state.labels.map( (label, idx) => {
                                console.log(label.color)
                                return (<Chip key={idx} className={classes.chip} label={label.name} size="small" variant="outlined" style={{color:"#" + label.color, borderColor: "#" + label.color}} />);
                            })
                        }
                        </Grid>
                        <Grid item xs={2}>
                            <Typography variant="subtitle1" displaye="block" align="right">{this.formatDate(this.state.created_at)}</Typography>
                        </Grid>
                    </Grid>
                    <Typography variant="h4" display="block">{this.state.title}</Typography>
                    <ReactMarkdown source={bodyArray[0] || ""} renderers={renderers}/>
                    <Divider />
                    <Button variant="contained" color="primary" onClick={this.state.onClick}>View</Button>
                </CardContent>
            </Card>
            );
    }
}

export default withStyles(styles)(GithubIssue);
