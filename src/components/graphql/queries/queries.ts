import { gql } from "@apollo/client";

export const fetchExistingUser = gql`
  query FetchExistingUser($input: FetchExistingUserInput!) {
    fetchExistingUser(input: $input) {
      email
      fullName
      userIdentityBehaviorMapping {
        projectId
        propertyId
        behaviorType
        behaviorId
      }
    }
  }
`;
export const getOfficeVisits = gql`
  query GetOfficeVisits($input: GetOfficeVisitsInput!) {
    getOfficeVisits(input: $input) {
      totalCount
      records {
        locationId
        locationName
        startDate
        startTime
        status
        endTime
        visitCode
        id
        tenantId
        officeVisitorType {
          name
          id
        }
        officeVisitor {
          id
          email
          fullName
          title
          fname
          lname
        }
        customFields {
          label
          value
        }
      }
    }
  }
`;
export const getOfficeVisitorTypes = gql`
  query GetOfficeVisitorTypes($input: GetOfficeVisitorTypesInput!) {
    getOfficeVisitorTypes(input: $input) {
      totalCount
      records {
        name
        id
      }
    }
  }
`;
export const getPropertyLocations = gql`
  query GetPropertyLocations($input: GetPropertyLocationsInput!) {
    getPropertyLocations(input: $input) {
      totalCount
      records {
        name
        id
      }
    }
  }
`;
export const getCustomFields = gql`
  query GetCustomFields($input: GetCustomFieldsInput!) {
    getCustomFields(input: $input) {
      config
      defaultValue
      defaultValueType
      fieldType
      description
      id
      isOptional
      label
      locale
      resourceType
      resourceTypeId
    }
  }
`;
export const getOfficeVisitors = gql`
  query GetOfficeVisitors($input: GetOfficeVisitorsInput!) {
    getOfficeVisitors(input: $input) {
      totalCount
      records {
        email
        fname
        lname
      }
    }
  }
`;
