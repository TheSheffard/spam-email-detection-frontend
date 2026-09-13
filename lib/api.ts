export type User = { 
  user_id: number; 
  full_name: string; 
  email: string; 
  role: "user" | "admin"; 
  is_active: boolean; 
  created_at: string;
};

export type Prediction = {
  log_id: number; 
  label: "spam" | "ham"; 
  display_label: string; 
  confidence: number; 
  spam_probability: number; 
  ham_probability: number; 
  risk_level: "low" | "medium" | "high"; 
  guidance: string; 
  model_name: string; 
  influential_terms: string[]; 
  needs_review: boolean; 
  confidence_threshold: number;
};

export type HistoryItem = { 
  log_id: number; 
  email_excerpt: string; 
  predicted_label: "spam" | "ham"; 
  confidence_score: number; 
  top_terms: string[]; 
  needs_review: boolean; 
  submitted_at: string; 
  confirmed_label: "spam" | "ham" | null;
};

// Automatically use production backend when deployed, or localhost in development
export const API_URL = 
  process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === "production" 
    ? "https://spam-email-backend.vercel.app" 
    : "http://localhost:8000");


export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { 
      ...options, 
      credentials: "include", // CRITICAL: Ensures auth cookies are sent in production cross-origin requests
      headers: { 
        "Content-Type": "application/json", 
        ...options.headers 
      } 
    });
  } catch {
    throw new Error("The detection service is unavailable. Please check your connection and try again.");
  }

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const detail = payload?.detail;
    throw new Error(typeof detail === "string" ? detail : "The request could not be completed.");
  }

  return response.status === 204 ? (undefined as T) : response.json();
}

export function classifyEmail(subject: string, body: string) {
  return api<Prediction>("/api/v1/classification/predict", { 
    method: "POST", 
    body: JSON.stringify({ subject, body }) 
  });
}