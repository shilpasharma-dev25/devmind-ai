import { useEffect, useState } from "react";
import ErrorForm from "../components/ErrorForm";
import ErrorList from "../components/ErrorList";
import { getErrors } from "../services/api";

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
    <div>
      <h1>DevMind AI</h1>

      <ErrorForm onAdd={addError} />
     
      <ErrorList errors={errors} setErrors={setErrors} />
    </div>
  );
};

export default Home;