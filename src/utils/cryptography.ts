import { getSecretValue } from "./key-vault";
import { AES, enc, mode, pad, lib, PBKDF2, SHA256, SHA512 } from "crypto-js";

export let privateKey: lib.WordArray | null = null;

export const decryptLicense = async (encryptedLicenseKey: string): Promise<string> => {
  const { encryptedValue, iv } = splitEncryptedValueAndIv(encryptedLicenseKey);
  return AES.decrypt(encryptedValue, await getPrivateKey(), {
    iv: iv,
    mode: mode.CBC,
    padding: pad.Pkcs7,
  }).toString(enc.Utf8);
};

export const getLicenseHash = (plainLicenseKey: string): string => {
  return hashLicenseKey(plainLicenseKey);
};

const splitEncryptedValueAndIv = (encryptedLicenseKey: string) => {
  const encryptedValue: string = encryptedLicenseKey.slice(96);
  const plainIv: string = encryptedLicenseKey.slice(64, 96);
  return {
    encryptedValue,
    iv: enc.Hex.parse(plainIv),
  };
};

export const hashLicenseKey = (plainLicenseKey: string, useSha512 = false): string => {
  if (useSha512) {
    return SHA512(plainLicenseKey).toString(enc.Hex);
  } else {
    return SHA256(plainLicenseKey).toString(enc.Hex);
  }
};

const getPrivateKey = async (): Promise<lib.WordArray> => {
  if (privateKey) {
    return privateKey;
  }
  return generateDeterministicPrivateKey();
};

const generateDeterministicPrivateKey = async (): Promise<lib.WordArray> => {
  const password = await getSecretValue(process.env.SECRET_VALUE);
  if (!password) {
    throw new Error(`Secret '${process.env.SECRET_VALUE}' not found in Azure Key Vault`);
  }

  const salt = password.repeat(2);
  const bytes = PBKDF2(password, salt, {
    keySize: 32,
    iterations: 128,
  });
  return enc.Hex.parse(bytes.toString());
};
