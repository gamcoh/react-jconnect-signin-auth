import { ReactNode } from 'react';

declare module 'react-jconnect-signin-auth' {
  export type JConnectAuthOptions = {
    /** Client ID - eg: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' */
    clientId: string;
    /** Requested scopes, seperated by spaces - eg: 'email name' */
    scope: string;
    /** JConnect's redirectURI - must be one of the URIs you added in your dashboard */
    redirectURI: string;
    /** Uses popup auth instead of redirection */
    usePopup?: boolean;
  };

  export type JConnectAuthResponse = {
    authorization: {
      /** ID JWT */
      id_token: string;
      /** Grant code valid for 5m */
      code: string;
      /** State string passed to the request */
      state?: string;
    };
    /** Only provided by jconnect in the first request */
    user?: {
      email: string;
      name: {
        firstName: string;
        lastName: string;
      };
    };
  };

  export type JConnectSignInButtonProps = {
    authOptions: JConnectAuthOptions;
    /** Called upon signin success in case authOptions.usePopup = true -- which means auth is handled client side */
    onSuccess: Function;
    /** Called upon signin error */
    onError: Function;
    /** render function - called with all props - can be used to fully customize the UI by rendering your own component  */
    render?: Function;
    /** UI type */
    uiType: 'light' | 'dark';
    /** className */
    className?: string | null | undefined;
    /** prevents rendering of default styles */
    noDefaultStyle?: boolean;
    /** Allows to change the button's children, eg: for changing the button text */
    buttonExtraChildren?: string | ReactNode;
    /** Rest is spread on the root button component */
  };

  export type SignInProps = {
    authOptions: JConnectAuthOptions;
    onSuccess?: Function;
    onError?: Function;
  };

  namespace jconnectAuthHelpers {
    function signIn(props: SignInProps): Promise<JConnectAuthResponse | null>;
  }

  function JConnectSignInButton(props: JConnectSignInButtonProps): JSX.Element;

  export default JConnectSignInButton;
  export { jconnectAuthHelpers };
}
