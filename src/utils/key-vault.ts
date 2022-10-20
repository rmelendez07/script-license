import { AccessToken, GetTokenOptions } from "@azure/core-auth";
import { SecretClient } from "@azure/keyvault-secrets";
import { ConfidentialClientApplication } from "@azure/msal-node";

const keyVaultURI = process.env.AZURE_KEY_VAULT_URI;

const getToken = async (_scopes: string | string[], _options?: GetTokenOptions): Promise<AccessToken | null> => {
  const clientId = process.env.AZURE_CLIENT_ID;
  if (!clientId) throw new Error("AZURE_CLIENT_ID is missing!");

  const tokenRequest = {
    scopes: [process.env.SCOPE],
  };

  const cca = new ConfidentialClientApplication({
    auth: {
      clientId,
      clientSecret: process.env.AZURE_CLIENT_SECRET,
      authority: `https://login.microsoftonline.com/${process.env.AZURE_TENANT_ID}`,
    },
  });
  const tokenRes = await cca.acquireTokenByClientCredential(tokenRequest);

  if (!tokenRes) throw new Error("Get key vault token error!");
  return Promise.resolve({
    token: tokenRes.accessToken,
    expiresOnTimestamp: tokenRes.expiresOn?.getTime() ?? 0,
  });
};

const client = new SecretClient(keyVaultURI ?? "", { getToken });

export const getSecretValue = async (secretName: string) => {
  try {
    return (await client.getSecret(secretName)).value;
  } catch {
    return undefined;
  }
};
