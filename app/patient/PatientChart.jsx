import React from "react";
import Dashboard from "./Dashboard";
import PatientDemographics from "./PatientDemographics";

import { PageCanvas } from 'fhir-starter';
import { CardHeader, CardContent } from '@material-ui/core';
import { useLocation, useParams, useHistory } from "react-router-dom";

import { oauth2 as SMART } from "fhirclient";
import { get } from 'lodash';


export default function PatientChart() {
    let headerHeight = 64;
    if(get(Meteor, 'settings.public.defaults.prominantHeader')){
      headerHeight = 128;
    }


    let fhirServerEndpoint = 'http://localhost:3100/baseR4';
    if(Array.isArray(get(Meteor, 'settings.public.smartOnFhir'))){
      Meteor.settings.public.smartOnFhir.forEach(function(config){
          if(useLocation().search.includes(config.vendorKeyword) && (config.launchContext === "Provider")){
              fhirServerEndpoint = get(config, 'fhirServiceUrl') + get(window, '__PRELOADED_STATE__.url.query.code') + "/fhir/metadata"
          }
      })
    }    


    let searchParams = new URLSearchParams(useLocation().search);
    if(searchParams.get('iss')){
      console.log('PatientChart.iss', searchParams.get('iss'))
      fhirServerEndpoint = searchParams.get('iss')
    }

    let contentToRender = <PageCanvas id='patientChart' headerHeight={headerHeight} >
      <PatientDemographics />
      <Dashboard fhirServerEndpoint={fhirServerEndpoint} />
    </PageCanvas>    
    return (contentToRender);
}
