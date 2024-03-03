import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import pkgJson from '../../../package.json';
import JConnectSignInButton from '../../../src';

import './Demo.css';

function Demo() {
  const [authOptions, setAuthOptions] = useState({
    clientId: '576ed8da-1374-4b54-82a4-dc4c81a262fd',
    scope: 'email profile',
    redirectURI:
      'https://jewbuzz-test.com?utm_source=jconnectid&utm_medium=web&utm_campaign=auth_redirect',
    state: 'hey',
    responseType: 'code',
    usePopup: true,
  });
  const [extraProps, setExtraProps] = useState({
    uiType: 'dark',
    className: 'jconnect-auth-btn',
    noDefaultStyle: false,
    buttonExtraChildren: 'Continue with JConnect',
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (err) => {
      console.log(err);
    },
  });
  const [codeString, setCodeString] = useState('');

  /** Update code string */
  useEffect(() => {
    setCodeString(`import JConnectSignInButton from 'react-jconnect-signin-auth';

export default const MyApp = () => (
  <JConnectSignInButton
    authOptions={{
      clientId: '${authOptions.clientId}',
      scope: '${authOptions.scope}',
      redirectURI: '${authOptions.redirectURI}',
      state: '${authOptions.state}',
      usePopup: ${authOptions.usePopup},
    }}
    /** General props */
    uiType="${extraProps.uiType}"${
      extraProps.className
        ? `\n    /** className */\n    className="${extraProps.className}"`
        : ''
    }${
      extraProps.noDefaultStyle
        ? `\n    /** Removes default style tag */\n    noDefaultStyle`
        : ''
    }${
      extraProps.buttonExtraChildren
        ? `\n    /** Allows to change the button's children, eg: for changing the button text */\n    buttonExtraChildren="${extraProps.buttonExtraChildren}"`
        : ''
    }
    /** Checkout README.md for further customization props. */
  />
);
`);
  }, [authOptions, extraProps]);

  return (
    <article className="wrapper">
      <header>
        <h1>{pkgJson.name}</h1>
        <p>{pkgJson.description}</p>
      </header>
      <div className="container">
        <section>
          <h3>UI:</h3>
          <JConnectSignInButton authOptions={authOptions} {...extraProps} />
          <h3>Code:</h3>
          <div className="code-ui">
            <SyntaxHighlighter language="javascript" style={atomDark}>
              {codeString}
            </SyntaxHighlighter>
          </div>
        </section>
        <section>
          <h2>Props</h2>
          <div className="options-container">
            <h3>Auth options</h3>
            <label htmlFor="clientId">Client ID:</label>
            <input
              type="text"
              placeholder="clientId"
              value={authOptions.clientId}
              onChange={({ target: { value } }) =>
                setAuthOptions((currVal) => ({ ...currVal, clientId: value }))
              }
            />
            <label htmlFor="scope">Scope:</label>
            <input
              type="text"
              placeholder="scope"
              value={authOptions.scope}
              onChange={({ target: { value } }) =>
                setAuthOptions((currVal) => ({ ...currVal, scope: value }))
              }
            />
            <label htmlFor="redirectURI">
              redirectURI - MUST NOT have a trailing slash:
            </label>
            <input
              type="text"
              placeholder="redirectURI"
              value={authOptions.redirectURI}
              onChange={({ target: { value } }) =>
                setAuthOptions((currVal) => ({
                  ...currVal,
                  redirectURI: value,
                }))
              }
            />
            <label htmlFor="redirectURI">State:</label>
            <input
              type="text"
              placeholder="state"
              value={authOptions.state}
              onChange={({ target: { value } }) =>
                setAuthOptions((currVal) => ({ ...currVal, state: value }))
              }
            />
            <div>
              <input
                type="checkbox"
                checked={authOptions.usePopup}
                onChange={({ target: { checked } }) =>
                  setAuthOptions((currVal) => ({
                    ...currVal,
                    usePopup: checked,
                  }))
                }
              />
              <label htmlFor="use_popup">Use Popup:</label>
            </div>
          </div>
          <div>
            <h3>UI props</h3>
            <div>
              Light:
              <input
                type="checkbox"
                checked={extraProps.uiType === 'light'}
                onChange={() =>
                  setExtraProps((currVal) => ({
                    ...currVal,
                    uiType: 'light',
                  }))
                }
              />
              Dark:
              <input
                type="checkbox"
                checked={extraProps.uiType === 'dark'}
                onChange={() =>
                  setExtraProps((currVal) => ({
                    ...currVal,
                    uiType: 'dark',
                  }))
                }
              />
            </div>
          </div>
          <div>
            className:
            <input
              type="text"
              value={extraProps.className}
              onChange={({ target: { value } }) =>
                setExtraProps((currVal) => ({
                  ...currVal,
                  className: value,
                }))
              }
            />
          </div>
          <div>
            noDefaultStyle:
            <input
              type="checkbox"
              checked={extraProps.noDefaultStyle}
              onChange={({ target: { checked } }) =>
                setExtraProps((currVal) => ({
                  ...currVal,
                  noDefaultStyle: checked,
                }))
              }
            />
          </div>
          <div>
            buttonExtraChildren:
            <input
              type="text"
              value={`"${extraProps.buttonExtraChildren}"`}
              onChange={({ target: { value } }) =>
                setExtraProps((currVal) => ({
                  ...currVal,
                  buttonExtraChildren: value,
                }))
              }
            />
          </div>
          <div>
            <h3>Extra props</h3>
            <div>
              <div>onSuccess</div>
              <div>onError</div>
              <div>skipScript</div>
              <div>iconProps</div>
              <div>render</div>
            </div>
          </div>
        </section>
      </div>
      <footer>
        Built with{' '}
        <span role="img" aria-label="love">
          ❤️
        </span>{' '}
        by <a href="https://github.com/gamcoh">the JConnect team</a>
        <div>
          version:
          {pkgJson.version}
        </div>
      </footer>
    </article>
  );
}

export default Demo;
