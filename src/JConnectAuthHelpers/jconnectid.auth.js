const JCONNECT_AUTH_URL = 'https://jconnect.cloud/api';

// Validates the arguments
function checkArgs(args) {
  if (!args.clientId || !args.redirectURI) {
    throw new Error('clientId and redirectUri are required');
  }

  if (!args.scope || args.scope === '') {
    throw new Error('scope is required');
  }

  if (!args.responseType) {
    throw new Error('responseType is required');
  }
}

// Opens a popup for authentication
async function openPopup(args, onError) {
  const oauth2_state = generate_state_token();
  const codeVerifier = generateRandomString();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const width = 700;
  const height = 700;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;
  const url = new URL(`${JCONNECT_AUTH_URL}/authorize`);
  url.searchParams.append('client_id', args.clientId);
  url.searchParams.append('redirect_uri', args.redirectURI);
  url.searchParams.append('scope', args.scope);
  url.searchParams.append('state', oauth2_state);
  url.searchParams.append('response_type', args.responseType);
  url.searchParams.append('code_challenge', codeChallenge);

  // Saving the code verifier in session storage for later use
  sessionStorage.setItem('oauth2_code_verifier', codeVerifier);

  const popupWindow = window.open(
    url,
    'JConnect Login',
    `width=${width},height=${height},top=${top},left=${left}`,
  );

  if (!popupWindow) {
    throw new Error(
      'Failed to open popup window. Please check your popup blocker settings.',
    );
  }

  const checkPopup = () => {
    if (!popupWindow || popupWindow.closed) {
      clearInterval(popupCheckInterval);
      onError(new Error('Popup window was closed'));
    }
  };

  let popupCheckInterval = setInterval(checkPopup, 1000);
}

// Redirects the user in the same window
function redirect(args) {
  window.location.href = `${JCONNECT_AUTH_URL}/authorize?client_id=${args.clientId}&redirect_uri=${args.redirectUri}`;
}

function generate_state_token() {
  const newState = window.crypto.randomUUID();
  sessionStorage.setItem('oauth2_state', newState);
  return newState;
}

function generateRandomString(length = 42) {
  let text = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  // Encode code_verifier to Uint8Array
  const encoder = new TextEncoder();
  const codeVerifierUint8 = encoder.encode(codeVerifier);

  // Create a SHA-256 hash of the code verifier
  const hashBuffer = await window.crypto.subtle.digest(
    'SHA-256',
    codeVerifierUint8,
  );

  // Convert the ArrayBuffer to string using base64 encoding
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashBase64 = btoa(String.fromCharCode(...hashArray));

  // Replace unnecessary characters to make it URL-safe
  const codeChallenge = hashBase64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return codeChallenge;
}

function fetchUserInfo(accessToken, onSuccess, onError) {
  fetch(`${JCONNECT_AUTH_URL}/account-info`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      onSuccess(data);
    })
    .catch((error) => {
      onError(error);
    });
}

function exchangeCodeForToken({
  code,
  redirectURI,
  clientId,
  state,
  onError,
  onSuccess,
}) {
  fetch(`${JCONNECT_AUTH_URL}/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      state,
      redirect_uri: redirectURI,
      client_id: clientId,
      code_verifier: sessionStorage.getItem('oauth2_code_verifier'),
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to exchange code for token');
      }
      return response.json();
    })
    .then((data) => {
      fetchUserInfo(data.access_token, onSuccess, onError);
    })
    .catch((error) => {
      onError(error);
    });
}

// Handles sign-in logic
function signIn({
  authOptions,
  usePopup = true,
  onSuccess = () => {},
  onError = () => {},
}) {
  try {
    window.addEventListener(
      'message',
      (event) => {
        if (event.origin !== JCONNECT_AUTH_URL) {
          return;
        }

        if (event.data.error) {
          onError(event.data.error);
          return;
        }

        if (event.data?.type === 'authorization_code') {
          exchangeCodeForToken({
            code: event.data.authorization_code,
            redirectURI: authOptions.redirectURI,
            clientId: authOptions.clientId,
            state: sessionStorage.getItem('oauth2_state'),
            onError,
            onSuccess,
          });
          return;
        }

        onError(event.data);
      },
      false,
    );

    checkArgs(authOptions);
    if (usePopup) {
      openPopup(authOptions, onError);
      return;
    }

    redirect(authOptions);
  } catch (error) {
    onError(error);
  }
}

export { signIn };
