import React from 'react';
import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';
import {
  exchangeCodeAsync,
  makeRedirectUri,
  ResponseType,
  TokenResponse,
  useAuthRequest
} from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

const credentials = {
  clientId: '90bcb46c467947b9ad0594d06ed8f5d4',
  clientSecret: '702779c40cca4b7ca451257aac7102db'
};

const initialState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
  error: null
};

type AuthValue = {
  state: typeof initialState;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthValue>({
  state: initialState,
  signIn: async () => {
    // unimplemented
  },
  signOut: async () => {
    // unimplemented
  }
});

export const useAuth = (): AuthValue => {
  return React.useContext(AuthContext);
};

const useAuthReducer = () => {
  return React.useReducer((prevState, action) => {
    switch (action.type) {
      case 'RESTORE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
          error: null
        };
      case 'SIGN_IN':
        return {
          ...prevState,
          isSignout: false,
          userToken: action.token,
          error: null
        };
      case 'SIGN_OUT':
        return {
          ...prevState,
          isSignout: true,
          userToken: null,
          error: null
        };
      case 'ERROR':
        return {
          ...prevState,
          error: action.error
        };
    }
  }, initialState);
};

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint: 'https://accounts.spotify.com/api/token'
};

// Lets try to follow: https://medium.com/@zachrach/spotify-web-api-authorization-with-react-native-expo-6ee1a290b2b0
const AuthProvider: React.FC = (props) => {
  const [state, dispatch] = useAuthReducer();
  const redirectUri = makeRedirectUri();
  const [, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Code,
      clientId: credentials.clientId,
      scopes: [
        'user-read-email',
        'playlist-modify-public',
        'user-read-recently-played',
        'user-read-playback-state',
        'user-read-currently-playing',
        'user-library-read',
        'user-top-read'
      ],
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      redirectUri: redirectUri
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      exchangeCodeAsync(
        {
          clientId: credentials.clientId,
          clientSecret: credentials.clientSecret,
          code,
          redirectUri
        },
        discovery
      ).then(async (token) => {
        console.log(token);
        await setItemAsync('userToken', JSON.stringify(token));
        dispatch({ type: 'SIGN_IN', token: token });
      });
    } else {
      dispatch({ type: 'ERROR', error: JSON.stringify(response) });
    }
  }, [response]);

  React.useEffect(() => {
    const fetchToken = async () => {
      const token = await getItemAsync('userToken');
      let userToken = JSON.parse(token);

      if (userToken) {
        userToken = new TokenResponse(userToken);
        console.log('Using token', userToken);
        const shouldRefresh = userToken.shouldRefresh();
        if (shouldRefresh) {
          console.log('Refreshing...');
          await userToken.refreshAsync(
            {
              clientId: credentials.clientId,
              clientSecret: credentials.clientSecret
            },
            discovery
          );
        }
      }

      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    fetchToken();
  }, []);

  const authContext = React.useMemo(
    () => ({
      state,
      signIn: async () => {
        await promptAsync();
      },
      signOut: async () => {
        await deleteItemAsync('userToken');
        dispatch({ type: 'SIGN_OUT' });
      }
    }),
    [state]
  );
  return <AuthContext.Provider value={authContext}>{props.children}</AuthContext.Provider>;
};

export default AuthProvider;
