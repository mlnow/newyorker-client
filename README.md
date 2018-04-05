# Overview

This repository contains the main source code for the `next.js` library for the NewYorker caption contest, along with a basic example implementing it. We have used `npm` to package and build the code, and used `flow` to implement static type checking. Our plan is to CDN a minified version of the library for the NewYorker website to call; the full repository has been provided here for developers convenience. Please let us know if there is anything that you would like us to change in the codes implementation.

To build the code, just run the following in the top directory,
```
$ npm install
$ npm run build
```

The main implementation example is contained in `example/index.html`. Basically, the app creates an `Experiment` object, that has two main functions, `getQuery` and `processAnswer` (described in detail below).

The main code to build the library is contained in `src/next.js` with a utility library `src/ajax.js` used for various server side communication.

# The JS API
* `Experiment`: class to encapsulate a caption contest's state
  * `Experiment.getQuery()`: samples a new query (caption) from the priority list and returns it.
  * `Experiment.processAnswer(caption_index, reward)`: tells the server that the user rated `caption_index` with rating `reward`.
  * `Experiment.currentArm`: the currently displayed caption's 'target index'.

Note that to process a response to the _currently displayed caption_, you'll want to do
```js
app.processAnswer(app.currentArm, reward);
```
where `app` is an instantiation of the `Experiment` class.
# Under the Hood

This section describes some of the implementation details of the `next.js` library.

The main NEXT2 infrastructure is serverless, implemented on AWS using a combination of Lambda, DynamoDB, S3 and APIGateway services. The url for the lambda services is at `$api_base`, and the S3 objects are stored with a standard url prefix of `stateBase`. Each weeks contest corresponds to a unique `exp_uid` which is communicated with the NEXT2 backend in each api request.

The underlying model for NEXT2 consists of the `priorityList` stored in S3, which maintains a weight for each caption. This list is updated through various lambda tasks based on previous user responses. We also maintain a `targets.json` list in S3 which just stores the captions themselves. The next query to display to the user is decided by looking at the priority list and using the weights to decide which caption to show next. The `Experiment` class also maintains a list of captions we have already seen, `seen`.


Answers to queries are posted to NEXT2 in a `app.processAnswer` call via POST calls to an endpoint,
`$api_base/processAnswer`, with JSON body data like:
```js
{
  "exp_uid": "cbucb2940253355369912d47bc27b5ee56f", // a unique, per-contest ID; changes every week
  "participant_uid": "9ca278ee810c9181368fe9dde6b8f6", // a unique, per-user ID. (currently) stays fixed after first visit
  "target_id": 1247, // the index of the caption which the user rated
  "target_reward": 2 // the rating they gave the caption. unfunny = 1, somewhat funny = 2, funny = 3
}
```
The targets (captions) are fetched by `app.load()` at the same time as the
priority list; both are stored as JSON in a S3 bucket. The targets do not change
over the duration of a contest, but the priority list changes constantly as the
backend recieves answers and reupdates the internal model.


# FAQ
### Why is there a blank `next.js` file in `example/`?
Since this code uses promises and whatnot, but we need to support old browsers, we use Babel and a promise polyfill.
The code in `src/next.js` is flow-typechecked, polyfilled, and run through babel by the npm `build` task, which you can run with
```
$ npm install
$ npm run build
```
This generates two files, `dist/next.js` and `dist/next.min.js`. The `next.js` file in `example/` is just a symlink to `dist/next.js`,
so that you can run a Python `SimpleHTTPServer` from the `example/` directory and play with the example locally after building the next client library.

## Where can I find an up-to-date `next.min.js` build?
Right [here](https://dslg2854tcnag.cloudfront.net/js/next.min.js).
The script tag you want is
```html
<script src="https://dslg2854tcnag.cloudfront.net/js/next.min.js"></script>
```
