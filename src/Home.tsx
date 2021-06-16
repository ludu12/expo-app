import React from 'react';
import { Text, View } from 'react-native';
import { useAuth } from './auth';
import { getCurrentlyPlaying, getRecentlyPlayed } from './spotify';
import { useFetch } from './hooks';

const nowPlayingToSong = (nowPlaying) => {
  if (nowPlaying && nowPlaying.currently_playing_type === 'track') {
    return {
      isPlaying: nowPlaying.is_playing,
      album: nowPlaying.item.album.name,
      title: nowPlaying.item.name,
      artist: nowPlaying.item.artists.map((a) => a.name).join(', '),
      albumCoverUrl: nowPlaying.item.album.images[0].url,
      url: nowPlaying.item.external_urls.spotify
    };
  }
  return null;
};

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
        url: track.external_urls.spotify
      };
    });
  }
  return null;
};

const Home: React.FC = () => {
  const {
    state: { userToken }
  } = useAuth();
  const [nowPlaying, setNowPlaying] = React.useState(null);
  const [recentlyPlayed, setRecentlyPlayed] = React.useState(null);

  useFetch({ token: userToken?.accessToken, method: getCurrentlyPlaying, setter: setNowPlaying });
  useFetch({ token: userToken?.accessToken, method: getRecentlyPlayed, setter: setRecentlyPlayed });

  return (
    <View>
      <Text>Signed in!</Text>
      <Text>
        Now Playing: {nowPlayingToSong(nowPlaying)?.title} by {nowPlayingToSong(nowPlaying)?.artist}
      </Text>
      <Text>
        Recently Played: {recentlyPlayedToSongs(recentlyPlayed)?.[0].title} by{' '}
        {recentlyPlayedToSongs(recentlyPlayed)?.[0].artist}
      </Text>
    </View>
  );
};

export default Home;
