/*
Allows a logged-in user to create a support ticket.

POST /api/tickets

1. ticket subject input
2. description input
3. error msg

*/

import { useState } from "react";
import axios from "../../api/axiosClient";

function CreateTicket() {

  // store subject input
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // send ticket data to backend
      await axios.post("/tickets", {
        subject,
        description
      });

      alert("Ticket created");

      // clear fields
      setSubject("");
      setDescription("");

    } catch (err) {
      setError("Failed to create ticket");
    }
  };

  return (
    <div className="p-6">

      <h2 className="text-xl mb-4">
        Create Ticket
      </h2>

      {error && (
        <p className="text-red-500">
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 w-96"
      >

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e)=>setSubject(e.target.value)}
          className="border p-2"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          className="border p-2"
        />

        <button className="bg-blue-500 text-white p-2">
          Submit Ticket
        </button>

      </form>

    </div>
  );
}

export default CreateTicket;