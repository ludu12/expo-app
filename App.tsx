import React from 'react';
import AuthProvider from "./src/auth";
import Navigator from "./src/Navigator";

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Navigator/>
        </AuthProvider>
    );
}

export default App;
