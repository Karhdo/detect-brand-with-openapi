import {
  ValidatorConstraintInterface,
  ValidatorConstraint,
  ValidationArguments,
  registerDecorator,
  validateSync,
} from 'class-validator';
import { ClassConstructor, plainToInstance } from 'class-transformer';

@ValidatorConstraint({ async: false }) // Explicitly define sync behavior
export class IsNestedObjectConstraint<T extends object> implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments): boolean {
    if (typeof value !== 'object' || value === null) {
      return false;
    }

    const [typeRef] = args.constraints as [ClassConstructor<T>];

    // Validate each nested object
    const validationResults = Object.values(value).map((config) => {
      const instance = plainToInstance(typeRef, config);
      return validateSync(instance);
    });

    return validationResults.every((result) => result.length === 0);
  }

  defaultMessage(args: ValidationArguments): string {
    return `${args.property}: invalid field format`;
  }
}

function NestedObjectValidator<T>(type: ClassConstructor<T>): PropertyDecorator {
  return (target: object, propertyName: string | symbol) => {
    registerDecorator({
      name: 'IsNestedObjectConstraint',
      target: target.constructor,
      propertyName: propertyName as string,
      validator: IsNestedObjectConstraint,
      constraints: [type], // Pass type reference here
    });
  };
}

export default NestedObjectValidator;
