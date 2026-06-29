const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

async function handleResponse(response) {
    const text = await response.text();
    let data;
  
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
  
    if (!response.ok) {
      const error = new Error(
        typeof data === "string" ? data : data?.message ? data.message : `Error ${response.status}`
      );
      error.status = response.status;
      error.email = data?.email || null; // preserve email from backend
      throw error;
    }
  
    return data;
  }

function getToken() {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
}

function authHeaders(extra = {}) {
    const token = getToken();

    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...extra,
    };
}

export async function signupUser({ email, password, role }) {
    const response = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
    });

    return handleResponse(response);
}

export async function loginUser({ email, password }) {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    return handleResponse(response);
}

export async function getAllSkills() {
    const response = await fetch(`${BASE_URL}/api/skills`);
    return handleResponse(response);
}

export async function createCandidateProfile(data) {
    const response = await fetch(`${BASE_URL}/api/candidate/profile`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(response);
}

export async function getCandidateProfile() {
    const response = await fetch(`${BASE_URL}/api/candidate/profile`, {
        headers: authHeaders(),
    });
    return handleResponse(response);
}

export async function updateCandidateProfile(data) {
    const response = await fetch(`${BASE_URL}/api/candidate/profile`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(response);
}

export async function createRecruiterProfile(data) {
    const response = await fetch(`${BASE_URL}/api/recruiter/profile`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(response);
}

export async function getRecruiterProfile() {
    const response = await fetch(`${BASE_URL}/api/recruiter/profile`, {
        headers: authHeaders(),
    });
    return handleResponse(response);
}

export async function updateRecruiterProfile(data) {
    const response = await fetch(`${BASE_URL}/api/recruiter/profile`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(response);
}

export async function createCompany(data) {
    const response = await fetch(`${BASE_URL}/api/companies`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(response);
}

export async function searchCompanies(name) {
    const response = await fetch(
        `${BASE_URL}/api/companies/search?name=${name}`
    );
    return handleResponse(response);
}


export async function getAllJobs() {
    const response = await fetch(`${BASE_URL}/api/jobs`);
    return handleResponse(response);
}

export async function getJob(id) {
    const response = await fetch(`${BASE_URL}/api/jobs/${id}`);
    return handleResponse(response);
}

export async function createJob(data) {
    const response = await fetch(`${BASE_URL}/api/jobs`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(data),
    });
    return handleResponse(response);
}

export async function searchJobs(keyword) {
    const response = await fetch(
        `${BASE_URL}/api/jobs/search?keyword=${keyword}`
    );
    return handleResponse(response);
}

export async function getMyJobs() {
    const response = await fetch(`${BASE_URL}/api/jobs/my-jobs`, {
        headers: authHeaders(),
    });
    return handleResponse(response);
}

export async function closeJob(id) {
    const response = await fetch(`${BASE_URL}/api/jobs/${id}/close`, {
        method: "PATCH",
        headers: authHeaders(),
    });
    return handleResponse(response);
}

export async function applyToJob(jobId, coverLetter) {
    const url = coverLetter
        ? `${BASE_URL}/api/applications/apply/${jobId}?coverLetter=${encodeURIComponent(
              coverLetter
          )}`
        : `${BASE_URL}/api/applications/apply/${jobId}`;

    const response = await fetch(url, {
        method: "POST",
        headers: authHeaders(),
    });

    return handleResponse(response);
}

export async function getMyApplications() {
    const response = await fetch(
        `${BASE_URL}/api/applications/my-applications`,
        {
            headers: authHeaders(),
        }
    );
    return handleResponse(response);
}

export async function getJobApplications(jobId) {
    const response = await fetch(
        `${BASE_URL}/api/applications/job/${jobId}`,
        {
            headers: authHeaders(),
        }
    );
    return handleResponse(response);
}

export async function updateApplicationStatus(applicationId, status) {
    const response = await fetch(
        `${BASE_URL}/api/applications/${applicationId}/status?status=${status}`,
        {
            method: "PATCH",
            headers: authHeaders(),
        }
    );
    return handleResponse(response);
}


export async function saveJob(jobId) {
    const response = await fetch(
        `${BASE_URL}/api/saved-jobs/${jobId}`,
        {
            method: "POST",
            headers: authHeaders(),
        }
    );
    return handleResponse(response);
}

export async function unsaveJob(jobId) {
    const response = await fetch(
        `${BASE_URL}/api/saved-jobs/${jobId}`,
        {
            method: "DELETE",
            headers: authHeaders(),
        }
    );
    return handleResponse(response);
}

export async function getSavedJobs() {
    const response = await fetch(`${BASE_URL}/api/saved-jobs`, {
        headers: authHeaders(),
    });
    return handleResponse(response);
}

export async function getNotifications() {
    const response = await fetch(`${BASE_URL}/api/notifications`, {
        headers: authHeaders(),
    });
    return handleResponse(response);
}

export async function getUnreadCount() {
    const response = await fetch(
        `${BASE_URL}/api/notifications/unread-count`,
        {
            headers: authHeaders(),
        }
    );
    return handleResponse(response);
}

export async function markAllRead() {
    const response = await fetch(
        `${BASE_URL}/api/notifications/mark-all-read`,
        {
            method: "PATCH",
            headers: authHeaders(),
        }
    );
    return handleResponse(response);
}

export async function checkMyScore(applicationId, resumeFile) {
    const token = getToken();

    const formData = new FormData();
    formData.append("resume", resumeFile);

    const response = await fetch(
        `${BASE_URL}/api/applications/${applicationId}/check-score`,
        {
            method: "POST",
            headers: {
                Authorization: token ? `Bearer ${token}` : "",
            },
            body: formData,
        }
    );

    return handleResponse(response);
}