import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
  useMsal
} from "@azure/msal-react";

import { ProfileContent } from "./ProfileContent";

export const MainContent = () => {
  return (
    <div className="App">
      <AuthenticatedTemplate>
        <ProfileContent />
      </AuthenticatedTemplate>

      <UnauthenticatedTemplate>
        <h5>
          <center>Please sign-in to see your profile information.</center>
        </h5>
      </UnauthenticatedTemplate>
    </div>
  );
};
