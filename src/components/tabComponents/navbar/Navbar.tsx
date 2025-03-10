import {
  FilterRegular,
  SearchFilled,
  TextAlignJustifyRegular,
} from "@fluentui/react-icons";
import "./Navbar.css";
import { Input, useId } from "@fluentui/react-components";
import { FormModal } from "../formModal/FormModal";

export const Navbar = ({
  openSidebar,
  setOpenSidebar,
  selectedSection,
}: {
  openSidebar: boolean;
  setOpenSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSection: string;
}) => {
  const inputId = useId("input-with-placeholder");
  return (
    <nav className="navbar">
      <div className="nav-item-align">
        <TextAlignJustifyRegular
          className="burgur-icon"
          onClick={() => setOpenSidebar(!openSidebar)}
        />
        <p>
          {`Visitor >`} <b>{selectedSection}</b>
        </p>
      </div>
      <div className="nav-item-align">
        <div className="filter">
          <FilterRegular className="filter-icon" />
          <p>Filter</p>
        </div>
        <div className="search-input-field">
          {/* <input type="text" name="" id="" placeholder="Search" /> */}
          <Input appearance="filled-darker" placeholder="Search" id={inputId} />
          <SearchFilled className="search-icon" />
        </div>
        <FormModal />
      </div>
    </nav>
  );
};
