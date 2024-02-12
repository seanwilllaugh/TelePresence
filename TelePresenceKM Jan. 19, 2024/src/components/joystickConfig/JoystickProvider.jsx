import React, { createContext, useState } from 'react';

export const JoystickContext = createContext();

export const JoystickProvider = ({ children }) => {
  const [joystickProps, setJoystickProps] = useState({
    size: 100,
    baseColor: "#555",
    stickColor: "#000",
    stickShape: "circle",
    baseShape: "circle"
  });

  return (
    <JoystickContext.Provider value={{ joystickProps, setJoystickProps }}>
      {children}
    </JoystickContext.Provider>
  );
};