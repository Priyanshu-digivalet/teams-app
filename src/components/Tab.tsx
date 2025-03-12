import { useContext, useState } from "react";
import { TeamsFxContext } from "./Context";
import { RecordTable } from "./tabComponents/recordTable/RecordTable";
import {
  Authenticator,
  ThemeProvider,
  defaultDarkModeOverride,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./Tab.css";
import { Sidebar } from "./tabComponents/sidebar/Sidebar";
import { Navbar } from "./tabComponents/navbar/Navbar";
import { useFetchExistingUser } from "./graphql/hooks/hooks";
// import {
//   TeamsUserCredentialAuthConfig,
//   TeamsUserCredential,
// } from "@microsoft/teamsfx";
// import { Button } from "@fluentui/react-components";
// import config from "./sample/lib/config";

export default function Tab() {
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [selectedSection, setSelectedSection] = useState("Upcoming");
  const { themeString } = useContext(TeamsFxContext);
  const { fetchUserError } = useFetchExistingUser();

  const theme = {
    name: "my-theme",
    overrides: [defaultDarkModeOverride],
  };

  // http://localhost:7071
  // "resource": "api://${{TAB_DOMAIN}}/${{AAD_APP_CLIENT_ID}}"

  // const authConfig: TeamsUserCredentialAuthConfig = {
  //   clientId: "YOUR_CLIENT_ID",
  //   initiateLoginEndpoint: "YOUR_LOGIN_PAGE_URL",
  // };

  // const authConfig: TeamsUserCredentialAuthConfig = {
  //   clientId: config.clientId!,
  //   initiateLoginEndpoint: config.initiateLoginEndpoint,
  // };
  // console.log(authConfig);
  // async function sendNotification() {
  //   try {
  //     const teamsUserCredential = new TeamsUserCredential(authConfig);
  //     const accessToken = await teamsUserCredential.getToken(""); // Get SSO token

  //     const endpoint = "http://localhost:7071/api/sendActivityNotification";

  //     const response = await fetch(endpoint, {
  //       method: "POST", // Use POST if required by your function
  //       headers: {
  //         Authorization: `Bearer ${accessToken!.token}`,
  //         "Content-Type": "application/json",
  //       },
  //     });

  //     const data = await response.json();
  //     console.log("Response:", data);

  //     if (response.ok) {
  //       alert("Notification sent successfully!");
  //     } else {
  //       alert(
  //         "Failed to send notification: " + (data.error || "Unknown error")
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error sending notification:", error);
  //     alert("Error sending notification.");
  //   }
  // }

  return fetchUserError ? (
    <div className="network-error">
      <h1>Network Error</h1>
    </div>
  ) : (
    <ThemeProvider
      theme={theme}
      colorMode={`${
        themeString === "default"
          ? "light"
          : themeString === "dark"
          ? "dark"
          : "light"
      }`}
    >
      <div
        className={`container ${
          themeString === "default"
            ? "light"
            : themeString === "dark"
            ? "dark"
            : "contrast"
        }`}
      >
        <Authenticator>
          {({}) => (
            <div>
              <Navbar
                openSidebar={openSidebar}
                setOpenSidebar={setOpenSidebar}
                selectedSection={selectedSection}
              />
              <Sidebar
                openSidebar={openSidebar}
                selectedSection={selectedSection}
                setSelectedSection={setSelectedSection}
              />
              <div className={`table ${openSidebar ? "table-shrink" : ""}`}>
                <RecordTable selectedSection={selectedSection} />
                {/* )} */}
                {/* <div>{user?.signInDetails?.loginId}</div>
                <Button onClick={signOut} appearance="primary">
                  Sign Out
                </Button> */}
                {/* <Button onClick={() => sendNotification()}>Notify</Button> */}
              </div>
            </div>
          )}
        </Authenticator>
      </div>
    </ThemeProvider>
  );
}

// ,
//     "activities": {
//         "activityTypes": [
//             {
//                 "type": "taskCreated",
//                 "description": "Task Created Activity",
//                 "templateText": "{actor} created task {taskId} for you"
//             },
//             {
//                 "type": "approvalRequired",
//                 "description": "Deployment requires your approval",
//                 "templateText": "{actor} created a new deployment {deploymentId}"
//             }
//         ]
//     },
//     "authorization": {
//         "permissions": {
//             "resourceSpecific": [
//                 {
//                     "type": "Application",
//                     "name": "TeamsActivity.Send.User"
//                 },
//                 {
//                     "type": "Application",
//                     "name": "TeamsActivity.Send.Group"
//                 },
//                 {
//                     "type": "Application",
//                     "name": "TeamsActivity.Send.Chat"
//                 }
//             ]
//         }
//     }
