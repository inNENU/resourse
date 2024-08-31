import cpx from "cpx2";

export const copyService = (): void => {
  cpx.copySync("./service/**", "./.resource/service");
};
