import { celebrate, Joi, Segments } from 'celebrate';

export const createUserValidator = celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    socialName: Joi.string().optional(),
    genderIdentity: Joi.string().optional(),
    phoneNumber: Joi.string()
      .regex(/\(\d{2,}\) \d{4,}-\d{4}/)
      .messages({
        'string.pattern.base': `Please enter a valid number format.`,
      })
      .required(),
    semester: Joi.number().required(),
  },
});

export const loginValidator = celebrate({
  [Segments.BODY]: {
    email: Joi.string().required(),
    password: Joi.string().required(),
  },
});

export const updateUserValidator = celebrate({
  [Segments.BODY]: {
    name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    socialName: Joi.string().optional(),
    genderIdentity: Joi.string().optional(),
    phoneNumber: Joi.string()
      .regex(/\(\d{2,}\) \d{4,}-\d{4}/)
      .messages({
        'string.pattern.base': `Please enter a valid number format.`,
      })
      .optional(),
    semester: Joi.number().optional(),
  },
});

export const updateUserPasswordValidator = celebrate({
  [Segments.BODY]: {
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
  },
});
