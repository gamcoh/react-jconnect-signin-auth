/** @flow */
import waitForVar from '../utils/waitForVar';

import type { JConnectAuthOptions, JConnectAuthResponse } from '../types';

const JCONNECT_SCRIPT_SRC: string =
  'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';

/**
 * Performs an apple ID signIn operation
 */
const signIn = ({
  authOptions,
  onSuccess,
  onError,
}: {
    authOptions: JConnectAuthOptions,
    onSuccess?: Function,
    onError?: Function,
  }): Promise<?JConnectAuthResponse> =>
  /** wait for apple script to load */
  waitForVar('AppleID')
    .then(() => {
      /** Handle if appleID script was not loaded -- log + throw error to be caught below */
      if (!window.AppleID) {
        console.error(new Error('Error loading apple script'));
      }
      /** Init apple auth */
      window.AppleID.auth.init(authOptions);
      /** Signin to appleID */
      return window.AppleID.auth
        .signIn()
        .then((response) => {
          /** This is only called in case usePopup is true */
          if (onSuccess) {
            onSuccess(response);
          }
          /** resolve with the reponse */
          return response;
        })
        .catch((err) => {
          if (onError) {
            /** Call onError catching the error */
            onError(err);
          } else {
            /** Log the error to help debug */
            console.error(err);
          }
          return null;
        });
    })
    .catch((err) => {
      console.log(err);
      if (onError) {
        /** Call onError catching the error */
        onError(err);
      } else {
        /** Log the error to help debug */
        console.error(err);
      }

      return null;
    });

export default {
  JCONNECT_SCRIPT_SRC,
  signIn,
};
