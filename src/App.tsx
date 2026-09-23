import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./screens/Home";
import Greeting from "./screens/Greeting";
import Todos from "./screens/Todos";
import About from "./screens/About";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="begruessung" element={<Greeting />} />
        <Route path="aufgaben" element={<Todos />} />
        <Route path="ueber" element={<About />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
