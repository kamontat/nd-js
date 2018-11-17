/**
 * @internal
 * @module nd.config.model
 */

import Config from "./Config";

export interface ConfigFileType {
  version: number;
  security: {
    token: string;
    username: string;
  };
  setting: {
    output: "long" | "short";
    color: boolean;
    location: string;
  };
}

export const DEFAULT_CONFIG_YAML = (config: Config) => {
  return `version: ${config.getVersion().toString()}
security: 
  token: ${config.getToken()}
  username: ${config.getUsername()}
setting:
  output: ${config.getOutputType()}
  color: ${config.getColor().toString()}
  location: ${config.getNovelLocation()}
`;
};
