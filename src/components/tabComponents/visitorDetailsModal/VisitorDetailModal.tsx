import {
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogContent,
  DialogBody,
  DialogActions,
  Button,
  Divider,
} from "@fluentui/react-components";
import Logo from "../../assets/images/digivaletLogo.svg";
import "./VisitorDetailModal.css";
import { Visitor } from "../../types";
import moment from "moment";
import { useUpdateVisitorStatus } from "../../graphql/hooks/hooks";

const toTitleCase = (str: string) => {
  return str
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
export const VisitorDetailModal = ({
  data,
  isVisitorDetailModalOpen,
  setIsVisitorDetailModalOpen,
}: {
  data: Visitor | undefined;
  isVisitorDetailModalOpen: boolean;
  setIsVisitorDetailModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { updateStatusFromModal, updateStatusError } = useUpdateVisitorStatus();
  return (
    <Dialog
      modalType="non-modal"
      open={isVisitorDetailModalOpen}
      onOpenChange={(_, { open }) => setIsVisitorDetailModalOpen(open)}
    >
      <DialogSurface
        aria-describedby={undefined}
        backdrop={
          <div
          // aria-hidden="true"
          // style={{
          //   boxShadow:
          //     "0px 8px 16px 0px #00000024, 0px 0px 2px 0px #0000001F",
          //   background: "black",
          // }}
          ></div>
        }
        style={{ maxWidth: "457px", padding: "32px", borderRadius: "4px" }}
      >
        <DialogBody>
          <DialogTitle>
            <div className="details-title-box">
              <img src={Logo} width={40} height={40} alt="" />
              <div className="details-tilte-text">
                <h4>Digivalet</h4>
                <p>Visitor Details</p>
              </div>
            </div>
          </DialogTitle>
          <DialogContent style={{ width: "105%" }}>
            <div className="details-body">
              <div className="body-section-header">
                <div>
                  <h1>
                    {data?.officeVisitor?.fullName
                      ? data?.officeVisitor?.fullName
                      : "-"}{" "}
                    {/* / {data?.visitCode ? data?.visitCode : "-"} */}
                  </h1>
                  <p>
                    {data?.officeVisitor?.email
                      ? data?.officeVisitor?.email
                      : "-"}
                  </p>
                </div>
                <div className="status-section">
                  <Divider vertical style={{ height: "100%" }} />
                  <div className="status-text">
                    <p>Status</p>
                    <h4>{data?.status ? toTitleCase(data?.status) : "-"}</h4>
                  </div>
                </div>
              </div>
              <Divider />
              <div className="body-section">
                <div className="grid-details">
                  <p>Visitor Type</p>
                  <h3>
                    {data?.officeVisitorType?.name
                      ? data?.officeVisitorType?.name
                      : "-"}
                  </h3>
                </div>
                <div className="grid-details">
                  <p>Meeting Location</p>
                  <h3>{data?.locationName ? data?.locationName : "-"}</h3>
                </div>
                <div className="grid-details">
                  <p>Visit Date</p>
                  <h3>
                    {data?.startDate
                      ? `${moment(data?.startDate).format("MMMM DD, YYYY")}`
                      : "-"}
                  </h3>
                </div>
                <div className="grid-details">
                  <p>Meeting Time</p>
                  <h3>
                    {data?.startTime
                      ? `${moment(data?.startTime, "HH:mm").format(
                          "hh:mm	A"
                        )} - ${moment(data?.endTime, "HH:mm").format("hh:mm	A")}`
                      : "-"}
                  </h3>
                </div>
              </div>
              {data?.customFields && <Divider />}
              {data?.customFields &&
                data?.customFields.map((field, index: number) => (
                  <div className="grid-details" key={index}>
                    <p>{field.label}</p>
                    <h3>{field.value}</h3>
                  </div>
                ))}
            </div>
          </DialogContent>
          {data?.status === "WAITING" && (
            <DialogActions>
              <Button
                appearance="secondary"
                onClick={() => {
                  updateStatusFromModal(data?.id!, "DENIED");
                  if (!updateStatusError) setIsVisitorDetailModalOpen(false);
                }}
              >
                Reject
              </Button>
              <Button
                type="submit"
                appearance="primary"
                onClick={() => {
                  updateStatusFromModal(data?.id!, "CONFIRMED");
                  if (!updateStatusError) setIsVisitorDetailModalOpen(false);
                }}
              >
                Accept
              </Button>
            </DialogActions>
          )}
        </DialogBody>
      </DialogSurface>
    </Dialog>
  );
};
