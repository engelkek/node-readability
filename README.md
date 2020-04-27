# node-readability

## About

A version of mozilla/readability running in Node 14. Based on the work of phpdocker-io/readability-js-server.

## How to use

When started, the app will listen on port 13000. It only accepts POST requests. POST requests must be JSON. At minimum a request must contain a URL:

    { "url": "http://example.com" }

The service only accepts URLs starting with `http://` or `https://`.

The URL will be called with GET. 

Retrieved content is handled by the readability library and returned as JSON:

    {
        "url": "<the input URL>",
        "content": "<the cleaned HTML content>",
        "length": <length of the HTML content",
        "title": "<extracted title>",
        "byline": "<extracted authorship notes>",
        "excerpt": "<extracted summary>"
    }

To handle URLs that require authorization or special headers to be set, these can optionally be provided in the POST request:

    {
        "url": "http://example.com",
        "headers": {
            "cookie": "super-special=true",
            "user-agent": "whatever 1.2.3"
        },
        "auth": {
            "username": "johndoe",
            "password": "eodnhoj"
        }
    }

