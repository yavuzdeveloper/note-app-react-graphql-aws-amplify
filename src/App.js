import { useState, useEffect } from "react";
import "./App.css";
import Amplify from "aws-amplify";
import config from "./aws-exports";
import { listNotes } from "./graphql/queries";
import { API } from "aws-amplify";
import { createNote as createNoteMutation } from "./graphql/mutations";

Amplify.configure(config);

const initialFormState = {
  name: "",
  description: "",
};

const App = () => {
  const [notes, setNotes] = useState([]);
  const [formState, setFormState] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);

  const createNote = async () => {
    if (!formState.name || !formState.description) return;

    await API.graphql({
      query: createNoteMutation,
      variables: {
        input: formState,
      },
    });

    setNotes([...notes, formState]);
    setFormState(initialFormState);
  };

  const fetchNotes = async () => {
    const apiData = await API.graphql({
      query: listNotes,
    });

    setNotes(apiData.data.listNotes.items);
  };

  return (
    <div className="App">
      <h1>Note-App</h1>

      <div>
        <input
          onChange={e => setFormState({ ...formState, name: e.target.value })}
          placeholder="Note name"
          value={formState.name}
          style={{ marginTop: "10px", width: "400px", height: "25px" }}
        />
      </div>
      <div>
        {" "}
        <input
          onChange={e =>
            setFormState({ ...formState, description: e.target.value })
          }
          placeholder="Description"
          value={formState.description}
          style={{ marginTop: "10px", width: "400px", height: "25px" }}
        />
      </div>
      <div>
        {" "}
        <button
          onClick={createNote}
          style={{
            marginTop: "20px",
            width: "410px",
            height: "30px",
            color: "white",
            backgroundColor: "blue",
          }}
        >
          Create Note
        </button>
      </div>

      {notes?.map(item => (
        <div className="note" key={item.id}>
          <h5>Name: {item.name}</h5>
          <p>Description: {item.description}</p>
        </div>
      ))}
    </div>
  );
};

export default App;
