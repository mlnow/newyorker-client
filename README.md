# Implementation
## How do I implement this?
Look in `example/index.html` for commented code explaining how to wire this up.

## Where can I find an up-to-date `next.min.js` build?
TODO: insert CDN link.

# The underlying API
NEXT2 receives user judgements via POST calls to an endpoint, `$api_base/processAnswer`,
with JSON body data like:
```json
{
  "exp_uid": "cbucb2940253355369912d47bc27b5ee56f", // a unique, per-contest ID; changes every week
  "participant_uid": "9ca278ee810c9181368fe9dde6b8f6", // a unique, per-user ID. (currently) stays fixed after first visit.
  "target_id": 1247, // the index of the caption which the user rated
  "target_reward": 2 // the rating they gave the caption. unfunny = 1, somewhat funny = 2, funny = 3
}
```
