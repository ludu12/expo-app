import axios, { AxiosResponse } from 'axios';

export async function getCurrentlyPlaying(token: string): Promise<AxiosResponse> {
  if (!token) return null;
  return await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export async function getRecentlyPlayed(token: string, limit = 10): Promise<AxiosResponse> {
  if (!token) return null;
  return await axios.get(`https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export async function getUserInfo(token: string): Promise<AxiosResponse> {
  if (!token) return null;
  return await axios.get(`https://api.spotify.com/v1/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
