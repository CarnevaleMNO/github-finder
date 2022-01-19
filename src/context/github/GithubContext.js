import { createContext, useReducer } from "react";
import githubReducer from "./GithubReducer";

export const GithubContext = createContext();

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

export default function GithubProvider({ children }) {
  const initialState = {
    users: [],
    loading: false,
  };

  const [state, dispatch] = useReducer(githubReducer, initialState);

  const searchUsers = async (text) => {
    setLoading();

    const params =  new URLSearchParams({
      q: text
    })

    const res = await fetch(`${GITHUB_URL}/search/users?${params}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });

    const {items} = await res.json();

    dispatch({
      type: "GET_USERS",
      payload: items,
    });
  };

  const clearUsers = () => {
    setLoading()

    const newState = [];

    dispatch({
      type: "CLEAR_USERS",
      payload: newState,
    })
  }

  //Set loading
  const setLoading = () => {
    dispatch({ type: "SET_LOADING" });
  };

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        loading: state.loading,
        searchUsers,
        clearUsers,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
}
