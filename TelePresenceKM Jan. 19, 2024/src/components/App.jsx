// https://fluentsite.z22.web.core.windows.net/quick-start
import {
  FluentProvider,
  teamsLightTheme,
  teamsDarkTheme,
  teamsHighContrastTheme,
  Spinner,
  tokens,
} from "@fluentui/react-components";
import { HashRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { useTeamsUserCredential } from "@microsoft/teamsfx-react";
import Privacy from "./Privacy";
import TermsOfUse from "./TermsOfUse";
import Stick from "./Tab";
import { TeamsFxContext } from "./Context";
import config from "./sample/lib/config";
import Configuration from "./Configure";
import { JoystickProvider } from "./joystickConfig/JoystickProvider";

/**
 * The main app which handles the initialization and routing
 * of the app.
 */
export default function App() {
  const { loading, theme, themeString, teamsUserCredential } = useTeamsUserCredential({
    initiateLoginEndpoint: config.initiateLoginEndpoint,
    clientId: config.clientId,
  });
  return (
    <TeamsFxContext.Provider value={{ theme, themeString, teamsUserCredential }}>
      <FluentProvider
        theme={
          themeString === "dark"
            ? teamsDarkTheme
            : themeString === "contrast"
            ? teamsHighContrastTheme
            : {
                ...teamsLightTheme,
                colorNeutralBackground3: "#eeeeee",
              }
        }
        style={{ background: tokens.colorNeutralBackground3 }}
      >
        <JoystickProvider>
          <Router>
            {loading ? (
              <Spinner style={{ margin: 100 }} />
            ) : (
              <Routes>
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/termsofuse" element={<TermsOfUse />} />
                <Route path="/tab" element={<Stick />} />
                <Route path="/configuration" element={<Configuration />} />
              </Routes>
            )}
          </Router>
        </JoystickProvider>
      </FluentProvider>
    </TeamsFxContext.Provider>
  );
}
