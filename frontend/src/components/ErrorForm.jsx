import { useState } from "react";
import { createError } from "../services/api";

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

    console.log("Saved successfully");
  } catch (err) {
    console.error("POST ERROR:", err.response?.data || err.message);
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add Error</h2>

      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
      />

      <input
        name="errorMessage"
        placeholder="Error Message"
        value={form.errorMessage}
        onChange={handleChange}
      />

      <select name="technology" onChange={handleChange} value={form.technology}>
        <option value="Node">Node</option>
        <option value="React">React</option>
        <option value="Express">Express</option>
        <option value="MongoDB">MongoDB</option>
        <option value="PHP">PHP</option>
        <option value="WordPress">WordPress</option>
        <option value="Shopify">Shopify</option>
      </select>

      <button type="submit">Save Error</button>
    </form>
  );
};

export default ErrorForm;