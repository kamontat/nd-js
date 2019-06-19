/**
 * @internal
 * @module nd.config.model
 */

import Config from "./Config";

export interface ConfigFileType {
  version: number;
  security: {
    token: string;
    fullname: string;
  };
  setting: {
    output: "long" | "short";
    color: boolean;
    location: string;
  };
}

export const generateYaml = (config: Config) => {
  return `version: ${config.getVersion().toString()}
security: 
  token: ${config.getToken()}
  fullname: ${config.getFullname()}
setting:
  output: ${config.getOutputType()}
  color: ${config.getColor().toString()}
  location: ${config.getNovelLocation()}
`;
};
