# Change log

### v0.0.17
- Introduced a new helper method `shouldRecreateReceiver` that inspects errors (e.g., `GeneralError`, `ServiceCommunicationError`, errors containing "Unknown error occurred", or when `retryable` is true) to determine if the receiver should be reinitialized. This change ensures that transient or fatal connection errors do not break the polling loop.
- Instead of rejecting the promise on errors (which would break the subscription), the updated logic:
  - Logs the error.
  - Checks if the error warrants a receiver re-creation via `shouldRecreateReceiver`.
  - Closes the existing receiver if needed and then reinitializes it.
  - Continues polling after a short delay (1 second) to maintain uninterrupted message processing.
- Changed the lock renewal interval from 30 seconds to 25 seconds. This provides a safer margin to renew locks before they expire.
- The calling of `subscribe` and `publish` methods remain unchanged.
    

### v0.0.16
- Added ability to subscribe number concurrent messages (configurable). If maxConcurrentMessages is not passed then it will process the messages according to the number of CPUs.
  `Core.getTopic('topicName', configuration || null, maxConcurrentMessages=2)`
- Added ability to hold on acknowledgement until processing is completed
  - Added private processMessage function which will hold the acknowledgement until message is fully processed
    

### v0.0.6
- Introduces Topic and subscription methods in Core.
- Added methods
    - Core.getTopic()
- Added classes and methods
    - Topic
        - publish
        - subscribe