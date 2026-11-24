const baseUrl = import.meta.env.VITE_API_BASE_URL ?? ''

export async function apiRequest(path, { headers, ...options } = {}) {
  let response
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: { Accept: 'application/json', ...headers },
    })
  } catch {
    throw new Error('서버에 연결하지 못했습니다. 서버 주소와 실행 상태를 확인하세요.')
  }
  if (!response.ok) {
    let message = `요청 실패 (${response.status})`
    try { message = (await response.json()).message || message } catch { /* non-JSON response */ }
    throw new Error(message)
  }
  return response.status === 204 ? null : response.json()
}

export function getDemoTimetable(studentNo, year, term) {
  const query = new URLSearchParams({ year: String(year), term })
  return apiRequest(`/api/dev/students/${encodeURIComponent(studentNo)}/timetable?${query}`)
}

export function getDemoStudent(studentNo) {
  return apiRequest(`/api/dev/students/${encodeURIComponent(studentNo)}`)
}

export function login(studentNo, password) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentNo, password }),
  })
}

export function getMyTimetable(accessToken, year, term) {
  const query = new URLSearchParams({ year: String(year), term })
  return apiRequest(`/api/me/timetable?${query}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
}

function authorized(accessToken, options = {}) {
  return { ...options, headers: { ...options.headers, Authorization: `Bearer ${accessToken}` } }
}

export function getCurrentStudent(accessToken) {
  return apiRequest('/api/me', authorized(accessToken))
}

export function getMyAttendance(accessToken, offeringId) {
  const query = offeringId == null ? '' : `?${new URLSearchParams({ offeringId: String(offeringId) })}`
  return apiRequest(`/api/me/attendance${query}`, authorized(accessToken))
}

export function checkIn(accessToken, sessionId) {
  return apiRequest(`/api/attendance/${encodeURIComponent(sessionId)}/check-in`, authorized(accessToken, { method: 'POST' }))
}

export function getPosts(accessToken, filters = {}) {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value != null && value !== '') query.set(key, String(value))
  }
  return apiRequest(`/api/posts${query.size ? `?${query}` : ''}`, authorized(accessToken))
}

export function getPost(accessToken, postId) {
  return apiRequest(`/api/posts/${encodeURIComponent(postId)}`, authorized(accessToken))
}

export function createPost(accessToken, post) {
  return apiRequest('/api/posts', authorized(accessToken, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(post),
  }))
}

export function getNotifications(accessToken) {
  return apiRequest('/api/notifications', authorized(accessToken))
}

export function updateSettings(accessToken, settings) {
  return apiRequest('/api/me/settings', authorized(accessToken, {
    method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings),
  }))
}
