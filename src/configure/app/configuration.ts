import { join } from 'path';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';

import validate from './env.validation';

const YAML_CONFIG_FILENAME = 'env.yaml';

export default () => {
  const filePath = join(__dirname, '../../config', YAML_CONFIG_FILENAME);
  let fileContent = readFileSync(filePath, 'utf8');

  // Replace placeholders in the raw file content before parsing
  fileContent = fileContent.replace(
    /\$\{(\w+)\}/g,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (_, envVar) => process.env[envVar] || '',
  );

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const config = load(fileContent) as Record<string, any>;

  const validatedConfig = validate(config);

  return validatedConfig;
};
