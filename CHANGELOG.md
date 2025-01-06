# Change log

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