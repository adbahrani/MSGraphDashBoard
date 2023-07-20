import React, { useState } from "react";

import { loginRequest } from "../authConfig";
import {
  callMsGraph,
  callMsGraphUsers,
  callMsGraphUsersGuest,
  callMsGraphUsersMembers
} from "../graphHelper";

import { useMsal } from "@azure/msal-react";
import Button from "react-bootstrap/Button";
import { ProfileData } from "./ProfileData";
import { Users } from "./Users";

export const ProfileContent = () => {
  const { instance, accounts } = useMsal();
  const [graphData, setGraphData] = useState(null);
  const [guests, setGuests] = useState([]);
  const [members, setMembers] = useState([]);
  function RequestProfileData() {
    // Silently acquires an access token which is then attached to a request for MS Graph data
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0]
      })
      .then(response => {
        callMsGraph(response.accessToken).then(response =>
          setGraphData(response)
        );
      });
  }

  const getUsersByType = () => {
    RequestGuestUsers();
    RequestMembersUsers();
  };
  function RequestGuestUsers() {
    // Silently acquires an access token which is then attached to a request for MS Graph data
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0]
      })
      .then(response => {
        callMsGraphUsersGuest(response.accessToken).then(response =>
          setGuests(response.value)
        );
      });
  }

  function RequestMembersUsers() {
    // Silently acquires an access token which is then attached to a request for MS Graph data
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0]
      })
      .then(response => {
        callMsGraphUsersMembers(response.accessToken).then(response =>
          setMembers(response.value)
        );
      });
  }

  return (
    <>
      <h5 className="card-title">Welcome {accounts[0].name}</h5>
      <br />
      <Users guests={guests} members={members} />
      {graphData ? (
        <>
          <ProfileData graphData={graphData} />
        </>
      ) : (
        <>
          <Button variant="secondary" onClick={RequestProfileData}>
            Request Profile Information
          </Button>
          <Button variant="secondary" onClick={getUsersByType}>
            Request Users
          </Button>
        </>
      )}
    </>
  );
};
