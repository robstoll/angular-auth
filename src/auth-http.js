/* 
 * This file is part of the project tutteli-angular-auth published under the Apache License 2.0
 * For the full copyright and license information, please have a look at LICENSE in the
 * root folder or visit https://github.com/robstoll/angular-auth
 */
(function(){
'use strict';

angular.module('tutteli.auth.http', ['tutteli.auth.core'])
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('tutteli.auth.HttpInterceptor');
    }])
    .service('tutteli.auth.HttpInterceptor', HttpInterceptor);

HttpInterceptor.$inject = ['$rootScope', '$q', 'tutteli.auth.EVENTS', 'tutteli.auth.loginUrl'];
function HttpInterceptor($rootScope, $q, AUTH_EVENTS, LoginUrl) {
    
    this.responseError = function(response) {
        if (response.status == 403) {
            $rootScope.$broadcast(AUTH_EVENTS.notAuthorised, {response: response});
        } else if(response.status == 401 && response.config.url != LoginUrl) {
            $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated, {response: response});
        }
        return $q.reject(response);
    };
}

})();