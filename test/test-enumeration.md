# Core unit test cases
This document outlines the unit test cases written for each class within the core framework

## Test framework
Unit test cases are written using `jest` framework along with `babel` integration to get the coverage report.

## Test cases

| Component | Feature under test | Scenario | Expectation | Status |
|-|-|-|-|-|
| Authorizer | Hosted Configuration| When provider is Hosted | Expect the Core to give instance of HostedAuthorizer | :white_check_mark: |
| Authorizer | Simulated Configuration| When provider is Simulated | Expect the Core to give instance of SimulatedAuthorizer | :white_check_mark: |
| Authorizer | Base URL | When hosted authorizer is requested with no base URL | Expect baseURL to be picked from environment | :white_check_mark:|
| Authorizer | Base URL| When hosted authorizer is requested with base URL | Expect baseURL to be picked from parameter| :white_check_mark:|
| Authorizer | has Permission | When no roles are provided in permission request| Expect the authorizer to reject with 'No roles provided' string |:white_check_mark:|
| Authorizer | has Permission | When Simulated authorizer is provided with permission request of predefined user | Expect to return false for hasPermission | :white_check_mark:|
| Authrorizer | has Permission | When Simulated authorizer is provided with permission request of other than predefined user | Expect to return true for hasPermission | :white_check_mark:| 
| Authorizer | has Permission | When Hosted Authorizer is provided with valid permission request | Expect to return has Permssion method to true | :white_check_mark:|
| Authorizer | has Permission | When Hosted Authorizer is provided with invalid permission request  | Expect to return hasPermission method with false | :white_check_mark:|
| Authorizer | BaseURL | When Hosted Authorizer is provided with invalid baseURL | Expect has Permission to throw error | :white_check_mark:|
| Azure Analytic | Instantiate | When initialized with queuename | Expect the instance to be true | :white_check_mark:|
| Azure Analytic | record | When record message is called | Expect the internal add and send to queue are called | :white_check_mark:|
| Azure Auditor | Instantiate | When initialized with queuename | Expect the instance to be true | :white_check_mark: |
| Azure Auditor | addEvent | When an event is added to auditor | Expect the event to be sent to queue with add | :white_check_mark:|
| Azure Auditor | addRequest | When a request is added to auditor| Expect the event to be added to internal queue  | :white_check_mark:|
| Azure Auditor | updateRequest | When a request is updated from auditor | Expect the event to be added to internal queue | :white_check_mark:|
| Azure File Entity | Initialize | When initialized with a name and client | Expect the object to be true | :white_check_mark:|
| Azure File Entity | getStream | When getStream is called on file entity | Expect the  stream to be got from internal blobclient | :white_check_mark: |
| Azure File Entity | getBodyText | When getBodyText is called | Expect the text to be given from internal blobclient object | :white_check_mark:|
| Azure File Entity | upload | When uploaded with content| Expect the blobclient upload method is called with the same stream |



