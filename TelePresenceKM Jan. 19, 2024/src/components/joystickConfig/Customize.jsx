import { useState, useContext, useEffect } from "react";
import { JoystickContext } from "../JoystickProvider";
import { Joystick } from 'react-joystick-component';
import { Button } from "@fluentui/react-components";
import * as microsoftTeams from "@microsoft/teams-js";
import "./Customize.css";

export function Customize({ setSelectedValue }) {
    const { joystickProps, setJoystickProps } = useContext(JoystickContext);
    // Initialize state variables with current joystickProps
    const [newSize, setNewSize] = useState(joystickProps.size);
    const [newBaseColor, setNewBaseColor] = useState(joystickProps.baseColor);
    const [newStickColor, setNewStickColor] = useState(joystickProps.stickColor);
    const [newStickShape, setNewStickShape] = useState(joystickProps.stickShape);
    const [newBaseShape, setNewBaseShape] = useState(joystickProps.baseShape);


    const handleSave = () => {
        setJoystickProps({
            size: newSize,
            baseColor: newBaseColor,
            stickColor: newStickColor,
            stickShape: newStickShape,
            baseShape: newBaseShape
        });

        // Save settings in Teams
        microsoftTeams.pages.config.setConfig({
            contentUrl: "${{TAB_ENDPOINT}}/index.html#/control",
            websiteUrl: "${{TAB_ENDPOINT}}",
            suggestedDisplayName: "TelePresence", // The name of your app
            configuration: {
                size: newSize,
                baseColor: newBaseColor,
                stickColor: newStickColor,
                stickShape: newStickShape,
                baseShape: newBaseShape
            }
        });

        microsoftTeams.pages.config.registerOnSaveHandler(function (saveEvent) {
            saveEvent.notifySuccess();
        });

        microsoftTeams.pages.config.setValidityState(true);
    };

    const handleMove = (event) => {
        console.log("Joystick Position: ", event.x, event.y);
        console.log("Joystick Direction: ", event.direction);
    };

    return (
        <JoystickContext.Provider value={{ joystickProps, setJoystickProps }}>
            <div className="customize-container">
                <label>
                    Size:
                    <input type="number" value={newSize} onChange={e => setNewSize(e.target.value)} />
                </label>
                <label>
                    Base Color:
                    <input type="color" value={newBaseColor} onChange={e => setNewBaseColor(e.target.value)} />
                </label>
                <label>
                    Stick Color:
                    <input type="color" value={newStickColor} onChange={e => setNewStickColor(e.target.value)} />
                </label>
                <label>
                    Stick Shape:
                    <select value={newStickShape} onChange={e => setNewStickShape(e.target.value)}>
                        <option value="circle">Circle</option>
                        <option value="square">Square</option>
                    </select>
                </label>
                <label>
                    Base Shape:
                    <select value={newBaseShape} onChange={e => setNewBaseShape(e.target.value)}>
                        <option value="circle">Circle</option>
                        <option value="square">Square</option>
                    </select>
                </label>

                <Joystick 
                    size={newSize} 
                    baseColor={newBaseColor} 
                    stickColor={newStickColor}
                    stickShape={newStickShape} 
                    baseShape={newBaseShape} 
                    move={handleMove} 
                    stop={console.log("Stopped")} 
                    start={console.log("Started")} 
                />
                
                <Button onClick={handleSave}>Save</Button>

            </div>
        </JoystickContext.Provider>
    );
}