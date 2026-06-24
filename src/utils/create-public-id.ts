import crypto from "crypto";
import environment from "../config/environment";

export let createPublicId = () =>
crypto.randomBytes(+environment.RANDOM_BYTES_FOR_PUBLIC_ID).toString("hex"); // 16 bytes