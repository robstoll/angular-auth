/* 
 * This file is part of the project tutteli-angular-auth published under the Apache License 2.0
 * For the full copyright and license information, please have a look at LICENSE in the
 * root folder or visit https://github.com/robstoll/angular-auth
 */
'use strict';


describe('loginUrl', function(){
    
    it('is href from <base> and appends login', function(){
        angular.element(document.querySelector('head')).append('<base href="/test/"/>');      
        module('tutteli.auth');
        
        inject(['tutteli.auth.loginUrl', function(loginUrl){
            expect(loginUrl).toBe('/test/login');
        }]);
    });
    
    it('LoginUrl is used by login method', function(){
        module('tutteli.auth', function($provide){
            $provide.value('tutteli.auth.loginUrl', 'login.html');
        });
        
        inject(['$httpBackend', 'tutteli.auth.AuthService', function($httpBackend, AuthService){
            $httpBackend.whenPOST('login.html').respond(404);
            $httpBackend.expectPOST('login.html');
            AuthService.login();
            $httpBackend.flush();
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        }]);
    });
});