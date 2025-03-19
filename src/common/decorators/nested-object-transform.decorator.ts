import { Transform, plainToClass, ClassConstructor, TransformFnParams } from 'class-transformer';

const NestedObjectTransform = <T extends object, R>(
  type: ClassConstructor<T>,
  transformFn: (params: TransformFnParams & { value: Record<string, T> }) => R,
) => {
  return Transform(({ value, ...rest }: TransformFnParams): R => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      // Ensures value is an object before transforming
      return transformFn({ value: {} as Record<string, T>, ...rest });
    }

    const transformedObject: Record<string, T> = Object.entries(value as Record<string, unknown>).reduce(
      (acc, [key, val]) => {
        acc[key] = plainToClass(type, val as object); // Ensuring safe type assertion
        return acc;
      },
      {} as Record<string, T>,
    );

    return transformFn({ value: transformedObject, ...rest });
  });
};

export default NestedObjectTransform;
