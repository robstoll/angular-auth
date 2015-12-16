/* 
 * This file is part of the project tutteli-angular-auth published under the Apache License 2.0
 * For the full copyright and license information, please have a look at LICENSE in the
 * root folder or visit https://github.com/robstoll/angular-auth
 */
(function(){
'use strict';

angular.module('tutteli.auth', [
    'tutteli.auth.core', 
    'tutteli.auth.login.form', 
    'tutteli.auth.routing', 
    'tutteli.auth.http',
]);

/*
 * Partly inspired by 
 * https://medium.com/opinionated-angularjs/techniques-for-authentication-in-angularjs-applications-7bbf0346acec#.wsvrwi4v4
 */
angular.module('tutteli.auth.core', [])
    .service('tutteli.auth.AuthService', AuthService)
    .service('tutteli.auth.Session', Session)
    .provider('tutteli.auth.LoginService', LoginServiceProvider)
    .constant('tutteli.auth.EVENTS', {
        loginSuccess: 'tutteli-auth-login-success',
        loginFailed: 'tutteli-auth-login-failed',
        logoutSuccess: 'tutteli-auth-logout-success',
        notAuthenticated: 'tutteli-auth-not-authenticated',
        notAuthorised: 'tutteli-auth-not-authorised'
    }).constant('tutteli.auth.USER_ROLES', {
        noOne: 'noOne',
        authenticated: 'IS_AUTHENTICATED',
        editor: 'ROLE_EDITOR',
        admin: 'ROLE_ADMIN'
    });

function LoginServiceProvider(){
    var loginServiceName = 'tutteli.auth.login.form.LoginService';
    
    this.setLoginServiceName = function(name) {
        loginServiceName = name;
    };
    
    this.getLoginServiceName = function() {
        return loginServiceName;
    };
    
    this.$get = $get;
    $get.$inject = ['$injector'];
    function $get($injector) {
        return $injector.get(loginServiceName);
    }
}

AuthService.$inject = ['$rootScope', '$q', 'tutteli.auth.LoginService', 'tutteli.auth.Session', 'tutteli.auth.USER_ROLES', 'tutteli.auth.EVENTS'];
function AuthService($rootScope, $q, LoginService, Session, USER_ROLES, AUTH_EVENTS) {
    
   this.login = function (credentials) {
        return LoginService.login(credentials).then(function (result) {
            if (result.data.user === undefined) {
                return $q.reject({msg:'user was not defined in the returned data', data: result.data});
            }
            Session.create(result.data.user);
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, result);
        }, function(errorResponse){
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed, errorResponse);
            return $q.reject(errorResponse);
        });
    };
    
    this.logout = function() {
        return LoginService.logout().then(function (result) {
            $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess, Session);
            Session.destroy();
        });
    };
        
    this.isAuthenticated = function () {
        return Session.user !== undefined;
    };
        
    this.isAuthorised = function (authorisedRoles) {
        var authorised = authorisedRoles === undefined 
            || angular.isArray(authorisedRoles) && authorisedRoles.length == 0;
        
        //if authorised=false then it requires a logged in user
        if (!authorised && Session.user !== undefined) {
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
    
    this.isCurrent = function(userId){
        return Session.user !== undefined && Session.user.id == userId;
    };
}  

function Session() {
    
    this.create = function (user) {
        if (user.role === undefined) {
            throw new Error('user object needs to provide a property role');
        }
        
        this.user = user;
    };
    
    this.destroy = function () {
        delete this.user;
    };
}

})();
