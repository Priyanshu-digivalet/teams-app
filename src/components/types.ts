export type ColumnOptions = {
  minWidth: string;
  maxWidth: string;
};
export type Status = "Pending" | "Accept" | "Reject";
// export type Visitor = {
//   //   file: FileCell;
//   //   lastUpdated: LastUpdatedCell;
//   //   lastUpdate: LastUpdateCell;
//   name: string;
//   email: string;
//   dateAndTime: string;
//   visitorType: string;
//   location: string;
//   status: Status;
//   style?: any;
// };
export type Visitor = {
  // totalCount: number;
  // records: {
  locationId: string;
  locationName: string;
  startDate: string;
  startTime: string;
  endTime: string;
  status: string;
  visitCode: string;
  id: string;
  officeVisitorType: {
    name: string;
    id: string;
  };
  officeVisitor: {
    id: string;
    email: string;
    fullName: string;
    title: string;
    fname: string;
    lname: string;
  };
  customFields: {
    label: string;
    value: string;
  }[];
  // };
};
export type VisitorType = {
  name: string;
  id: string;
};
export type VisitorLocationType = {
  name: string;
  id: string;
};
export type EmailSearchType = {
  email: string;
  fname: string;
  lname: string;
};

export type FormDataType = {
  email: string;
  fname: string;
  gg?: string;
  lname: string;
  locationName: string;
  officeVisitorType: string;
  startDate: string;
  startTime: string;
};
