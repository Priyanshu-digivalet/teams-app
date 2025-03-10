import { gql } from "@apollo/client";

export const addOfficeVisit = gql`
  mutation AddOfficeVisit($input: AddOfficeVisitInput!) {
    addOfficeVisit(input: $input) {
      id
      response {
        visitCode
      }
    }
  }
`;

export const updateOfficeVisitStatusById = gql`
  mutation UpdateOfficeVisitStatusById(
    $input: UpdateOfficeVisitStatusByIdInput!
  ) {
    updateOfficeVisitStatusById(input: $input) {
      status
    }
  }
`;

export const updateOfficeVisitorById = gql`
  mutation UpdateOfficeVisitorById($input: UpdateOfficeVisitorInput!) {
    updateOfficeVisitorById(input: $input) {
      status
    }
  }
`;
