import React from 'react';
import {Button, Image, Platform, StyleSheet, Text, View, AsyncStorage} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import {makeRedirectUri, ResponseType, TokenResponse, useAuthRequest, exchangeCodeAsync} from 'expo-auth-session';
import axios from 'axios';
import Constants from "expo-constants";
import Clipboard from 'expo-clipboard';


WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
    authorizationEndpoint: 'https://accounts.spotify.com/authorize',
    tokenEndpoint: 'https://accounts.spotify.com/api/token',
};

export default function App() {
    const [userInfo, setUserInfo] = React.useState(null);
    const [token, setToken] = React.useState(null);

    let redirectUri = makeRedirectUri();
    const [request, response, promptAsync] = useAuthRequest(
        {
            responseType: ResponseType.Code,
            clientId: '90bcb46c467947b9ad0594d06ed8f5d4',
            scopes: ['user-read-email', 'playlist-modify-public'],
            // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
            // this must be set to false
            usePKCE: false,
            // redirectUri: makeRedirectUri({useProxy: false}),
            redirectUri: redirectUri,
        },
        discovery
    );

    React.useEffect(() => {
        if (response?.type === 'success') {
            const {code} = response.params;

            if(!token){
                exchangeCodeAsync({ clientId: '90bcb46c467947b9ad0594d06ed8f5d4',
                    clientSecret: '702779c40cca4b7ca451257aac7102db',
                    code,
                    redirectUri
                }, discovery).then(setToken);
            }

            // axios.get(`https://api.spotify.com/v1/me`, {
            //     headers: {
            //         "Authorization": `Bearer ${access_token}`
            //     }
            // }).then(setUserInfo)
            // setToken(TokenResponse.fromQueryParams(response.params))
        }
    }, [response]);

    React.useEffect(() => {
        if(token && !userInfo){
            axios.get(`https://api.spotify.com/v1/me`, {
                headers: { "Authorization": `Bearer ${token.accessToken}`
                }
            }).then(setUserInfo)
        }
    }, [token])


    const refresh = () => {

        axios({
            url: 'https://accounts.spotify.com/api/token',
            method: 'post',
            params: {
                grant_type: 'refresh_token',
                refresh_token: token.refreshToken
            },
            headers: {
                'Accept':'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            auth: {
                username: '90bcb46c467947b9ad0594d06ed8f5d4',
                password: '702779c40cca4b7ca451257aac7102db'
            }
        }).then(console.log).catch(console.log);

        // axios.post(
        //     'https://accounts.spotify.com/api/token',
        //     queryString.stringify({
        //         clientId: '90bcb46c467947b9ad0594d06ed8f5d4',
        //         clientSecret: '702779c40cca4b7ca451257aac7102db',
        //         grant_type: 'refresh_token',
        //         refresh_token: token.refreshToken
        //     }),
        //     {
        //         headers: {
        //             'Content-Type': 'application/x-www-form-urlencoded',
        //         },
        //     }
        // ).then(x => console.log(x.data)).catch(x => console.log(x.response))
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
                    {redirectUri}
                </Text>
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
