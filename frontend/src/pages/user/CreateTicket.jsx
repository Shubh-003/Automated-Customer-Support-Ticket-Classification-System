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
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset states on new submission
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      await axios.post("/tickets", {
        subject,
        description
      });

      // Show success UI instead of a browser alert
      setSuccess("Your ticket has been successfully created. Our support team will review it shortly.");

      // Clear fields
      setSubject("");
      setDescription("");

    } catch (err) {
      setError("Failed to create ticket. Please verify your connection and try again.");
    } finally {
      // Always stop the loading spinner, even if it fails
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Submit a Request</h2>
        <p className="text-slate-500 text-sm mt-1">
          Please provide the details of your issue below, and we will get back to you as soon as possible.
        </p>
      </div>

      <div className="form-card">

        {/* ERROR ALERT */}
        {error && (
          <div className="alert-error" role="alert">
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
            <span>{error}</span>
          </div>
        )}

        {/* SUCCESS ALERT */}
        {success && (
          <div className="alert-success" role="alert">
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* SUBJECT INPUT */}
          <div>
            <label htmlFor="subject" className="form-label">Subject <span className="text-red-500">*</span></label>
            <input
              id="subject"
              type="text"
              placeholder="e.g., Cannot access my account dashboard"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="input-field"
              required
            />
          </div>

          {/* DESCRIPTION INPUT */}
          <div>
            <label htmlFor="description" className="form-label">Description <span className="text-red-500">*</span></label>
            <textarea
              id="description"
              placeholder="Please describe your issue in detail. Include any error messages you received..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="textarea-field"
              required
            />
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  {/* Tailwind SVG Loading Spinner */}
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                "Submit Ticket"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateTicket;