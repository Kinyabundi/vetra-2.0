import { Entity, Schema } from "redis-om";

class VaultItem extends Entity {}

const vaultSchema = new Schema(
  VaultItem,
  {
    owner: {
      type: "string",
    },
    encryptedSecret: {
      type: "string",
    },
    created: {
      type: "number",
    },
  },
  {
    prefix: "vetra:vault",
  }
);

export default vaultSchema;
