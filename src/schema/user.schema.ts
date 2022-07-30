import { object, string, TypeOf } from 'zod';

export const loginUserSchema = object({
    body: object({
      email: string({ required_error: 'Email is required' }).email(
        'Invalid email or password'
      ),
      password: string({ required_error: 'Password is required' })
      .min(8,'Invalid email or password')
      .max(32, 'Password must be less than 32 characters'),
    }),
  });

  export type LoginUserInput = TypeOf<typeof loginUserSchema>['body'];
