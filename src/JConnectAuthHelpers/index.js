/** @flow */
import type { JConnectAuthOptions, JConnectAuthResponse } from '../types';
import { signIn as JConnectSignIn } from './jconnectid.auth';

export default function signIn({
  authOptions,
  onSuccess,
  onError,
}: {
  authOptions: JConnectAuthOptions,
  onSuccess?: Function,
  onError?: Function,
}): Promise<?JConnectAuthResponse> {
  JConnectSignIn({
    authOptions,
    usePopup: true,
    onSuccess,
    onError,
  });
}
