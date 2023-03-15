import { Route, Routes, Link, useMatch } from "react-router-dom";
import Issues from "./pages/Issues";
import Issue from "./pages/Issue";
import AddIssue from "./pages/AddIssue";

async function fetchWithError(url, options) {
  const response = await fetch(url, options);

  if (response.status !== 200) {
    throw new Error('Error in request.');
  }

  const result = await response.json();

  if (result.error) {
    throw new Error(result.error);
  }

  return result;
}

function App() {
  const isRootPath = useMatch({ path: "/", end: true });
  return (
    <div className="App">
      {!isRootPath ? (
        <Link to="/">Back to Issues List</Link>
      ) : (
        <span>&nbsp;</span>
      )}
      <h1>Issue Tracker</h1>
      <Routes>
        <Route path="/" element={<Issues />} />
        <Route path="/add" element={<AddIssue />} />
        <Route path="/issue/:number" element={<Issue />} />
      </Routes>
    </div>
  );
}

export default App;
