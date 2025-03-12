import { Dropdown, Option } from "@fluentui/react-components";
import { ChevronDownFilled, CircleFilled } from "@fluentui/react-icons";
import { Visitor } from "../../types";
import "./StatusDropdown.css";
import { useEffect, useState } from "react";
import { useUpdateVisitorStatus } from "../../graphql/hooks/hooks";

const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const selectionStyle: Record<
  string,
  { text: string; color: string; style: React.CSSProperties }
> = {
  CONFIRMED: {
    text: "Confirmed",
    color: "rgba(27, 131, 244, 1)",
    style: {
      backgroundColor: "rgba(27, 131, 244, 0.1)",
      border: "1px solid rgba(27, 131, 244, 1)",
    },
  },
  DENIED: {
    text: "Denied",
    color: "rgb(240, 59, 58)",
    style: {
      backgroundColor: "rgba(240, 58, 58, 0.1)",
      border: "1px solid rgb(240, 59, 58)",
    },
  },
  WAITING: {
    text: "Waiting",
    color: "rgba(161, 97, 20, 1)",
    style: {
      backgroundColor: "rgba(161, 97, 20, 0.1)",
      //   border: "1px solid rgb(89, 37, 220)",
    },
  },
  CHECKED_IN: {
    text: "Checked-In",
    color: "rgb(5, 169, 101)",
    style: {
      backgroundColor: "rgba(5, 169, 101, 0.1)",
      border: "1px solid rgb(5, 169, 101)",
    },
  },
  CHECKED_OUT: {
    text: "Checked-Out",
    color: "rgb(239, 92, 47)",
    style: {
      backgroundColor: "rgba(239, 92, 47, 0.1)",
      border: "1px solid rgb(239, 92, 47)",
    },
  },
  CANCELLED: {
    text: "Cancelled",
    color: "rgb(248, 134, 46)",
    style: {
      backgroundColor: "rgba(248, 134, 46, 0.1)",
      border: "1px solid rgb(248, 134, 46)",
    },
  },
  NO_SHOW: {
    text: "No Show",
    color: "",
    // color: "rgb(52, 64, 84)",
    style: {
      backgroundColor: "",
      // border: "1px solid rgb(234, 236, 240)"
    },
  },
};

const options = [
  {
    value: "CONFIRMED",
    text: "Confirmed",
    color: "rgba(27, 131, 244, 1)",
    style: { backgroundColor: "rgba(27, 131, 244, 0.1)" },
  },
  {
    value: "DENIED",
    text: "Denied",
    color: "rgb(240, 59, 58)",
    style: { backgroundColor: "rgba(240, 58, 58, 0.1)" },
  },
];

export const StatusDropdown = ({ item }: { item: Visitor }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string>(item.status);

  const { updateStatus, updateStatusError } = useUpdateVisitorStatus();

  useEffect(() => {
    setSelectedOption(item?.status);
  }, [item]);
  return (
    <div className="custom-dropdown">
      <Dropdown
        appearance="filled-darker"
        id={`dropdown-${item.visitCode}`}
        size="small"
        className={selectedOption !== "WAITING" ? "remove-bottom-border" : ""}
        expandIcon={
          selectedOption === "WAITING" ? (
            <ChevronDownFilled color={selectionStyle[selectedOption].color} />
          ) : null
        }
        style={selectionStyle[selectedOption!]?.style}
        open={isDropdownOpen}
        positioning={"below"}
        value={selectedOption}
        button={
          <div
            style={{
              color: selectionStyle[selectedOption!]?.color,
            }}
            className="dropdown-button"
          >
            {toTitleCase(selectedOption!)}
          </div>
        }
        onOpenChange={(_, data) => {
          if (selectedOption === "WAITING") {
            setIsDropdownOpen(data?.open);
          }
        }}
        onOptionSelect={(_, data) => {
          updateStatus(item.id, data.optionValue!);
          if (!updateStatusError) {
            setSelectedOption(data.optionValue!);
          }
        }}
      >
        {options.map((option) => (
          <Option
            key={option.value}
            value={option.value}
            checkIcon={null}
            style={option.style}
            children={
              <div className="option-div">
                <span style={{ color: option.color }}>
                  <CircleFilled />
                </span>
                <span className="option-text">{option.text}</span>
              </div>
            }
            text=""
          ></Option>
        ))}
      </Dropdown>
    </div>
  );
};
