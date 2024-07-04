import React, { createContext, useRef, useState } from 'react';

const AppContext = createContext();

const AppProvider = ({ children }) => {
   
    const [followPlanet, setFollowPlanet] = useState(0);
    const radiusRef = useRef(5);
    const planetRef = useRef(null);
    const selectedPlanet = useRef(0);
    return (
        <AppContext.Provider value={{ 
            followPlanet, 
            setFollowPlanet,
            radiusRef,
            planetRef,
            selectedPlanet,
        }}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext, AppProvider };