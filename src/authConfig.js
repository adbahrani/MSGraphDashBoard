/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { LogLevel } from "@azure/msal-browser";

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 */
export const settings = {
  clientId: "5107c906-38b3-4cef-b630-7fd01f814ed9",

  clientSecret: "AaB8Q~dsf1cz-S77NUzfrK5.SKw2GKVTKsd4Vc_z",
  tenantId: "a6dfed0e-808d-4a2e-ae4f-9adac874f50d",
  secretId: "6fd170a8-5a08-4427-a306-8af59c6c7261",
  secretValue: "_hh8Q~9m7BST~c_zvzkFSHfOtPayCJDT2wbxqc_O"
};

export const msalConfig = {
  auth: {
    clientId: `${settings.clientId}`,
    authority: `https://login.microsoftonline.com/${settings.tenantId}`,
    redirectUri: "http://localhost:3000"
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false // Set this to "true" if you are having issues on IE11 or Edge
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        // switch (level) {
        //   case LogLevel.Error:
        //     console.error(message);
        //     return;
        //   case LogLevel.Info:
        //     console.info(message);
        //     return;
        //   case LogLevel.Verbose:
        //     console.debug(message);
        //     return;
        //   case LogLevel.Warning:
        //     console.warn(message);
        //     return;
        //   default:
        //     return;
        //}
      }
    }
  }
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: ["User.Read"]
};

/**
 * Add here the scopes to request when obtaining an access token for MS Graph API. For more information, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
  application: "https://graph.microsoft.com/v1.0/applications",
  usersEndGuest: `https://graph.microsoft.com/v1.0/users?$filter=usertype eq 'member'`,
  usersEndMember: `https://graph.microsoft.com/v1.0/users?$filter=usertype eq 'guest'`
};
