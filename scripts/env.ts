import { config as envConfig } from "dotenv";
import { config as innenuConfig } from "innenu-generator";

envConfig();
innenuConfig({
  assets: "https://assets.innenu.com/",
  icon: "https://res.innenu.com/icons/",
  mapFolder: "./data/function/map",
  mapKey: "NLVBZ-PGJRQ-T7K5F-GQ54N-GIXDH-FCBC4",
});
