import React, { useState } from 'react';
import { Button } from "@fluentui/react-components";
import {app, pages} from "@microsoft/teams-js";
import axios from 'axios';

export function Configuration() {
    const robotFlaskUrl = 'https://a308-123-225-170-128.ngrok-free.app/health'; 
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');

    const handleConnect = async () => {   

        /*
        Testing Purposes:

        pages.config.registerOnSaveHandler((saveEvent) => {
        const baseUrl = `https://${window.location.hostname}:${window.location.port}`;
        pages.config
            .setConfig({
                suggestedDisplayName: "TelePresence",
                entityId: "KMTP",
                contentUrl: baseUrl + "/index.html#/tab",
                websiteUrl: baseUrl + "/index.html#/tab",
            })
            .then(() => {
                saveEvent.notifySuccess();
            });
        });
        pages.config.setValidityState(true);
        app.notifySuccess();
        */

        setConnectionStatus('Attempting to connect...');

        try {
            const response = await axios.get(robotFlaskUrl);
            if (response.status === 200) {
                console.log('Connected to robot server.');
                setConnectionStatus('Connected');
                
                // When the user clicks "Save", save the url for your configured tab.
                // This allows for the addition of query string parameters based on
                // the settings selected by the user.

                pages.config.registerOnSaveHandler((saveEvent) => {
                const baseUrl = `https://${window.location.hostname}:${window.location.port}`;
                pages.config
                    .setConfig({
                    suggestedDisplayName: "TelePresenceKM",
                    entityId: "Test",
                    contentUrl: baseUrl + "/index.html#/tab",
                    websiteUrl: baseUrl + "/index.html#/tab",
                    })
                    .then(() => {
                    saveEvent.notifySuccess();
                    });
                });
                
                // After verifying that the settings for your tab are correctly filled
                // in by the user you need to set the state of the dialog to be valid
                // This will enable the save button in the configuration dialog.

                pages.config.setValidityState(true);

                // Hide the loading indicator.

                app.notifySuccess();

            } else {
                console.error('Failed to connect to robot server.');
                setConnectionStatus('Failed to connect');
            }
        } catch (error) {
            console.error('Error connecting to robot server:', error);
            setConnectionStatus('Connection error');
            alert('Error connecting to robot server. Please check the server and try again.');
        }
        setConnectionStatus('Connected');
    };

    return (
        <div>
            <h2>Connect to a Robot</h2>
            <p>Status: {connectionStatus}</p>
            <Button onClick={handleConnect}>Connect</Button>
        </div>
    );
}

export default Configuration;
