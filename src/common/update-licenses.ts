import { getLicense, getLicenseLikeClause } from "../database/queries/license";
import { decryptLicense, getLicenseHash } from "../utils/cryptography";
import urljoin from "url-join";
import axios from "axios";

export const getLicensingApiEndpoint = (licenseKey: string) =>
  urljoin(
    process.env.API_LICENSE,
    "/api",
    urljoin("licenses", process.env.FUNCTION_API, licenseKey)
  );

export const inspectLicenseWithDecryptLicense = async (licenseKey: string) => {
  const endpoint = getLicensingApiEndpoint(licenseKey);
  const response = await axios.get(endpoint);
    if (response.status === 200) {
      const { data } = response;
      const licenseHash = getLicenseHash(data.licenseKey);
      const licenseInformation = await getLicenseLikeClause(licenseHash);
      if (licenseInformation) {
        console.log(
          "\n\n----------------------------------------------------------------------------------------------------------------------------------"
        );
        console.log(`License Key: ${licenseKey}`);
        console.log('\x1b[32m%s\x1b[0m', "\nSuccess: License was found.\n");
        console.log(`License Information from Generic Infrastructure Database: ${JSON.stringify(data, null, " ")}\n`);
        console.log(`License Information from BDS Database: ${JSON.stringify(licenseInformation, null, " ")}\n`);
        console.log(
          "----------------------------------------------------------------------------------------------------------------------------------\n"
        );
      } else {
        console.log('\x1b[31m%s\x1b[0m', `\nError: License with ${licenseHash} was not found.\n`);
      }
    } else {
      console.log('\x1b[31m%s\x1b[0m', `\nError: ${response.data.message}`);
    }
  console.log("\nFinished.\n\n");
}

export const inspectLicensesWithEncryptLicense = async (
  encryptLicense: string
) => {
  const license = await getLicense(encryptLicense);
  if (license) {
    const licenseKey = await decryptLicense(license.licenseKey);
    if (licenseKey != "") {
      const endpoint = getLicensingApiEndpoint(licenseKey);
      const response = await axios.get(endpoint);
      if (response.status === 200) {
        const { data } = response;
        console.log(
          "\n\n----------------------------------------------------------------------------------------------------------------------------------"
        );
        console.log(`License Key: ${licenseKey}`);
        console.log(
          "\x1b[32m%s\x1b[0m",
          "\nSuccess: License was found and decrypt.\n"
        );
        console.log(`License Information: ${JSON.stringify(data, null, " ")}\n`);
        console.log(
          "----------------------------------------------------------------------------------------------------------------------------------\n"
        );
      } else {
        console.log("\x1b[31m%s\x1b[0m", `\nError: ${response.data.message}`);
      }
    }
    console.log("\nFinished.\n\n");
  } else {
    console.log(
      "\x1b[31m%s\x1b[0m",
      `\nError: License with ${encryptLicense} was not found.\n`
    );
  }
};
