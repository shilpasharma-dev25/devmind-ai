import { useEffect, useState } from "react";
import ErrorForm from "../components/ErrorForm";
import ErrorList from "../components/ErrorList";
import { getErrors } from "../services/api";
import "./Home.css";

const Home = () => {
  const [errors, setErrors] = useState([]);

  const fetchErrors = async () => {
    const res = await getErrors();
    setErrors(res.data.data);
  };

  useEffect(() => {
    fetchErrors();
  }, []);

  const addError = (error) => {
    setErrors([error, ...errors]);
  };

return (
  <div className="home">
    <div className="hero">
      <h1>🚀 DevMind AI</h1>
      <p>AI-powered Error Tracker for Developers</p>
    </div>

    <div className="form-section">
      <ErrorForm onAdd={addError} />
    </div>

    <div className="list-section">
      <div className="list-header">
        <h2>Tracked Errors</h2>

        <span className="count-badge">
          {errors.length} {errors.length === 1 ? "Error" : "Errors"}
        </span>
      </div>

      <ErrorList errors={errors} setErrors={setErrors} />
    </div>
  </div>
);
};

export default Home;