


export function checkIfPlatformSite() {

  const hostName = document.location.hostname;

  return hostName.includes('app.onlinecoursehost');

}




export function getPlatformSubdomain() {

  const hostName = document.location.hostname;

  // checking if this a tenant subdomain
  const subDomainRegex = /^(.*).onlinecoursehost/;

  const matches = hostName.match(subDomainRegex);

  return matches.length == 2 ? matches[1] : undefined;

}

