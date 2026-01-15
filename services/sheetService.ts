import { Submission } from "../types";

// TODO: PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
// Example: "https://script.google.com/macros/s/AKfycbx.../exec"
export const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwl_cbMb25h3gEe5o2HUc6EB0AtEX4TfSKisZqKZg0giCbBPnuduBmN0qBzHfteC2C_/exec";

export const fetchSubmissions = async (): Promise<Submission[]> => {
  if (!GOOGLE_SCRIPT_URL) {
    console.warn("Google Script URL is not set.");
    return [];
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL);
    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return [];
  }
};

export const postSubmission = async (submission: Submission): Promise<boolean> => {
  if (!GOOGLE_SCRIPT_URL) {
    console.warn("Google Script URL is not set. Data will not be saved.");
    // Simulate success for demo purposes if no URL
    return true;
  }

  try {
    // We use text/plain to avoid CORS preflight options request which GAS doesn't handle well
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: JSON.stringify(submission),
    });

    if (!response.ok) throw new Error("Network response was not ok");
    return true;
  } catch (error) {
    console.error("Error posting submission:", error);
    return false;
  }
};
