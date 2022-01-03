const express = require("express");
const Joi = require("joi");
const router = express.Router();
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connect to mongoDB..."))
  .catch((error) => console.error("Could not Connect to mongoDB..."));

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
  // res.send(courses);
});

router.post("/", async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required().messages({
      "string.base": `"name" should be a type of 'text'`,
      "string.empty": `"name" cannot be an empty field`,
      "string.min": `"name" should have a minimum length of {#limit}`,
      "any.required": `"name" is a required field`,
    }),
  });

  const validationResult = schema.validate(
    { name: req.body.name },
    { abortEarly: false }
  );
  console.log(validationResult);

  // if(!req.body.name || req.body.name.length<3){
  if (validationResult.error) {
    // res.status(422).json({
    //     message: 'Validation error.',
    //     error: validationResult.error,
    //    })
    return res.status(400).send(validationResult.error);
    // res.status(400).send("name is mendatory and should be minimum 3 charaters.");
  }

  //    const course={
  //     id:courses.length+1,
  //     name:req.body.name
  //    };
  let genre = new Genre({
    name: req.body.name,
  });
  genre = await genre.save();
  //    courses.push(course);
  //    res.send(course);
  res.send(genre);
});

router.put("/:id", async function (req, res) {
  ///validate
  ////If invalid, return 400- bad request
  const schema = Joi.object({
    name: Joi.string().alphanum().min(3).max(20).required().messages({
      "string.base": `"name" should be a type of 'text'`,
      "string.empty": `"name" cannot be an empty field`,
      "string.min": `"name" should have a minimum length of {#limit}`,
      "any.required": `"name" is a required field`,
    }),
  });
  const validationResult = schema.validate(
    { name: req.body.name },
    { abortEarly: false }
  );
  console.log(validationResult);
  if (validationResult.error)
    return res.status(400).send(validationResult.error);

  ///look up the course
  //if not existing then return 404
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    {
      new: true,
    }
  );
  //    let course = courses.find(c => c.id === parseInt(req.params.id));
  //    if(!course) return res.status(404).send('Sorry course with given ID was not found.');
  if (!genre)
    return res.status(404).send("Sorry genre with given ID was not found.");

  ////update course
  ///return the updated course
  // course.name=req.body.name
  // res.send(course)
  res.send(genre);
});

router.delete("/:id", async function (req, res) {
  ///look up the course
  //if not existing then return 404
  //    let course = courses.find(c => c.id === parseInt(req.params.id));
  const genre = await Genre.findByIdAndRemove(req.params.id);
  //    if(!course) return res.status(404).send('Sorry course with given ID was not found.');
  if (!genre)
    return res.status(404).send("Sorry genre with given ID was not found.");

  //    const index=courses.indexOf(course)
  //    courses.splice(index,1)

  //    res.send(course)
  res.send(genre);
});

router.get("/:id", async (req, res) => {
  //    let course = courses.find(c => c.id === parseInt(req.params.id));
  const genre = await Genre.findById(req.params.id);
  //    if(!course) return res.status(404).send('Sorry course with given ID was not found.');
  if (!genre)
    return res.status(404).send("Sorry genre with given ID was not found.");

  //    res.send(course)
  res.send(genre);

  // res.send([1,2,3,4]);
});

module.exports = router;
