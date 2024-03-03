const JCONNECT_AUTH_URL = 'http://127.0.0.1:8000';

// Validates the arguments
function checkArgs(args) {
  if (!args.clientId || !args.redirectURI) {
    throw new Error('clientId and redirectUri are required');
  }

  if (!args.scope || args.scope === '') {
    throw new Error('scope is required');
  }

  if (!args.state) {
    throw new Error('state is required');
  }

  if (!args.responseType) {
    throw new Error('responseType is required');
  }
}

// Opens a popup for authentication
function openPopup(args, onError) {
  const width = 700;
  const height = 700;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;
  const url = new URL(`${JCONNECT_AUTH_URL}/authorize`);
  url.searchParams.append('client_id', args.clientId);
  url.searchParams.append('redirect_uri', args.redirectURI);
  url.searchParams.append('scope', args.scope);
  url.searchParams.append('state', args.state);
  url.searchParams.append('response_type', args.responseType);

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

        if (event.data.code === 'auth_success') {
          onSuccess(event.data);
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
