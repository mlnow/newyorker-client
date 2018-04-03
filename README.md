# Implementation
## How do I implement this?
Look in `example/index.html` for commented code explaining how to wire this up.

## Where can I find an up-to-date `next.min.js` build?
Right [here](https://dslg2854tcnag.cloudfront.net/js/next.min.js).
The script tag you want is
```html
<script src="https://dslg2854tcnag.cloudfront.net/js/next.min.js"></script>
```

# The JS API
* `Experiment`: class to encapsulate a caption contest's state
  * `Experiment.getQuery()`: samples a new query (caption) from the priority list and returns it.
  * `Experiment.processAnswer(caption_index, reward)`: tells the server that the user rated `caption_index` with rating `reward`.
  * `Experiment.currentArm`: the currently displayed caption.

Note that to process a response to the _currently displayed caption_, you'll want to do
```js
exp.processAnswer(exp.currentArm, reward);
```

# The underlying API
NEXT2 receives user judgements via POST calls to an endpoint,
`$api_base/processAnswer`, with JSON body data like:
```js
{
  "exp_uid": "cbucb2940253355369912d47bc27b5ee56f", // a unique, per-contest ID; changes every week
  "participant_uid": "9ca278ee810c9181368fe9dde6b8f6", // a unique, per-user ID. (currently) stays fixed after first visit.
  "target_id": 1247, // the index of the caption which the user rated
  "target_reward": 2 // the rating they gave the caption. unfunny = 1, somewhat funny = 2, funny = 3
}
```

The next query to display to the user is decided by looking at the priority list
of the most important captions to sample, which we predownload. We start with the
first previously-unseen caption in the priority list and step down the list in
order of decreasing priority.

The targets (captions) are fetched by `app.load()` at the same time as the
priority list; both are stored as JSON in a S3 bucket. The targets do not change
over the duration of a contest, but the priority list changes constantly as the
backend recieves answers and reupdates the internal model.
