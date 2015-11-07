# tutteli.auth for AngularJS

[![Build Status](https://travis-ci.org/robstoll/angular-auth.svg?branch=master)](https://travis-ci.org/robstoll/angular-auth)

This module contains the following features:

- [AuthService](#authservice) to perform log in, check authentication/authorisation
- [ui.router Interceptor](#routing-interceptor) to verify if the current user is authorised to visit the particular route
- [Http Interceptor](#http-interceptor) to react to HTTP `401 Unauthorized` and `403 Forbidden`


##Installation

The code is quite small, so it is probably good enough to just copy the content of [src/auth.js](https://github.com/robstoll/angular-auth/blob/master/src/auth.js) and [src/auth-login-form.js](https://github.com/robstoll/angular-auth/blob/master/src/auth-login-form.js) manually (there are separate files for routing and http). Alternatively, you can install it with bower 
`bower install tutteli-angular-auth --save`

Following an example how to include it 

```javascript
//use AuthService + form login + routing interception + http interception
angular.module('appFullAuth', ['tutteli.auth']); 
//use only AuthService + form login 
angular.module('app', ['tutteli.auth.login.form']); 
//use routing interception + AuthService (login not possible)
angular.module('appWithUiRouting', ['tutteli.auth.routing']); 
//use routing interception + AuthService + form login
angular.module('appWithUiRouting', ['tutteli.auth.routing', 
                                    'tutteli.auth.login.form']); 
//use http interception + AuthService (login not possible)
angular.module('appInterceptHttp', ['tutteli.auth.http']); 

```

##AuthService

The `AuthService` works based on broadcasts, inspired by [Gert Hengeveld's description](https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec) and the following events are supported:

```javascript
.constant('tutteli.auth.EVENTS', {
    loginSuccess: 'tutteli-auth-login-success',
    loginFailed: 'tutteli-auth-login-failed',
    logoutSuccess: 'tutteli-auth-logout-success',
    notAuthenticated: 'tutteli-auth-not-authenticated',
    notAuthorised: 'tutteli-auth-not-authorised'
})
```

<a name="listening-example"></a>For convenience and maximum forward compatibility we recommend to use the constant `'tutteli.auth.EVENTS'` to register for an event instead of using a hard-coded string. As an example:

```javascript
.controller('tutteli.LoginCtrl', 
  ['$rootScope', 'tutteli.auth.EVENTS', 
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

Whether the login was successful or not will be indicated with an event broadcasted on the `$rootScope`. Optionally you can perform an action directly in the controller by using the [Promise](https://docs.angularjs.org/api/ng/service/$q#the-promise-api) returned by the `login` method of the `AuthService`. Notice, that the `AuthService` merely forwards the object passed to the `login` method via http POST to the specified value `'tutteli.auth.loginUrl'` which can simply be redefined if desired:

```javascript
//default value is based on the href attribute of the <base> tag + 'login'
//e.g., <base href="/app/"/> results in login url: /app/login
//this default value can be changed as follows:

angular.module('app',[])
//static url
.value('tutteli.auth.loginUrl', 'own/login/url')
//dynamic url
.factory('tutteli.authLoginUrl', function(){
    return calculateLoginUrl();
});
```


##Routing Interceptor

The routing interceptor requires [ui.router](https://github.com/angular-ui/ui-router) to work and an additional data entry `authRoles` per route. Omitting the additional data entry corresponds to an empty list which indicates anonymous access. The AuthService does currently not support role hierarchies and hence one needs to indicate all roles, unless only authentication is required but not a special role. In this case `USER_ROLES.authenticated` can be used, `'is-authenticated'` respectively.

Following an example:

```javascript
.config(
  ['$locationProvider','$stateProvider', 'tutteli.auth.USER_ROLES',
  function($locationProvider, $stateProvider, USER_ROLES) {
      
    $locationProvider.html5Mode(true);
    $stateProvider.state('login', {
        url: '/login',
        controller: 'tutteli.LoginCtrl',
        templateUrl: 'login.tpl',
        data : {
            authRoles : [] //anonymous access
        }
    }).state('home', {
        url: '/',
        templateUrl: 'dashboard.html',
        data : {
            authRoles : [USER_ROLES.authenticated]
        }
    });
  }
]);
```



##Http Interceptor

The http interceptor broadcasts events in case a 401 or 403 response returns from the server unless the 401 response follows a login attempt. The constant `'tutteli.auth.EVENTS'` can be used to listen to the events. `notAuthorised` is broadcasted in case of 403 and `notAuthenticated` in case of a 401. See [the example](#listening-example) above in the [AuthService](#authservice) section.

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