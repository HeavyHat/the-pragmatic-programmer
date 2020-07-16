import React from 'react'
import { Drawer, Divider, ListItem, ListItemIcon, AppBar, Typography, Toolbar, IconButton, List, ListItemText } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from '@material-ui/icons/Menu'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2)
    },
    title: {
      flexGrow: 1
    },
    navHeader: {
        margin:"20px",
        width: "400px"
    },
    subtitle: {
        fontSize: "1.313rem",
        maxWidth: "500px",
        margin: "10px auto 0"
    }
}));

export default function NavigationComponent({ pages }) {
    const classes = useStyles();
    const [state, setState] = React.useState({
        left: false,
    });
    const toggleDrawer = (anchor, open) => (event) => {
        if(event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open});
    };

    const defaultHandler = () => {}; //No-Op

    return (
        <React.Fragment>
            <AppBar position={'sticky'}>
                <Toolbar>
                    <IconButton onClick={toggleDrawer('left', true)} edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        The Pragmatic Programmer
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer anchor='left' open={state['left']} onClose={toggleDrawer('left', false)}>
                <Typography className={classes.navHeader} variant="h6">The Pragmatic Developer</Typography>
                <Divider />
                <List>
                    {pages.map((page, idx) => (
                        <ListItem button key={page.name} onClick={page.clickHandler || defaultHandler}>
                            <ListItemIcon>
                              {page.icon || <ChevronRightIcon />}
                            </ListItemIcon>
                            <ListItemText primary={page.text || page.name} />
                        </ListItem>
                    ))};
                </List>
            </Drawer>
        </React.Fragment>
    );
}
