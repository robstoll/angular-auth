/* 
 * This file is part of the project tutteli-angular-auth published under the Apache License 2.0
 * For the full copyright and license information, please have a look at LICENSE in the
 * root folder or visit https://github.com/robstoll/angular-auth
 */
(function(){
'use strict';

    LoginService.$inject = ['$http', 'tutteli.auth.login.form.loginUrl'];
    function LoginService($http, loginUrl){
        
        this.login = function(credentials){
            return $http.post(loginUrl, credentials);
        };
    }

    angular.module('tutteli.auth.login.form', ['tutteli.auth'])
    .service('tutteli.auth.login.form.LoginService', LoginService)
    .factory('tutteli.auth.login.form.loginUrl', function(){
        return angular.element(document.querySelector('base')).attr('href') + 'login';
    });

})();