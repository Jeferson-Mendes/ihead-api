import { celebrate, Joi, Segments } from 'celebrate';

export const createReportValidator = celebrate({
  [Segments.BODY]: {
    publication: Joi.string().optional(),
    comment: Joi.string().optional(),
    reason: Joi.string().required(),
  },
});
