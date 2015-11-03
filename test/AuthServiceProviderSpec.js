/* 
 * This file is part of the project tutteli.auth published under the Apache License 2.0
 * For the full copyright and license information, please have a look at LICENSE in the
 * root folder or visit https://github.com/robstoll/angular-auth
 */
'use strict';

describe('AuthServiceProvider', function(){
    
    it('LoginUrl is href from <base> and appends login', function(){
        angular.element(document.querySelector('head')).append('<base href="/test/"/>');      
        module('tutteli.auth', ['tutteli.auth.AuthServiceProvider', function(provider){
            expect(provider.getLoginUrl()).toBe('/test/login');  
        }]);
        
        inject(function(){});
    });
    
    it('LoginUrl can be modified', function(){
        angular.element(document.querySelector('head')).append('<base href="/test/"/>');      
        module('tutteli.auth', ['tutteli.auth.AuthServiceProvider', function(provider){
            expect(provider.getLoginUrl()).not.toBe('test.html');
            provider.setLoginUrl('test.html');
            expect(provider.getLoginUrl()).toBe('test.html');
        }]);
        
        inject(function(){});
    });
    
    it('LoginUrl is used by login method', function(){
        module('tutteli.auth', ['tutteli.auth.AuthServiceProvider', function(provider){
            provider.setLoginUrl('login.html');
        }]);
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

    
describe('AuthService', function(){
    var AuthService = null;
    var loginUrl = '/login';
    beforeEach(module('tutteli.auth', ['tutteli.auth.AuthServiceProvider', function(provider){
        provider.setLoginUrl(loginUrl);
    }]));
    beforeEach(inject(['tutteli.auth.AuthService', function(_AuthService_){
        AuthService = _AuthService_;
    }]));
    
    describe('isAuthenticated:', function(){
        it('is not logged in - returns false', function(){
            expect(AuthService.isAuthenticated()).toBe(false); 
        }); 
        
        it('user is set - returns true', function(){
            inject(['tutteli.auth.Session', function(Session){
                Session.create({role: "admin"});
                expect(AuthService.isAuthenticated()).toBe(true);
            }]);
        });
    });
    
    describe('isAuthorised:', function(){
        it('is not logged in and authorisedRoles is undefined - returns true', function(){
            expect(AuthService.isAuthorised()).toBe(true);
        });
        
        it('is not logged in and authorisedRoles is [] - returns true', function(){
            expect(AuthService.isAuthorised([])).toBe(true);
        });
        
        it('is not logged in and authorisedRoles is ["dummy"] - returns false', function(){
            expect(AuthService.isAuthorised(["dummy"])).toBe(false);
        });
        
        it('is logged in and authorisedRoles is USER_ROLES.authenticated - returns true', function(){
            inject(['tutteli.auth.Session', 'tutteli.auth.USER_ROLES', 
                   function(Session, USER_ROLES){
                Session.create({role:'admin'});
                expect(AuthService.isAuthorised(USER_ROLES.authenticated)).toBe(true);    
            }]);
        });
        
        it('is logged in but role is wrong - returns false', function(){
            inject(['tutteli.auth.Session', 'tutteli.auth.USER_ROLES', 
                   function(Session, USER_ROLES){
                Session.create({role:'nonExistingRole'});
                expect(AuthService.isAuthorised(USER_ROLES.admin)).toBe(false);    
            }]);
        });
    });
    
    describe('login:', function(){
        var $httpBackend = null,
            $rootScope = null, 
            AUTH_EVENTS = null;
        
        beforeEach(function(){
            inject(['$rootScope', '$httpBackend', 'tutteli.auth.EVENTS',
                   function(_$rootScope_, _$httpBackend_, _AUTH_EVENTS_){
                $rootScope = _$rootScope_;
                spyOn($rootScope, '$broadcast');
                $httpBackend = _$httpBackend_;
                AUTH_EVENTS = _AUTH_EVENTS_;
            }]);
        });
        
        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('broadcasts with loginFailed', function(){
            var response = {bla: 'dummy'};
            afterEach(function(){
                $httpBackend.expectPOST(loginUrl);
                AuthService.login();
                $httpBackend.flush();
                expect($rootScope.$broadcast).toHaveBeenCalledWith(AUTH_EVENTS.loginFailed, response);
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
        });
        
        it('is successful - broadcasts with loginSuccess and creates Session', 
                inject(['tutteli.auth.Session', function(Session){
            expect(Session.user).toBe(undefined);
            var user = {role:'admin'};
            var response = {user: user, additionalInfo: 'bla'};
            $httpBackend.whenPOST(loginUrl).respond(200, response);
            $httpBackend.expectPOST(loginUrl);
            AuthService.login();
            $httpBackend.flush();
            expect($rootScope.$broadcast).toHaveBeenCalledWith(AUTH_EVENTS.loginSuccess, response);
            expect(Session.user).toEqual(user);
        }]));
    });
    
});
