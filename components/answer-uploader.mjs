const endpoint = 'https://script.google.com/macros/s/AKfycbyZT8ngYx_KZVe3vRbLu8of5QkNuc5uUHdeSG74WMkUGYOwBJY2-5o-ysfI1hv_RMCkrw/exec';

export function uploadAnswers(answers, fetchImpl = fetch) {
  return fetchImpl(endpoint, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ answers }) });
}
