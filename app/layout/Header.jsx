import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { get } from 'lodash';
import moment from 'moment';



const drawerWidth =  get(Meteor, 'settings.public.defaults.drawerWidth', 280);

// not being used?
const styles = theme => ({});

function Header(props) {
  
  if(props.logger){
    props.logger.info('Rendering the application Header.');
    props.logger.verbose('package.care-cards.client.layout.Header');  
    props.logger.data('Header.props', {data: props}, {source: "HeaderContainer.jsx"});
  }

  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  function clickOnMenuButton(){
    console.log('clickOnMenuButton');

    props.handleDrawerOpen.call(this);
  };

  function goHome(){
    props.history.replace('/');
  };
  

  let componentStyles = {
    headerContainer: {  
      height: '64px',
      position: 'fixed',
      top: 0,
      left: 0,
      background: props.theme.palette.appBar.main,
      backgroundColor: props.theme.palette.appBar.main,
      color: props.theme.palette.appBar.contrastText,
      width: '100%',
      zIndex: 1000000,
      transition: props.theme.transitions.create(['width', 'left'], {
        easing: props.theme.transitions.easing.sharp,
        duration: props.theme.transitions.duration.leavingScreen
      })
    },
    title: {
      flexGrow: 1,
      background: props.theme.palette.appBar.main,
      backgroundColor: props.theme.palette.appBar.main,
      color: props.theme.palette.appBar.contrastText
    },
    header_label: {
      paddingTop: '10px',
      fontWeight: 'bold',
      fontSize: '1 rem',
      float: 'left',
      paddingRight: '10px'
    },
    header_text: {
      paddingTop: '10px',
      fontSize: '1 rem',
      float: 'left'
    }
  }

  if(Meteor.isClient && props.drawerIsOpen){
    componentStyles.headerContainer.width = window.innerWidth - drawerWidth;
    componentStyles.headerContainer.left = drawerWidth;
  }

  let extendedHeaderItems;
  if(get(Meteor, 'settings.public.defaults.prominantHeader', false)){
    componentStyles.headerContainer.height = '128px';

    if(typeof props.headerNavigation === "function"){
      extendedHeaderItems = props.headerNavigation(props);
    }
  }

  function parseTitle(){
    let titleText = get(Meteor, 'settings.public.title', 'Node on FHIR');
    let selectedPatient;

    if(Meteor.isClient){
      if(Session.get("selectedPatient")){
        selectedPatient = Session.get("selectedPatient");

        titleText = get(selectedPatient, 'name[0].given[0]') + ' ' + get(selectedPatient, 'name[0].family[0]');            
        logger.verbose("Selected patients name that we're displaying in the Title: " + titleText)
      }  
    }

    return titleText;    
  }

  function parseId(){
    let patient = Session.get('selectedPatient');
    return get(patient, 'id', '');
  }

  function getSearchDateRange(){
    let fhirKitClientStartDate = Session.get('fhirKitClientStartDate');
    let fhirKitClientEndDate = Session.get('fhirKitClientEndDate');
    return moment(fhirKitClientStartDate).format("MMM DD, YYYY") + " until " + moment(fhirKitClientEndDate).format("MMM DD, YYYY")
  }


  let demographicItems;
  let dateTimeItems;

  if(Meteor.isClient){
    // if we have a selected patient, we show that info
    if(Session.get('selectedPatient')){
      demographicItems = <div style={{float: 'right', top: '10px', position: 'absolute', right: '20px'}}>
        <Typography variant="h6" color="inherit" style={ componentStyles.header_label }>Patient ID: </Typography>
        <Typography variant="h6" color="inherit" style={ componentStyles.header_text } noWrap >
          { parseId() }
        </Typography>
      </div>   
    } else {
      // otherwise, we default to population/search level info to display
      if(Session.get('fhirKitClientStartDate') && Session.get('fhirKitClientEndDate')){
        dateTimeItems = <div style={{float: 'right', top: '10px', position: 'absolute', right: '20px'}}>
          <Typography variant="h6" color="inherit" style={ componentStyles.header_label }>Timespan: </Typography>
          <Typography variant="h6" color="inherit" style={ componentStyles.header_text } noWrap >
            { getSearchDateRange() }
          </Typography>
        </div>   
      }    
    }
  }

  return (
    <AppBar id="header" position="fixed" style={componentStyles.headerContainer}>
      <Toolbar disableGutters={!drawerIsOpen} >
        <IconButton
          color="inherit"
          aria-label="Open drawer"
          onClick={ clickOnMenuButton }
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" color="inherit" onClick={ function(){ goHome(); }} style={  componentStyles.title }>
          { parseTitle() }
        </Typography>

        { dateTimeItems }
        { demographicItems }
        { extendedHeaderItems }

      </Toolbar>
    </AppBar>
  );
}



Header.propTypes = {
  logger: PropTypes.object,
  drawerIsOpen: PropTypes.bool,
  handleDrawerOpen: PropTypes.func,
  headerNavigation: PropTypes.func
}
Header.defaultProps = {
  logger: {
    debug: function(){},
    info: function(){},
    warn: function(){},
    trace: function(){},
    data: function(){},
    verbose: function(){},
    error: function(){}
  }
}

// export default Header;
export default withStyles(styles, { withTheme: true })(Header);