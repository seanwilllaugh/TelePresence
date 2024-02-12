import { useContext, useState } from "react";
import "./Tab.css";
import { Joystick } from 'react-joystick-component';
import { TeamsFxContext } from "./Context";
import { JoystickContext } from "./joystickConfig/JoystickProvider";
import axios from 'axios';

export function Stick(props) {
    const [lastDirection, setLastDirection] = useState("");
    const [joystickStatus, setJoystickStatus] = useState("Idle");


    const handleMove = async (event) => {
        console.log("Joystick Position: ", event.x, event.y);
        console.log("Joystick Direction: ", event.direction);

        const commandData = {
            position: { x: event.x, y: event.y }
        };

        let motorCommand = translateJoystickToMotorCommand(commandData.position);
        console.log("Motor Command: ", motorCommand);

        try {
            const response = await axios.post('https://a308-123-225-170-128.ngrok-free.app/motor-control', motorCommand);
            const data = response.data;
            console.log('Success:', data);
            setJoystickStatus(`Moving: ${event.direction}`);
        } catch (error) {
            console.error('Error:', error);
            setJoystickStatus("Error in connection");
        }
    };

    const handleStop = async () => {
        console.log("Stopped");
        setJoystickStatus("Stopped");

        // Define a stop command
        const stopCommand = {
            leftMotorSpeed: 0,
            rightMotorSpeed: 0
        };

        // Send the stop command to the server
        try {
            await axios.post('', stopCommand);
            console.log('Stop command sent');
        } catch (error) {
            console.error('Error sending stop command:', error);
        }
    };

    const { joystickProps } = useContext(JoystickContext);

    return (
        <div className="control page">
            <div className="narrow page-padding">
                <img src="logo.png"/>
                <h1 className="center">TelePresence</h1>
                <div className="joystick-wrapper">
                <div className="joystick-directions">
                    <div className="direction">Forward</div>
                </div>
                <div className="joystick-directions">
                    <div className="direction">Left</div>
                    <div className="joystick">
                        <Joystick 
                            size={joystickProps.size} 
                            baseColor={joystickProps.baseColor} 
                            stickColor={joystickProps.stickColor}
                            stickShape={joystickProps.stickShape} 
                            baseShape={joystickProps.baseShape} 
                            move={handleMove} 
                            stop={() => {
                                console.log("Stopped");
                                setJoystickStatus("Stopped");
                            }} 
                            start={handleStop} 
                        />
                    </div>
                    <div className="direction">Right</div>
                </div>
                <div className="joystick-directions">
                    <div className="direction">Reverse</div>
                </div>
                <div className="joystick-status">
                    <p>Status: {joystickStatus}</p>
                </div>
                </div>
        </div>
        </div>
    );
}

export default Stick;

function translateJoystickToMotorCommand(position) {
    const maxSpeed = 50;

    if(position.x >= 0.5){
        position.x = 1;
    }else if(position.x < 0.5 && position.x > -0.5){
        position.x = 0;
    }
    else if(position.x <= -0.5){
        position.x = -1;
    }

    if(position.y >= 0.5){
        position.y = 1;
    }else if(position.y < 0.5 && position.y > -0.5){
        position.y = 0;
    }
    else if(position.y <= -0.5){
        position.y = -1;
    }

    const leftSpeed = maxSpeed * (position.y + position.x);
    const rightSpeed = maxSpeed * (position.y - position.x);

    return {
        leftMotorSpeed: Math.min(Math.abs(leftSpeed), maxSpeed) * (leftSpeed > 0 ? 1 : -1),
        rightMotorSpeed: Math.min(Math.abs(rightSpeed), maxSpeed) * (rightSpeed > 0 ? 1 : -1)
    };
}
