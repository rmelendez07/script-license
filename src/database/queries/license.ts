import prisma from "../db";

export const getLicense = async (licenseKey: string) =>
  await prisma.license.findFirst({
    where: {
      licenseKey
    },
  });

export const getLicenseLikeClause = async (licenseKey: string) =>
  await prisma.license.findFirst({
    where: {
      licenseKey: {
        contains: licenseKey
      }
    },
  });
