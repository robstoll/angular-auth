/* 
 * This file is part of the project tutteli-angular-auth published under the Apache License 2.0
 * For the full copyright and license information, please have a look at LICENSE in the
 * root folder or visit https://github.com/robstoll/angular-auth
 */
'use strict';

describe('LoginService', function(){
    var loginUrl = 'login.html';
    
    beforeEach(module('tutteli.auth.login.form', function($provide){
        $provide.value('tutteli.auth.loginUrl', 'login.html');
    }));
    
    var LoginService = null;
    
    beforeEach(inject(['tutteli.auth.login.form.LoginService', function(_LoginService_){
        LoginService = _LoginService_;
    }]));
    
    describe('login:', function(){
        var $httpBackend = null,
            response = {bla: 'dummy'};
        
        beforeEach(inject(function(_$httpBackend_){
                $httpBackend = _$httpBackend_;
        }));
        
        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    
        describe('rejects when', function(){
            afterEach(function(){
                $httpBackend.expectPOST(loginUrl);
                var result = LoginService.login();
                $httpBackend.flush();
                result.then(function(){fail('was successful');}, function(errorResponse){
                    expect(errorResponse.data).toEqual(response);
                });
            });
            
            it('404', function(){
                $httpBackend.whenPOST(loginUrl).respond(404, response);
            });
            
            it('403', function(){
                $httpBackend.whenPOST(loginUrl).respond(403, response);
            });
            
            it('401', function(){
                $httpBackend.whenPOST(loginUrl).respond(403, response);
            });
            
            it('500', function(){
                $httpBackend.whenPOST(loginUrl).respond(500, response);
            });
        });
        
        it('fullfils if 200', function(){
            $httpBackend.whenPOST(loginUrl).respond(200, response);
            $httpBackend.expectPOST(loginUrl);
            var result = LoginService.login();
            $httpBackend.flush();
            result.then(function(resp){
                expect(resp.data).toEqual(response);
            }, function(){fail('error occurred');});
        });
        
        it('sends arbitrary credentials', function(){
            var dummy = {a: 'b'};
            $httpBackend.expectPOST(loginUrl, dummy).respond(200, response);
            LoginService.login(dummy);
            $httpBackend.flush();
        });
    });
});