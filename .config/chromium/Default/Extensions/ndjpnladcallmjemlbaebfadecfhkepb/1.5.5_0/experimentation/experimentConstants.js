!function(){"use strict";angular.module("app.experimentation",[]).constant("experimentConstants",{DEFAULT_CLIENT_ID:"",ENABLED:{MSA:!0,O365:!1,BROWSERS:["Chrome","Edge"]},ENDPOINT:"http://officeonlineextension-office365.msedge.net/ab",ERROR:{BAD_USER_TYPE:"badUserType",NO_CLIENT_ID:"noClientId",NO_FEATURES:"noFeatures"},EXPERIMENTS:{SHARING:{ENABLED:{MSA:!0,O365:!1,BROWSERS:["Chrome"]},CONTROL:"sharingControl/sharingControl.html",FLIGHTS:{flighttestaacf:"sharingControl/sharingControl.html",flighttestaa:"sharingControl/sharingControl.html",SharingUXCF:"sharingControl/sharingControl.html",SharingUX:"sharingA/sharingA.html"}}}})}();