import { useRecipesContext } from "../hooks/useRecipesContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const RecipeDetails = ({ recipe }) => {
  const { dispatch } = useRecipesContext();

  const handleClick = async () => {
    const response = await fetch(
      "http://localhost:4000/api/recipes/" + recipe._id,
      {
        method: "DELETE",
      },
    );
    const json = await response.json();

    if (response.ok) {
      dispatch({ type: "DELETE_RECIPE", payload: json });
    }
  };

  return (
    <div className="recipe-details">
      <div className="coverImage">
        <img src={recipe.image} alt="recipe" />
      </div>
      <h4>{recipe.title}</h4>
      <strong>Ingredients: </strong>
      <ul>
        {recipe.ingredients.map((ingredient, i) => (
          <li key={i}>{ingredient}</li>
        ))}
      </ul>

      <strong>Instructions: </strong>
      <ol>
        {recipe.instructions.map((instruction, i) => (
          <li key={i}>{instruction}</li>
        ))}
      </ol>

      <p>
        added&nbsp;
        {formatDistanceToNow(new Date(recipe.createdAt), { addSuffix: true })}
      </p>
      <span className="material-symbols-outlined" onClick={handleClick}>
        delete
      </span>
    </div>
  );
};

export default RecipeDetails;
