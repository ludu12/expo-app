import React from 'react';
import {Button, StyleSheet, Text, View} from "react-native";
import {useAuth} from "./auth";


const SignIn: React.FC = () => {
    const {signIn, state: {error}} = useAuth();
    const [isSigningIn, setIsSigningIn] = React.useState(false);
    return (
        <View style={styles.container}>
            <Button
                title="Sign in"
                disabled={isSigningIn}
                onPress={async () => {
                    setIsSigningIn(true)
                    await signIn();
                    setIsSigningIn(false)
                }}
            />
            {error && <Text>ERROR: {error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default SignIn;
