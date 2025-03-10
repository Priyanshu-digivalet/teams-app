import "./Sidebar.css";
import { MenuItem, MenuList } from "@fluentui/react-components";

export const Sidebar = ({
  openSidebar,
  selectedSection,
  setSelectedSection,
}: {
  openSidebar: boolean;
  selectedSection: string;
  setSelectedSection: React.Dispatch<React.SetStateAction<string>>;
}) => {
  // console.log(selectedSection);
  return (
    <div className={` sidebar ${openSidebar ? "open-sidebar" : ""}`}>
      <MenuList>
        <MenuItem
          onClick={() => {
            setSelectedSection("Upcoming");
          }}
          className={selectedSection === "Upcoming" ? "active" : ""}
        >
          Upcoming
        </MenuItem>
        <MenuItem
          onClick={() => {
            setSelectedSection("Past");
          }}
          className={selectedSection === "Past" ? "active" : ""}
        >
          Past
        </MenuItem>
      </MenuList>
    </div>
  );
};
