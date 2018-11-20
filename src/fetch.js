import HttpError from "./HttpError";

const fetchJson = (url, options = {}) => {
    const requestHeaders = options.headers || new Headers();
    if (!requestHeaders.has('Accept')){
        requestHeaders.set('Accept', 'application/vnd.api+json')
    }
    if (!(options && options.body && options.body instanceof FormData) && !requestHeaders.has('Content-Type')) {
        requestHeaders.set('Content-Type', 'application/vnd.api+json');
    }
    if (options.user && options.user.authenticated && options.user.token && !requestHeaders.has('Authorization')) {
        requestHeaders.set('Authorization', options.user.token);
    }
    return fetch(url, { ...options, headers: requestHeaders })
        .then(response => response.text().then(text => ({
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            body: text,
        })))
        .then(({ status, statusText, headers, body }) => {
            let json;
            try {
                json = JSON.parse(body);
            } catch (e) {
                // not json, no big deal
            }
            if (status < 200 || status >= 300) {
                return Promise.reject(new HttpError(json, statusText, status));
            }
            return { status, headers, body, json };
        });
};

export const jsonApiHttpClient = (url, options = {}) => {
    if (!options.headers) {
        options.headers = new Headers({ 'Accept': 'application/vnd.api+json' });
    }
    if (!options.headers.has('Content-Type')) {
        options.headers.set('Content-Type', 'application/vnd.api+json');
    }
    return fetchJson(url, options);
}

export const queryParameters = data => Object.keys(data)
    .map(key => [key, data[key]].map(encodeURIComponent).join('='))
    .join('&');
