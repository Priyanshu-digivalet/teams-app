import {
  Avatar,
  DataGridBody,
  DataGridRow,
  DataGrid,
  DataGridHeader,
  DataGridHeaderCell,
  DataGridCell,
  TableCellLayout,
  TableColumnDefinition,
  createTableColumn,
  Menu,
  MenuTrigger,
  Button,
  MenuPopover,
  MenuList,
  MenuItem,
  Spinner,
} from "@fluentui/react-components";
import {
  EditRegular,
  EyeRegular,
  MoreHorizontalRegular,
} from "@fluentui/react-icons";
import { ColumnOptions, Visitor } from "../../types";
import "./RecordTable.css";
import { VisitorDetailModal } from "../visitorDetailsModal/VisitorDetailModal";
import moment from "moment";
import { useEffect, useState } from "react";
import { StatusDropdown } from "../statusDropdown/StatusDropdown";
import { useVisitors } from "../../graphql/hooks/hooks";

export const RecordTable = ({
  selectedSection,
}: {
  selectedSection: string;
}) => {
  const [selectedItem, setSelectedItem] = useState<Visitor>();
  const [isVisitorDetailModalOpen, setIsVisitorDetailModalOpen] =
    useState(false);

  const { loadingVisitors, viditorData, refetch } =
    useVisitors(selectedSection);

  useEffect(() => {
    console.log("calling refetch");
    refetch();
  }, [selectedSection, refetch]);

  const tableHeaderStyle: Record<string, ColumnOptions> = {
    visitorName: { minWidth: "21%", maxWidth: "21%" },
    email: { minWidth: "21%", maxWidth: "21%" },
    dateAndTime: { minWidth: "19.6%", maxWidth: "19.6%" },
    // visitorType: { minWidth: "11.6%", maxWidth: "11.6%" },
    // location: { minWidth: "11.6%", maxWidth: "11.6%" },
    status: { minWidth: "130px", maxWidth: "130px" },
    more: { minWidth: "50px", maxWidth: "50px" },
  };
  const columns: TableColumnDefinition<Visitor>[] = [
    createTableColumn<Visitor>({
      columnId: "visitorName",
      renderHeaderCell: () => {
        return <p style={{ fontSize: "12px" }}>Visitor</p>;
      },
      renderCell: (item) => {
        return (
          <TableCellLayout
            truncate
            media={
              <Avatar
                aria-label={item.officeVisitor.fullName}
                name={item.officeVisitor.fullName}
                color="colorful"
              />
            }
          >
            {item?.officeVisitor?.fullName ? item.officeVisitor.fullName : "-"}
          </TableCellLayout>
        );
      },
    }),
    createTableColumn<Visitor>({
      columnId: "email",
      renderHeaderCell: () => {
        return <p style={{ fontSize: "12px" }}>Email</p>;
      },
      renderCell: (item) => {
        return (
          <TableCellLayout truncate>
            {item?.officeVisitor?.email ? item.officeVisitor.email : "-"}
          </TableCellLayout>
        );
      },
    }),
    createTableColumn<Visitor>({
      columnId: "dateAndTime",
      renderHeaderCell: () => {
        return <p style={{ fontSize: "12px" }}>Date & Time</p>;
      },
      renderCell: (item) => {
        return (
          <TableCellLayout truncate>
            {item?.startDate
              ? `${moment(item.startDate).format("DD MMM")}, ${moment(
                  item.startTime,
                  "HH:mm"
                ).format("hh:mm	A")} ${item?.endTime ? "-" : ""} ${
                  item?.endTime
                    ? moment(item.endTime, "HH:mm").format("hh:mm	A")
                    : ""
                }`
              : "-"}
          </TableCellLayout>
        );
      },
    }),
    createTableColumn<Visitor>({
      columnId: "visitorType",
      renderHeaderCell: () => {
        return <p style={{ fontSize: "12px" }}>Visitor Type</p>;
      },
      renderCell: (item) => {
        return (
          <TableCellLayout truncate>
            {item?.officeVisitorType?.name ? item.officeVisitorType.name : "-"}
          </TableCellLayout>
        );
      },
    }),
    createTableColumn<Visitor>({
      columnId: "location",
      renderHeaderCell: () => {
        return <p style={{ fontSize: "12px" }}>Location</p>;
      },
      renderCell: (item) => {
        return (
          <TableCellLayout truncate>
            {item?.locationName ? item.locationName : "-"}
          </TableCellLayout>
        );
      },
    }),
    createTableColumn<Visitor>({
      columnId: "status",
      renderHeaderCell: () => {
        return <p style={{ fontSize: "12px" }}>Status</p>;
      },

      renderCell: (item) => {
        return <StatusDropdown item={item} />;
      },
    }),
    createTableColumn<Visitor>({
      columnId: "more",
      renderHeaderCell: () => {
        return "";
      },
      renderCell: (item) => {
        return (
          <div
            style={{ width: "100%", display: "flex", justifyContent: "right" }}
          >
            <Menu>
              <MenuTrigger disableButtonEnhancement>
                <Button
                  className="more-button"
                  icon={<MoreHorizontalRegular />}
                ></Button>
              </MenuTrigger>
              <MenuPopover>
                <MenuList>
                  <MenuItem
                    icon={<EyeRegular />}
                    onClick={() => {
                      setIsVisitorDetailModalOpen(true);
                      setSelectedItem({ ...item });
                      // console.log("clicked menu");
                    }}
                  >
                    View Details
                  </MenuItem>
                  <MenuItem icon={<EditRegular />}>Edit</MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu>
          </div>
        );
      },
    }),
  ];

  return loadingVisitors ? (
    <div className="loading">
      <Spinner size="large" />
    </div>
  ) : (
    <>
      <DataGrid
        items={viditorData?.getOfficeVisits?.records || []}
        // items={visitorData}
        columns={columns}
        style={{
          minWidth: "550px",
          maxHeight: "calc(100vh - 56px)",
          overflowY: "auto",
        }}
      >
        <DataGridHeader>
          <DataGridRow>
            {({ columnId, renderHeaderCell }) => (
              <DataGridHeaderCell style={tableHeaderStyle[String(columnId)]}>
                {renderHeaderCell()}
              </DataGridHeaderCell>
            )}
          </DataGridRow>
        </DataGridHeader>
        <DataGridBody<Visitor>>
          {({ item, rowId }) => (
            <DataGridRow<Visitor> key={rowId}>
              {({ columnId, renderCell }) => (
                <DataGridCell style={tableHeaderStyle[String(columnId)]}>
                  {renderCell(item)}
                </DataGridCell>
              )}
            </DataGridRow>
          )}
        </DataGridBody>
      </DataGrid>
      {isVisitorDetailModalOpen ? (
        <VisitorDetailModal
          isVisitorDetailModalOpen={isVisitorDetailModalOpen}
          setIsVisitorDetailModalOpen={setIsVisitorDetailModalOpen}
          data={selectedItem}
        />
      ) : (
        ""
      )}
    </>
  );
};
