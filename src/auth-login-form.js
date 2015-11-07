/* 
 * This file is part of the project tutteli-angular-auth published under the Apache License 2.0
 * For the full copyright and license information, please have a look at LICENSE in the
 * root folder or visit https://github.com/robstoll/angular-auth
 */
(function(){
'use strict';

    LoginService.$inject = ['$http', 'tutteli.auth.loginUrl'];
    function LoginService($http, loginUrl){
        
        this.login = function(credentials){
            return $http.post(loginUrl, credentials);
        };
        
        this.getLoginUrls = function(){
            return [loginUrl];
        };
    }

    angular.module('tutteli.auth.login.form', [])
    .service('tutteli.auth.login.form.LoginService', LoginService)
    .factory('tutteli.auth.loginUrl', function(){
        return angular.element(document.querySelector('base')).attr('href') + 'login';
    });

})();