import axios from "axios";
const scopesArr = ['user-read-email', 'playlist-modify-public'];
const scopes = scopesArr.join(' ');

// const credentials = {
//     clientId: <>
//     clientSecret: <>
// }

// export async function getAuthorizationCode() {
//     try {
//         const redirectUrl = makeRedirectUri();
//         const result = await startAsync({
//             authUrl:
//                 'https://accounts.spotify.com/authorize' +
//                 '?response_type=code' +
//                 '&client_id=' +
//                 credentials.clientId +
//                 (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
//                 '&redirect_uri=' +
//                 encodeURIComponent(redirectUrl),
//         })
//         return result.params.code
//     } catch (err) {
//         console.error(err)
//     }
// }

// export async function getNewToken(token: TokenResponse): TokenResponse {
//     const response = await axios.post(
//         'https://accounts.spotify.com/api/token',
//         qs.stringify({
//             client_id: credentials.clientId,
//             client_secret: credentials.clientSecret,
//             grant_type: 'refresh_token',
//             refresh_token: token.refreshToken,
//         }),
//         {
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//         }
//     );
//
//     // return {
//     //     accessToken: response.data.access_token,
//     //     tokenType:  response.data.token_type,
//     //     expiresIn: response.data.expires_in,
//     //     refreshToken: token.refreshToken,
//     //     scope: response.data.scope,
//     //     issuedAt: Date.now()
//     // }
//
//     return response.data;
// }


export async function getCurrentlyPlaying(token) {
    if(!token) return null;
    return await axios.get(
        'https://api.spotify.com/v1/me/player/currently-playing',
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}

export async function getRecentlyPlayed(token, limit = 10) {
    if(!token) return null;
    return await axios.get(
        `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
}

export async function getUserInfo(token) {
    if(!token) return null;
    return await axios.get(`https://api.spotify.com/v1/me`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });
}
