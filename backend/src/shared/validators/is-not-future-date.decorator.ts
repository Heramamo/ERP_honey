import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsNotFutureDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNotFutureDate',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          const date = new Date(value as string);
          if (isNaN(date.getTime())) return false;
          const endOfToday = new Date();
          endOfToday.setHours(23, 59, 59, 999);
          return date <= endOfToday;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} ne peut pas être une date future`;
        },
      },
    });
  };
}
