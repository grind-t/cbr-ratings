export async function fetchCSRFToken(fetcher: typeof fetch) {
  return await fetcher("https://ratings.cbr.ru/?disclaimer=1")
    .then((response) => response.text())
    .then((text) => text.match(/"bitrix_sessid":.*?"(.+?)"/)?.at(1));
}
