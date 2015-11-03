# tutteli.auth for AngularJS

This module contains the following features:

- AuthService to perform log in, check authentication/authorisation

Following an example how to include it 

```javascript
//use the AuthService
angular.module('app', ['tutteli.auth']); 
```

##AuthService

The AuthService works based on broadcasts, inspired by [Gert Hengeveld's description](https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec) and the following events are supported:

```javascript
.constant('tutteli.auth.EVENTS', {
    loginSuccess: 'tutteli-auth-login-success',
    loginFailed: 'tutteli-auth-login-failed',
    logoutSuccess: 'tutteli-auth-logout-success',
    notAuthenticated: 'tutteli-auth-not-authenticated',
    notAuthorised: 'tutteli-auth-not-authorised'
})
```

For convenience and maximum forward compatibility we recommend to use the constant instead of listening on the hard-coded string. As an example:

```javascript
.controller('tutteli.LoginCtrl', 
  ['$rootScope', 'tutteli.auth.Events', 
  function($rootScope, AUTH_EVENTS){
    $rootScope.$on(AUTH_EVENTS.notAuthorised, function(event, url) {
        alert('You are not authorised to visit ' + url);
    });  
  }
]);
```

Following an example how the AuthService can be used to perform a log in:

```javascript
.controller('LoginCtrl', 
  ['$scope', 'tutteli.auth.AuthService', 
  function($scope, AuthService){
    $scope.login = function(username, password) {
        AuthService.login({
            username: username, 
            password: password 
            /* add further data like csrf token etc. , ... */
        });
    };
  }
]);
```

Whether the login was successful or not will be indicated with an event broadcasted on the `$rootScope`. Optionally you can perform an action directly in the controller by using the [Promise](https://docs.angularjs.org/api/ng/service/$q#the-promise-api) returned by the `login` method of the `AuthService`. Notice, that the `AuthService` merely forwards the object passed to the `login` method via http POST to the specified `LoginUrl` which can be modified as follows:

```javascript
.config(['tutteli.auth.AuthServiceProvider', function(AuthServiceProvider){
    //default value is href of the <base> tag + 'login'
    //e.g., <base href="/app/"/> results in login url: /app/login
    //this default value can be changed as follows:
    AuthServiceProvider.setLoginUrl('/login');
}]);
```

<br/>

---

Copyright 2015 Robert Stoll <rstoll@tutteli.ch>

Licensed under the Apache License, Version 2.0 (the "License");  
you may not use this file except in compliance with the License.  
You may obtain a copy of the License at  

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software  
distributed under the License is distributed on an "AS IS" BASIS,  
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  
See the License for the specific language governing permissions and  
limitations under the License.