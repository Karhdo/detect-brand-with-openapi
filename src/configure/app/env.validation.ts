import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

import { EnvironmentConfig } from './schemas';
import { getConfigErrorMessage, displayConfigErrorMessage } from 'common/utils';

export default function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentConfig, config);

  const schemaErrors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  const errors = getConfigErrorMessage(schemaErrors);

  if (errors.length > 0) {
    const displayErrorMessages = displayConfigErrorMessage(errors, {
      stopAtFirstError: true,
    });

    throw new Error(displayErrorMessages);
  }

  return validatedConfig;
}
