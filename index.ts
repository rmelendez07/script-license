import {
  inspectLicensesWithEncryptLicense,
  inspectLicenseWithDecryptLicense,
} from "./src/common/update-licenses";

const args: string[] = process.argv;

if (args.length === 4) {
  switch (args[2].toLowerCase()) {
    case "-d":
      inspectLicenseWithDecryptLicense(args[3]);
      break;
    case "-e":
      inspectLicensesWithEncryptLicense(args[3]);
      break;
    default:
      console.log("Type a valid command '-d' or '-e'.");
      break;
  }
} else {
  console.log(
    "Add command '-d' to inspect a normal license or '-e' to inspect a encrypt license, after add the license."
  );
}

