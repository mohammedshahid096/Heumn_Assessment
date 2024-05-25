const Joi = require("joi");

// validation for adding a new book
module.exports.addBookValidation = (body) => {
  const schema = Joi.object({
    title: Joi.string().lowercase().required(),
    author: Joi.string().required(),
    publication_date: Joi.string().required(),
    genre: Joi.string()
      .valid(
        "Fiction",
        "Non-Fiction",
        "Mystery",
        "Romance",
        "Science Fiction",
        "Fantasy",
        "Horror",
        "Historical Fiction",
        "Young Adult",
        "Middle Grade",
        "Children's Books",
        "Graphic Novels"
      )
      .required(),
    copies: Joi.number().default(5),
  });

  return schema.validate(body);
};

// validation for updating a book
module.exports.updateBookValidation = (body) => {
  const schema = Joi.object({
    title: Joi.string().lowercase(),
    author: Joi.string(),
    publication_date: Joi.string(),
    genre: Joi.string().valid(
      "Fiction",
      "Non-Fiction",
      "Mystery",
      "Romance",
      "Science Fiction",
      "Fantasy",
      "Horror",
      "Historical Fiction",
      "Young Adult",
      "Middle Grade",
      "Children's Books",
      "Graphic Novels"
    ),
    copies: Joi.number(),
  });

  return schema.validate(body);
};
