import React from 'react';
import {Button, Image, Text, View} from 'react-native'
import {useAuth} from "./auth";
import {getCurrentlyPlaying, getRecentlyPlayed, getUserInfo} from "./spotify";

const useFetch = (token, method, setter) => {
    React.useEffect(() => {
        method(token).then((r) => {
            setter(r?.data);
        }).catch(e => {
            console.error("Error in fetch", e?.response?.data || e)
        })

    }, [token])
}

const nowPlayingToSong = (nowPlaying) => {
    if (nowPlaying && nowPlaying.currently_playing_type === 'track') {
        return {
            isPlaying: nowPlaying.is_playing,
            album: nowPlaying.item.album.name,
            title: nowPlaying.item.name,
            artist: nowPlaying.item.artists.map((a) => a.name).join(', '),
            albumCoverUrl: nowPlaying.item.album.images[0].url,
            url: nowPlaying.item.external_urls.spotify,
        }
    }
    return null
}

const recentlyPlayedToSongs = (recentlyPlayed) => {
    if (recentlyPlayed && recentlyPlayed.items) {
        return recentlyPlayed.items.map((item) => {
            const track = item.track;
            return {
                isPlaying: false,
                album: track.album.name,
                title: track.name,
                artist: track.artists.map((a) => a.name).join(', '),
                albumCoverUrl: track.album.images[0].url,
                url: track.external_urls.spotify,
            };
        })
    }
    return null
}

const Home: React.FC = () => {
    const {signOut, state: {userToken}} = useAuth();
    const [nowPlaying, setNowPlaying] = React.useState(null);
    const [recentlyPlayed, setRecentlyPlayed] = React.useState(null);
    const [userInfo, setUserInfo] = React.useState(null);

    useFetch(userToken?.accessToken, getCurrentlyPlaying, setNowPlaying);
    useFetch(userToken?.accessToken, getRecentlyPlayed, setRecentlyPlayed);
    useFetch(userToken?.accessToken, getUserInfo, setUserInfo);

    return (
        <View>
            <Text>Signed in!</Text>
            <Text>Access: {userToken?.accessToken}</Text>
            <Text>ExpiresIn: {userToken?.expiresIn}</Text>
            <Text>Scope: {userToken?.scope}</Text>
            <Button title="Sign out" onPress={signOut}/>
            <Image
                style={{width: 50, height: 50}}
                source={{
                    uri: userInfo?.images?.[0]?.url,
                }}
            />
            <Text>
                {userInfo?.display_name}
            </Text>
            <Text>Now Playing: {nowPlayingToSong(nowPlaying)?.title} by {nowPlayingToSong(nowPlaying)?.artist}</Text>
            <Text>Recently Played: {recentlyPlayedToSongs(recentlyPlayed)?.[0].title} by {recentlyPlayedToSongs(recentlyPlayed)?.[0].artist}</Text>
        </View>
    );
};

export default Home;
