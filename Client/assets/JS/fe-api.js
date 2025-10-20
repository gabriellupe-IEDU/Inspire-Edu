export async function apiGET(path, token) {
  const res = await fetch(path, {
    headers: token ? { Authorization: 'Bearer ' + token } : {},
  });
  return res.json();
}

export async function apiPOST(path, body, token) {
  const res = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    body: JSON.stringify(body),
  });
  return res.json();
}