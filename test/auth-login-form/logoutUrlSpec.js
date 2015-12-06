/* 
 * This file is part of the project tutteli-angular-auth published under the Apache License 2.0
 * For the full copyright and license information, please have a look at LICENSE in the
 * root folder or visit https://github.com/robstoll/angular-auth
 */
'use strict';


describe('logoutUrl', function(){
    
    it('is href from <base> and appends logout', function() {
        angular.element(document.querySelector('head')).append('<base href="/test/"/>');      
        module('tutteli.auth.login.form');
        
        inject(['tutteli.auth.logoutUrl', function(logoutUrl) {
            expect(logoutUrl).toBe('/test/logout');
        }]);
    });
    
    it('is used by LoginService\'s logout method', function() {
        var logoutUrl = 'logoutUrl.html';
        module('tutteli.auth.login.form', function($provide) {
            $provide.value('tutteli.auth.logoutUrl', logoutUrl);
        });
        
        inject(['$httpBackend', 'tutteli.auth.login.form.LoginService', function($httpBackend, LoginService) {
            $httpBackend.whenGET(logoutUrl).respond(404);
            $httpBackend.expectGET(logoutUrl);
            LoginService.logout();
            $httpBackend.flush();
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        }]);
    });
});