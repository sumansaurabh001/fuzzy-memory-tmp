import {ONLINECOURSEHOST_ACCENT_COLOR, ONLINECOURSEHOST_PRIMARY_COLOR} from './ui-constants';


export const ONLINECOURSEHOST_THEME = {
  primaryColor: ONLINECOURSEHOST_PRIMARY_COLOR,
  accentColor: ONLINECOURSEHOST_ACCENT_COLOR
};



export function checkIfPlatformSite() {

  const hostName = document.location.hostname;

  return hostName.includes('app.onlinecoursehost');

}

export function checkIfSingleSignOnPage() {

  const hostName = document.location.hostname;

  return hostName.includes('login.onlinecoursehost');

}




export function getPlatformSubdomain() {

  const hostName = document.location.hostname;

  // checking if this a tenant subdomain
  const subDomainRegex = /^(.*).onlinecoursehost/;

  const matches = hostName.match(subDomainRegex);

  return matches.length == 2 ? matches[1] : undefined;

}

