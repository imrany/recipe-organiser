import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  recipe_name: { type: String, required: true },
  ingredients: { type: String, required: true },
  directions: { type: String, required: true },
  email: { type: String, required: true, ref: 'Users' },
  image: { type: String },
  created_at: { type: Date, default: Date.now }
});

const recipeModel=mongoose.model('Recipe', RecipeSchema)
export default recipeModel