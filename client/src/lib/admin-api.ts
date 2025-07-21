// Admin API helper functions with authentication headers

export const adminApiRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const sessionId = localStorage.getItem("adminSession");
  
  if (!sessionId) {
    throw new Error("No admin session found");
  }

  const headers = {
    ...options.headers,
    "x-admin-session": sessionId,
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Session expired, clear local storage and redirect to login
    localStorage.removeItem("adminSession");
    localStorage.removeItem("adminUser");
    window.location.href = "/admin/login";
    throw new Error("Session expired");
  }

  return response;
};

export const getAdminHeaders = () => {
  const sessionId = localStorage.getItem("adminSession");
  return sessionId ? { "x-admin-session": sessionId } : {};
};