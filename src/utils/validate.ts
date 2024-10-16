import express from 'express';
import { ValidationChain, validationResult } from 'express-validator';

const validate = (validations: ValidationChain[]) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Execute all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Get validation results
    const errors = validationResult(req);


    if (errors.isEmpty()) {
      return next();
    }

    // If there are errors, send a 400 response with the errors
    res.status(400).json({ errors: errors.mapped() });
  };
};

export default validate;