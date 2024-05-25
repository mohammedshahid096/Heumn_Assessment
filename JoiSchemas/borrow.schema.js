const Joi = require("joi");

// validation for adding a new borrowing document
module.exports.createBorrowingValidation = (body) => {
  const schema = Joi.object({
    bookId: Joi.string().required(),
  });

  return schema.validate(body);
};
