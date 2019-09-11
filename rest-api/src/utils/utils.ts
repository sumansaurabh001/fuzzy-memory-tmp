import * as dayjs from 'dayjs';
import {Timestamp} from '@google-cloud/firestore';


export function readMandatoryEnvVar(envVarName:string):any {
  const envVarValue = process.env[envVarName];
  if (!envVarValue) {
    console.log(`Could not find environment variable ${envVarName}, had non truthy value >>${envVarValue}<< exiting ...`);
    process.exit();
  }
  return envVarValue;
}


export function getStripeSecretKey(testMode: boolean) {
  if (!testMode) {
    return readMandatoryEnvVar("STRIPE_LIVE_SECRET_KEY");
  }
  else {
    return readMandatoryEnvVar("STRIPE_TEST_SECRET_KEY");
  }

}


export function getStripePublicKey(testMode:boolean) {
  if (testMode) {
    return readMandatoryEnvVar("STRIPE_TEST_PUBLIC_KEY");
  }
  else {
    return readMandatoryEnvVar("STRIPE_LIVE_PUBLIC_KEY");
  }
}


export function convertSnapsToData(snaps) {

  const data = [];

  snaps.forEach(snap => {
    data.push({...snap.data(), id: snap.id})
  });

  return data;

}

export function isFutureTimestamp(timestamp: Timestamp) {
  return dayjs(timestamp.toMillis()).isAfter(dayjs());
}


export function apiError(res, errorDescription) {
  console.log(errorDescription);
  res.status(500).json({errorDescription});
}
