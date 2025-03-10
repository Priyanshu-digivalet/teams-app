import { useMutation, useQuery } from "@apollo/client";
import {
  fetchExistingUser,
  getCustomFields,
  getOfficeVisitorTypes,
  getOfficeVisits,
  getPropertyLocations,
} from "../queries/queries";
import {
  addOfficeVisit,
  updateOfficeVisitStatusById,
} from "../mutations/mutations";
import moment from "moment";
import { USER_EMAIL } from "../../assets/constants/constants";

export let projectId = "";
export let propertyId = "";
export let behaviorId = "";
export let tenentId = "";

export const useFetchExistingUser = () => {
  const { loading, data, error } = useQuery(fetchExistingUser, {
    variables: {
      input: {
        email: USER_EMAIL,
      },
    },
  });
  if (error) {
    console.log(error);
    alert("Network Error");
  }
  if (!loading) {
    projectId =
      data.fetchExistingUser[0].userIdentityBehaviorMapping[0].projectId;
    propertyId =
      data.fetchExistingUser[0].userIdentityBehaviorMapping[0].propertyId;
    behaviorId =
      data.fetchExistingUser[0].userIdentityBehaviorMapping[0].behaviorId;
  }
  console.log("at hook: ", projectId, propertyId, behaviorId);
  return { loadingExistingUserData: loading, fetchUserError: error };
};

export const useVisitors = (selectedSection: string) => {
  const filter =
    selectedSection === "Upcoming"
      ? {
          by: "START_DATE",
          values: [
            moment(new Date().toLocaleDateString(), "DD/MM/YYYY").format(
              "YYYY-MM-DD"
            ),
          ],
        }
      : {
          by: "END_DATE",
          values: [
            moment(new Date().toLocaleDateString(), "DD/MM/YYYY").format(
              "YYYY-MM-DD"
            ),
          ],
        };
  const { loading, error, data, refetch } = useQuery(getOfficeVisits, {
    variables: {
      input: {
        projectId: projectId,
        propertyId: propertyId,
        options: {
          filters: [
            {
              by: "EMPLOYEE_ID",
              values: behaviorId,
            },
            filter,
          ],
          sorting: {
            by: "VISIT_DATE",
            order: "ASC",
          },
        },
      },
    },
    fetchPolicy: "no-cache",
  });
  if (error) {
    console.log(error);
  }
  if (!loading) {
    tenentId = data?.getOfficeVisits?.records[0].tenantId;
  }
  return { loadingVisitors: loading, viditorData: data, refetch };
};

export const useVisitorTypes = () => {
  const { loading, data, error } = useQuery(getOfficeVisitorTypes, {
    variables: {
      input: {
        projectId: projectId,
        propertyId: propertyId,
      },
    },
  });

  if (error) {
    console.log(error);
  }

  return { loadingVisitorTypesData: loading, visitorTypesData: data };
};

export const usePropertyLocations = () => {
  const { loading, data, error } = useQuery(getPropertyLocations, {
    variables: {
      input: {
        projectId: projectId,
        propertyId: propertyId,
      },
    },
  });

  if (error) {
    console.log(error);
  }

  return { loadingVisitorLocationsData: loading, visitorLocationsData: data };
};

export const useCustomFields = (resourceTypeId: string) => {
  const { loading, data, error } = useQuery(getCustomFields, {
    variables: {
      input: {
        options: {
          filters: [
            {
              by: "RESOURCE_TYPE",
              values: "VISITOR_TYPE",
            },
            {
              by: "RESOURCE_TYPE_ID",
              values: `${resourceTypeId}`,
            },
          ],
        },
      },
    },
    skip: !resourceTypeId,
  });

  if (error) {
    console.log(error);
  }

  return { loadingCustomFieldsData: loading, customFieldsData: data };
};

export const useAddOfficeVisit = () => {
  const [addData, { data, loading, error }] = useMutation(addOfficeVisit);
  const addOfficeVisitorFunction = (formData: any, customFieldsData: any) => {
    addData({
      variables: {
        input: {
          projectId: projectId,
          propertyId: propertyId,
          employeeId: behaviorId,
          tenantId: tenentId,
          officeVisitTypeId: formData.officeVisitorType,
          locationId: formData?.locationId,
          locationName: formData?.locationName,
          startDate: moment(formData?.startDate).format("YYYY-MM-DD"),
          startTime: moment(formData?.startTime, "hh:mm A").format("HH:mm"),
          officeVisitors: [
            {
              fname: formData.fname,
              lname: formData.lname,
              email: formData.email,
              projectId: projectId,
              propertyId: propertyId,
              title: formData.title,
            },
          ],
          customFieldValues: customFieldsData?.getCustomFields.map(
            (field: any) => {
              return {
                id: `${field.id}`,
                value: formData?.[field.id],
              };
            }
          ),
        },
      },
      refetchQueries: [getOfficeVisits],
    });
  };
  if (error) {
    console.log(error);
  }

  return {
    loadingaddVisitorData: loading,
    addVisitorData: data,
    addOfficeVisitorFunction,
    addVisitorDataError: error,
  };
};

export const useUpdateVisitorStatus = () => {
  const [updateOfficeVisitorStatus, { loading, error }] = useMutation(
    updateOfficeVisitStatusById
  );
  const updateStatus = (id: string, status: string) => {
    updateOfficeVisitorStatus({
      variables: {
        input: {
          id: id,
          projectId: projectId,
          propertyId: propertyId,
          status: status,
        },
      },
    });
  };
  const updateStatusFromModal = (id: string, status: string) => {
    updateOfficeVisitorStatus({
      variables: {
        input: {
          id: id,
          projectId: projectId,
          propertyId: propertyId,
          status: status,
        },
      },
      refetchQueries: [getOfficeVisits],
    });
  };
  if (error) {
    console.log(error);
  }
  return {
    loadingUpdateVisitorStatus: loading,
    updateStatusError: error,
    updateStatus,
    updateStatusFromModal,
  };
};

// export const useSearchEmailVisitor = () => {
//   const { loading, data, error } = useQuery(getOfficeVisitors, {
//     variables: {
//       input: {
//         projectId: projectId,
//         propertyId: propertyId,
//         // options: {
//         //   search: `${email}`,
//         //   count: 100,
//         //   page: 1,
//         // },
//       },
//     },
//     // skip: !email,
//   });

//   if (error) {
//     console.log(error);
//   }

//   return { loadingSearchEmailData: loading, searchEmailData: data };
// };
