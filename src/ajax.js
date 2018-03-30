// @flow
/* Tiny wrapper around XMLHttpRequest which promisifies it.
 * Implements nothing more than we strictly need. */

type Method = 'GET' | 'POST';
type Result = {
  data: any,
  status: number,
};

export function rawRequest(method: Method, url: string,
  options?: {body?: string, contentType?: string} = {},
  success: (xhr: XMLHttpRequest) => void, error: (xhr: XMLHttpRequest) => void)
{
  const xhr = new XMLHttpRequest();
  xhr.open(method, url, /* async = */ true);
  xhr.onload = function () { success(this); };
  xhr.onerror = function () { error(this); };

  if (options.contentType != null)
      xhr.setRequestHeader("Content-Type", options.contentType);
  xhr.send(options.body);
}

export function get(url: string): Promise<Result> {
  return new Promise((resolve, reject) => {
    rawRequest('GET', url, {},
      (xhr) => {
        if (xhr.status >= 200 && xhr.status < 400)
          resolve({data: parseData(xhr), status: xhr.status});
        else
          reject(xhr);
      }, (xhr) => reject(xhr));
  });
}

export function post(url: string, data: mixed,
  contentType?: string = 'application/json'): Promise<Result>
{
  return new Promise((resolve, reject) => {
    rawRequest('POST', url, {body: JSON.stringify(data), contentType},
      (xhr) => {
        if (xhr.status >= 200 && xhr.status < 400)
          resolve({data: parseData(xhr), status: xhr.status});
        else
          reject(xhr);
      }, (xhr) => reject(xhr));
  });
}

function parseData(xhr: XMLHttpRequest): mixed {
  switch (xhr.getResponseHeader('Content-Type')) {
    case 'application/json':
      return JSON.parse(xhr.responseText);
    default:
      return xhr.responseText;
  }
}
