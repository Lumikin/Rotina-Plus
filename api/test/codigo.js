import * as crypto from "crypto";
const codigo = crypto.randomBytes(3).toString("hex");
console.log(codigo);
