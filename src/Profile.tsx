import React from 'react';
import { Button, Image, Text, View } from 'react-native';
import { useAuth } from './auth';
import { getUserInfo } from './spotify';
import { useFetch } from './hooks';

const Home: React.FC = () => {
  const {
    signOut,
    state: { userToken }
  } = useAuth();
  const [userInfo, setUserInfo] = React.useState(null);

  useFetch({ token: userToken?.accessToken, method: getUserInfo, setter: setUserInfo });

  return (
    <View>
      <Button title={'Sign Out'} onPress={signOut} />
      <Text>Access: {userToken?.accessToken}</Text>
      <Text>ExpiresIn: {userToken?.expiresIn}</Text>
      <Text>Scope: {userToken?.scope}</Text>
      <Image
        style={{ width: 50, height: 50 }}
        source={{
          uri: userInfo?.images?.[0]?.url
        }}
      />
      <Text>{userInfo?.display_name}</Text>
    </View>
  );
};

export default Home;
