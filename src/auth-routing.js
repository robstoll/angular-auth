/* 
 * This file is part of the project tutteli-angular-auth published under the Apache License 2.0
 * For the full copyright and license information, please have a look at LICENSE in the
 * root folder or visit https://github.com/robstoll/angular-auth
 */
(function(){
'use strict';

angular.module('tutteli.auth.routing', ['ui.router', 'tutteli.auth.core'])
    .run(stateChangeHandler);


stateChangeHandler.$inject = ['$rootScope', 'tutteli.auth.AuthService', 'tutteli.auth.EVENTS'];
function stateChangeHandler($rootScope, AuthService, AUTH_EVENTS) {
  
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
        var roles = undefined;
        var userId = undefined;
        if (toState.data !== undefined) {
            roles = toState.data.authRoles;
            if (toState.data.userIdParamName !== undefined) {
                userId =  toParams[toState.data.userIdParamName];    
            }
        }
                
        if (!(AuthService.isAuthorised(roles) || AuthService.isCurrent(userId))) {
            event.preventDefault();
            if (AuthService.isAuthenticated()) {
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorised, toState.url);
            } else {
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            }
        }
    });
}

})();