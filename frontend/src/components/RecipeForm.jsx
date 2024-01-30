import { useState } from "react";
import { useRecipesContext } from "../hooks/useRecipesContext.jsx";

const RecipeForm = (props) => {
  const { dispatch } = useRecipesContext();

  const initialState = [""];

  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState(initialState);
  const [instructions, setInstructions] = useState(initialState);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const [fileInputState, setFileInputState] = useState("");
  const [selectedFile, setSelectedFile] = useState("");
  const [previewSource, setPreviewSource] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const recipe = { title, ingredients, instructions, previewSource };

    console.log(previewSource);

    const response = await fetch("http://localhost:4000/api/recipes", {
      method: "POST",
      body: JSON.stringify(recipe),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      /* setEmptyFields([]);
            setError(null);
            setTitle("");
            setIngredients([""]);
            setInstructions([""]);*/
      dispatch({ type: "CREATE_RECIPE", payload: json });
      props.toggleForm();
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    props.toggleForm();
  };

  function addIngredient(index, newIngredient) {
    const newArray = ingredients.map((item, i) => {
      if (i === index) {
        // update one string inside the array
        return newIngredient;
      } else {
        // The rest don't change
        return item;
      }
    });
    setIngredients(newArray);
  }

  function addInstruction(index, newInstruction) {
    const newArray = instructions.map((item, i) => {
      if (i === index) {
        // update one string inside the array
        return newInstruction;
      } else {
        // The rest don't change
        return item;
      }
    });
    setInstructions(newArray);
  }

  function isObjEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  let removeIngredient = (i) => {
    if (ingredients.length === 1) {
      return initialState;
    }
    return [...ingredients.slice(0, i).concat(...ingredients.slice(i + 1))];
  };

  let removeInstruction = (i) => {
    if (instructions.length === 1) {
      return initialState;
    }
    return [...instructions.slice(0, i).concat(...instructions.slice(i + 1))];
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    previewFile(file);
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a New Recipe</h3>
      <label>Recipe Title:</label>
      <input
        type="text"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
        className={emptyFields.includes("title") ? "error" : ""}
      />
      <label>Ingredients:</label>
      <ul>
        {ingredients.map((ingredient, i) => (
          <li key={i}>
            <input
              type="string"
              onChange={(e) => {
                let newIngredient = e.target.value;
                addIngredient(i, newIngredient);
              }}
              value={isObjEmpty(ingredient) ? "" : ingredient}
              className={emptyFields.includes("ingredients") ? "error" : ""}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                setIngredients(removeIngredient(i));
              }}
              className="material-symbols-outlined"
            >
              delete
            </button>
          </li>
        ))}
      </ul>
      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
            setIngredients([...ingredients, {}]);
          }}
          className="material-symbols-outlined"
        >
          add
        </button>
      </div>

      <label>Instructions:</label>
      <ol>
        {instructions.map((instruction, i) => (
          <li key={i}>
            <input
              type="string"
              onChange={(e) => {
                let newInstruction = e.target.value;
                addInstruction(i, newInstruction);
              }}
              value={isObjEmpty(instruction) ? "" : instruction}
              className={emptyFields.includes("instructions") ? "error" : ""}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                setInstructions(removeInstruction(i));
              }}
              className="material-symbols-outlined"
            >
              delete
            </button>
          </li>
        ))}
      </ol>
      <div>
        <button
          onClick={(e) => {
            e.preventDefault();
            setInstructions([...instructions, {}]);
          }}
          className="material-symbols-outlined"
        >
          add
        </button>
      </div>
      <input
        type="file"
        name="image"
        onChange={handleFileInputChange}
        value={fileInputState}
      />
      {previewSource && (
        <img src={previewSource} alt="chosen" style={{ height: "300px" }} />
      )}
      <button className="save">Save Recipe</button>
      <button className="cancel" onClick={handleCancel}>
        Cancel
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default RecipeForm;
