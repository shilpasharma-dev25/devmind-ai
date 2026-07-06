import { useState } from "react";
import { createError } from "../services/api";
import "./ErrorForm.css";

const ErrorForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    title: "",
    errorMessage: "",
    technology: "Node",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await createError(form);

    onAdd(res.data.data);

    // Clear the form after successful save
    setForm({
      title: "",
      errorMessage: "",
      technology: "Node",
    });

    console.log("Saved successfully");
  } catch (err) {
    console.error("POST ERROR:", err.response?.data || err.message);
  }
};

  return (
  <form className="error-form" onSubmit={handleSubmit}>
    <h2>Add New Error</h2>

    <div className="form-group">
      <label>Title</label>

      <input
        name="title"
        placeholder="Enter error title"
        value={form.title}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>Error Message</label>

      <input
        name="errorMessage"
        placeholder="Paste your error message"
        value={form.errorMessage}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>Technology</label>

      <select
        name="technology"
        value={form.technology}
        onChange={handleChange}
      >
        <option value="Node">Node</option>
        <option value="React">React</option>
        <option value="Express">Express</option>
        <option value="MongoDB">MongoDB</option>
        <option value="PHP">PHP</option>
        <option value="WordPress">WordPress</option>
        <option value="Shopify">Shopify</option>
      </select>
    </div>

    <button type="submit">
      Save Error
    </button>
  </form>
);
};

export default ErrorForm;