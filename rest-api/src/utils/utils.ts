


export function getStripeKey(livemode: boolean) {
  if (livemode) {
    return readMandatoryEnvVar("STRIPE_LIVE_SECRET_KEY");
  }
  else {
    return readMandatoryEnvVar("STRIPE_TEST_SECRET_KEY");
  }


}


export function readMandatoryEnvVar(envVarName:string) {
  const envVarValue = process.env[envVarName];
  if (!envVarValue) {
    console.log(`Could not find environment variable ${envVarName}, had non truthy value >>${envVarValue}<< exiting ...`);
    process.exit();
  }
  return envVarValue;
}


