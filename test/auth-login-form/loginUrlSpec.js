/* 
 * This file is part of the project tutteli-angular-auth published under the Apache License 2.0
 * For the full copyright and license information, please have a look at LICENSE in the
 * root folder or visit https://github.com/robstoll/angular-auth
 */
'use strict';


describe('loginUrl', function(){
    
    it('is href from <base> and appends login', function(){
        angular.element(document.querySelector('head')).append('<base href="/test/"/>');      
        module('tutteli.auth.login.form');
        
        inject(['tutteli.auth.loginUrl', function(loginUrl){
            expect(loginUrl).toBe('/test/login');
        }]);
    });
    
    it('is used by LoginService\'s login method', function(){
        module('tutteli.auth.login.form', function($provide){
            $provide.value('tutteli.auth.loginUrl', 'login.html');
        });
        
        inject(['$httpBackend', 'tutteli.auth.login.form.LoginService', function($httpBackend, LoginService){
            $httpBackend.whenPOST('login.html').respond(404);
            $httpBackend.expectPOST('login.html');
            LoginService.login();
            $httpBackend.flush();
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        }]);
    });
});