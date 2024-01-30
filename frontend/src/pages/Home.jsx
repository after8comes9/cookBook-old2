import { useState, useEffect } from "react";
import { useRecipesContext } from "../hooks/useRecipesContext.jsx";

// components
import RecipeDetails from "../components/RecipeDetails";
import RecipeForm from "../components/RecipeForm";

const Home = () => {
  const { recipes, dispatch } = useRecipesContext();
  const [addRecipe, setAddRecipe] = useState(false);

  function toggleForm() {
    setAddRecipe((addRecipe) => !addRecipe);
  }

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch("http://localhost:4000/api/recipes");
      const json = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_RECIPES", payload: json });
      }
    };

    fetchRecipes();
  }, [dispatch]);

  return (
    <div className="home">
      {!addRecipe && (
        <div className="recipes">
          {recipes &&
            recipes.map((recipe) => (
              <RecipeDetails recipe={recipe} key={recipe._id} />
            ))}
          <div onClick={toggleForm}>
            <span className="material-symbols-outlined">add</span>
            <p>Add recipe</p>
          </div>
        </div>
      )}
      {addRecipe && <RecipeForm toggleForm={toggleForm} />}
    </div>
  );
};

export default Home;
