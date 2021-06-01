import React from 'react';
import {Button, Image, StyleSheet, Text, View} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import {makeRedirectUri, ResponseType, TokenResponse, useAuthRequest} from 'expo-auth-session';
import axios from 'axios';

const queryString = require('query-string');


WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

export default function App() {
    const [userInfo, setUserInfo] = React.useState(null);
    const [token, setToken] = React.useState(null);
    const [request, response, promptAsync] = useAuthRequest(
        {
            responseType: ResponseType.Token,
            clientId: '90bcb46c467947b9ad0594d06ed8f5d4',
            clientSecret: '702779c40cca4b7ca451257aac7102db',
            scopes: ['user-read-email', 'playlist-modify-public'],
            // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
            // this must be set to false
            usePKCE: false,
            redirectUri: makeRedirectUri({useProxy: false}),
        },
        discovery
    );

    React.useEffect(() => {
        if (response?.type === 'success') {
            const {access_token} = response.params;

            axios.get(`https://api.spotify.com/v1/me`, {
                headers: {
                    "Authorization": `Bearer ${access_token}`
                }
            }).then(setUserInfo)
            setToken(TokenResponse.fromQueryParams(response.params))
        }
        console.log(response)
    }, [response]);


    const refresh = () => {
        console.log(token)
        axios.post(
            'https://accounts.spotify.com/api/token',
            queryString.stringify({
                clientId: '90bcb46c467947b9ad0594d06ed8f5d4',
                clientSecret: '702779c40cca4b7ca451257aac7102db',
                grant_type: 'refresh_token',
                refresh_token: token.access_token
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        ).then(x => console.log(x.data)).catch(x => console.log(x.response))
    }

    return (
        <View style={styles.container}>
            <Button
                disabled={!request}
                title="Login"
                onPress={() => {
                    promptAsync();
                }}
            />
            <View>
                <Text>
                    {userInfo?.data?.display_name}
                </Text>
                <Text>
                    {JSON.stringify(token, null,2 )}
                </Text>
                <Image
                    style={{width: 50, height: 50}}
                    source={{
                        uri: userInfo?.data?.images?.[0]?.url,
                    }}
                />
                <Button title={'Refresh'} onPress={refresh}/>
            </View>
        </View>
    );
}

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>Open up App.js to start working on your app!</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
