import React, { useState } from "react";
import FileBase from "react-file-base64";

function reducer(state, action) {
  switch (action.type) {
    case "CREATE":
      return { ...state, payload };
    case "":
      return;
    default:
      return state;
  }
}

const Form = () => {
  const [state, dispatch] = useReducer(reducer, {});

  const [nftsinfo, setNftsinfo] = useState({
    creator: "",
    title: "",
    message: "",
    tags: "",
    selectedFile: "",
  });

  const clear = () => {
    setCurrentId(0);
    setNftsinfo({
      creator: "",
      title: "",
      message: "",
      tags: "",
      selectedFile: "",
    });
  };
  const url = "http://localhost:5000/posts";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(`watin for ${nftsinfo}`);
      const { data } = await fetch.post(url, nftsinfo);
      dispatch({ type: "CREATE", payload: data });
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          name="creator"
          placeholder="creator"
          variant="outlined"
          label="Creator"
          fullWidth
          value={nftsinfo.creator}
          onChange={(e) =>
            setNftsinfo({ ...nftsinfo, creator: e.target.value })
          }
        />
        <input
          name="title"
          placeholder="title"
          variant="outlined"
          label="Title"
          fullWidth
          value={nftsinfo.title}
          onChange={(e) => setNftsinfo({ ...nftsinfo, title: e.target.value })}
        />
        <input
          name="description"
          placeholder="description"
          variant="outlined"
          label="Message"
          fullWidth
          multiline
          value={nftsinfo.message}
          onChange={(e) =>
            setNftsinfo({ ...nftsinfo, message: e.target.value })
          }
        />
        <div>
          <FileBase
            type="file"
            multiple={false}
            onDone={({ base64 }) =>
              setNftsinfo({ ...nftsinfo, selectedFile: base64 })
            }
          />
        </div>
        <button>Submit</button>
      </form>
      <main>
        <h1>{state.creator}</h1>
        <h1>{state.title}</h1>
        <h1>{state.message}</h1>
        <div>{state.selectedFile}</div>
      </main>
    </div>
  );
};

export default Form;
