/** @flow */
import React from 'react';

import signIn from '../JConnectAuthHelpers';

import logo from "../../public/images/logo-dark.png";
import logoLight from "../../public/images/logo.png";

import type { JConnectAuthOptions } from '../types';

type Props = {
  authOptions: JConnectAuthOptions,
  /** Called upon signin success in case authOptions.usePopup = true -- which means auth is handled client side */
  onSuccess: Function,
  /** Called upon signin error */
  onError: Function,
  /** Skips loading the jconnect script if true */
  skipScript?: boolean,
  /** jconnect image props */
  iconProps: Object,
  /** render function - called with all props - can be used to fully customize the UI by rendering your own component  */
  render?: Function,
  /** UI type */
  uiType: 'light' | 'dark',
  /** className */
  className?: ?string,
  /** prevents rendering of default styles */
  noDefaultStyle?: boolean,
  /** Allows to change the button's children, eg: for changing the button text */
  buttonExtraChildren?: string | React$Node,
  /** Rest is spread on the root button component */
};

/** css styles */
const _style = `
.react-jconnect-signin-auth-btn {
  background-color: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  border-radius: 4px;
  padding: 10px;
  font-size: 14px;
  font-size: 1em;
  line-height: 1;
  border: 1px solid #0047ab;
  overflow: hidden;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
.react-jconnect-signin-auth-btn img {
  max-width: 30px;
  border-radius: 50%;
  margin-right: 5px;
}
.react-jconnect-signin-auth-btn-light {
  background-color: #FFF;
  color: #0047ab;
  border-color: #0047ab;
}
.react-jconnect-signin-auth-btn-dark {
  background-color: #0047ab;
  color: #FFF;
  border-color: #FFF;
}`.replace(/ {2}|\n/g, '');

export default function JConnectSignInButton ({
  onSuccess,
  onError,
  authOptions,
  iconProps,
  render,
  uiType = 'dark',
  className,
  noDefaultStyle = false,
  buttonExtraChildren = 'Continue with JConnect',
  ...rest
}: Props) {
  /** Button click handler */
  const handleClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    signIn({ authOptions, onSuccess, onError });
  };

  /** common props */
  const props = {
    children: (
      <>
        <img src={uiType === 'dark' ? logo : logoLight} alt="JConnect" />
        <div>
          {buttonExtraChildren}
        </div>
      </>
    ),
    onClick: handleClick,
    ...rest,
  };

  /** use render function if passed */
  if (render) {
    return render(props);
  }

  /** render button */
  return (
    <>
      <button
        className={`${
          noDefaultStyle
            ? ''
            : `react-jconnect-signin-auth-btn react-jconnect-signin-auth-btn-${uiType}`
        }${className ? ` ${className}` : ''}`}
        type="button"
        aria-label="Signin with jconnect ID"
        {...props}
      />
      {noDefaultStyle ? null : <style>{_style}</style>}
    </>
  );
};
