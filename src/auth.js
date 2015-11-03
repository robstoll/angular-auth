/* 
 * This file is part of the project tutteli-angular-auth published under the Apache License 2.0
 * For the full copyright and license information, please have a look at LICENSE in the
 * root folder or visit https://github.com/robstoll/angular-auth
 */
'use strict';
(function(){

angular.module('tutteli.auth.full', ['tutteli.auth', 'tutteli.auth.routing', 'tutteli.auth.http']);

AuthService.$inject = ['$rootScope', '$http', 'tutteli.auth.Session', 'tutteli.auth.USER_ROLES', 'tutteli.auth.EVENTS', 'tutteli.auth.loginUrl'];
function AuthService($rootScope, $http, Session, USER_ROLES, AUTH_EVENTS, loginUrl) {
    
   this.login = function (credentials) {
        return $http.post(loginUrl, credentials).success(function (result) {
            Session.create(result.user);
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, result);
        }).error(function(errorResponse){
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed, errorResponse);
        });
    };
        
    this.isAuthenticated = function () {
        return Session.user !== undefined;
    };
        
    this.isAuthorised = function (authorisedRoles) {
        var authorised = authorisedRoles == undefined 
            || angular.isArray(authorisedRoles) && authorisedRoles.length == 0;
        
        //if authorised=false then it requires a logged in user
        if (!authorised && Session.user !== undefined){
            authorised = authorisedRoles == USER_ROLES.authenticated;
            //if authorised=false then a special role is required
            if (!authorised) {
                if (!angular.isArray(authorisedRoles)) {
                    authorisedRoles = [authorisedRoles];
                }
                authorised = authorisedRoles.indexOf(Session.user.role) !== -1;
            }
        }
        return authorised; 
    };
}  

function Session() {
    
    this.create = function (user) {
        if (user.role == undefined){
            throw new Error('user object needs to provide a property role');
        }
        
        this.user = user;
    };
    
    this.destroy = function () {
        delete this.user;
    };
}


/*
 * Partly inspired by 
 * https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec#.wsvrwi4v4
 */
angular.module('tutteli.auth', [])
.service('tutteli.auth.AuthService', AuthService)
.service('tutteli.auth.Session', Session)
.constant('tutteli.auth.EVENTS', {
    loginSuccess: 'tutteli-auth-login-success',
    loginFailed: 'tutteli-auth-login-failed',
    logoutSuccess: 'tutteli-auth-logout-success',
    notAuthenticated: 'tutteli-auth-not-authenticated',
    notAuthorised: 'tutteli-auth-not-authorised'
}).constant('tutteli.auth.USER_ROLES', {
    authenticated: 'IS_AUTHENTICATED',
    editor: 'ROLE_EDITOR',
    admin: 'ROLE_ADMIN'
}).factory('tutteli.auth.loginUrl', function(){
    return angular.element(document.querySelector('base')).attr('href') + 'login';
});

angular.module('tutteli.auth.routing', ['ui.router', 'tutteli.auth'])
.run(
  ['$rootScope', 'tutteli.auth.AuthService', 'tutteli.auth.EVENTS',
  function($rootScope, AuthService, AUTH_EVENTS) {
  
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
        if (!AuthService.isAuthorised(toState.data.authRoles)) {
            event.preventDefault();
            if (AuthService.isAuthenticated()) {
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorised, toState.url);
            } else {
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            }
        }
    });
    
  }
]);

HttpInterceptor.$inject = ['$rootScope', '$q', 'tutteli.auth.EVENTS', 'tutteli.auth.loginUrl'];
function HttpInterceptor($rootScope, $q, AUTH_EVENTS, LoginUrl) {
    
    this.responseError = function(response) {
        if (response.status == 403) {
            $rootScope.$broadcast(AUTH_EVENTS.notAuthorised, response.data);
        } else if(response.status == 401 && response.config.url != LoginUrl) {
            $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, response.data);
        }
        return $q.reject(response);
    };
}

angular.module('tutteli.auth.http', ['tutteli.auth'])
.config(['$httpProvider', function ($httpProvider) {
    $httpProvider.interceptors.push('tutteli.auth.HttpInterceptor');
}]).service('tutteli.auth.HttpInterceptor', HttpInterceptor);

})();
