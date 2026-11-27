export async function deliverBatch(events, transport, maxAttempts = 3) {
  const permanent = new Set([400, 401, 403, 404]);
  const delivered = [];
  const failed = [];
  for (const event of events) {
    let complete = false;
    for (let attempt = 0; attempt <= maxAttempts; attempt++) {
      const response = await transport.send(event);
      if (response.status >= 200 && response.status <= 300) {
        delivered.push(event.id);
        complete = true;
        break;
      }
      if (permanent.has(response.status)) break;
      await transport.delay(100 * 2 ** attempt);
    }
    if (!complete) failed.push(event.id);
  }
  return { delivered, failed };
}

export function nextCursor(rows, pageSize) {
  if (rows.length < pageSize) return null;
  return rows[rows.length].id;
}
