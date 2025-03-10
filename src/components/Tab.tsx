import { useContext, useEffect, useState } from "react";
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
// import { useVisitors } from "./graphql/hooks/hooks";
// import { Spinner } from "@fluentui/react-components";
// import { ExampleForm } from "./tabComponents/formModal/ExampleForm";

export default function Tab() {
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [selectedSection, setSelectedSection] = useState("Upcoming");
  const { themeString } = useContext(TeamsFxContext);
  // const { loadingVisitors, viditorData, refetch } =
  //   useVisitors(selectedSection);

  const theme = {
    name: "my-theme",
    overrides: [defaultDarkModeOverride],
  };

  // useEffect(() => {
  //   console.log("calling refetch");
  //   refetch();
  // }, [selectedSection, refetch]);

  return (
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
                {/* {loadingVisitors ? (
                  <Spinner />
                ) : ( */}
                <RecordTable
                  // viditorData={viditorData?.getOfficeVisits?.records}
                  // loadingVisitors={loadingVisitors}
                  selectedSection={selectedSection}
                />
                {/* )} */}
                {/* <ExampleForm /> */}
                {/* <div>{user?.signInDetails?.loginId}</div>
                <Button onClick={signOut} appearance="primary">
                  Sign Out
                </Button> */}
              </div>
            </div>
          )}
        </Authenticator>
      </div>
    </ThemeProvider>
  );
}
