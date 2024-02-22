/** @flow */
import type { JConnectAuthOptions, JConnectAuthResponse } from '../types';

export default function signIn({
  authOptions,
  onSuccess,
  onError,
}: {
    authOptions: JConnectAuthOptions,
    onSuccess?: Function,
    onError?: Function,
  }): Promise<?JConnectAuthResponse>
{
  console.log("trying to sign in");
  // /** Init apple auth */
  // window.AppleID.auth.init(authOptions);
  // /** Signin to appleID */
  // return window.AppleID.auth
  //   .signIn()
  //   .then((response) => {
  //     /** This is only called in case usePopup is true */
  //     if (onSuccess) {
  //       onSuccess(response);
  //     }
  //     /** resolve with the reponse */
  //     return response;
  //   })
  //   .catch((err) => {
  //     if (onError) {
  //       /** Call onError catching the error */
  //       onError(err);
  //     } else {
  //       /** Log the error to help debug */
  //       console.error(err);
  //     }
  //     return null;
  //   });
};
