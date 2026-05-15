const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const sendMentorMessage = async (message, context, conversationHistory, token) => {
  const res = await fetch(`${API_URL}/mentor/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message, context, conversationHistory }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Mentor API failed');
  }
  return res.json();
};

export const loadMentorHistory = async (userId, token) => {
  const res = await fetch(`${API_URL}/mentor/history/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return { success: false, history: [] };
  return res.json();
};
