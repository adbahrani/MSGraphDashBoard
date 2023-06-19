import React, { useEffect } from "react";
/**
 * Renders information about the user obtained from MS Graph
 * @param props
 */

interface user {
  businessPhones: [];
  displayName: string;
  givenName: string;
  id: string;
  jobTitle: string;
  mail: string;
  mobilePhone: string;
  officeLocation: string;
  preferredLanguage: string;
  surname: string;
  userPrincipalName: string;
}

export const Users = (props: any) => {
  const { guests, members } = props;

  useEffect(() => {
    console.log("guests", guests);
    console.log("members", members);
  }, [guests, members]);

  return (
    <>
      <p>List</p>
      {/* make a list of all user data to show   */}

      <p> Number of Guests: {guests.length}</p>
      <p> Number of Members: {members.length}</p>
      {/* <ul>
        {users?.value?.map((u: user) => (
          <div id="profile-div">
            <p>
              <strong>First Name: </strong> {u.givenName}
            </p>
            <p>
              <strong>Last Name: </strong> {u.surname}
            </p>
            <p>
              <strong>Email: </strong> {u.userPrincipalName}
            </p>
            <p>
              <strong>Id: </strong> {u.id}
            </p>
            <p>
              <strong>Mail: </strong> {u.mail}
            </p>
            <p>
              <strong>jobTitle: </strong> {u.businessPhones}
            </p>
          </div>
        ))}
      </ul> */}
    </>
  );
};
