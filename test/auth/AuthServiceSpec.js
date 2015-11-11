/* 
 * This file is part of the project tutteli-angular-auth published under the Apache License 2.0
 * For the full copyright and license information, please have a look at LICENSE in the
 * root folder or visit https://github.com/robstoll/angular-auth
 */
'use strict';
    
describe('AuthService', function(){
    var AuthService = null;
    var loginUrl = '/login';
    var LoginService = null;
    
    beforeEach(module('tutteli.auth.core', function($provide){
        LoginService = jasmine.createSpyObj('LoginService', ['login']);
        $provide.value('tutteli.auth.LoginService', LoginService);
    }));
    
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
        var $rootScope = null, 
            AUTH_EVENTS = null, 
            Session = null;
        
        beforeEach(function(){
            inject(['$rootScope', 'tutteli.auth.EVENTS', 'tutteli.auth.Session',
                   function(_$rootScope_, _AUTH_EVENTS_, _Session_){
                $rootScope = _$rootScope_;
                spyOn($rootScope, '$broadcast');
                AUTH_EVENTS = _AUTH_EVENTS_;
                Session = _Session_;
            }]);
        });

        describe('LoginService rejects -', function(){
            var response = {};
            beforeEach(inject(function($q){
                LoginService.login.and.callFake(function(){return $q.reject(response);});
            }));
            
            it('broadcasts AUTH_EVENTS.loginFailure', function(){
                AuthService.login();
                $rootScope.$apply();
                expect($rootScope.$broadcast).toHaveBeenCalledWith(AUTH_EVENTS.loginFailed, response);
            });
            
            it('does not create a Session', function(){
                spyOn(Session, 'create');
                AuthService.login();
                $rootScope.$apply();
                expect(Session.user).toEqual(undefined);
                expect(Session.create).not.toHaveBeenCalled();
            });
            
            it('returns a promise which rejects', function(){
                AuthService.login().then(function(){fail('returned a promiss which fulfilled');});
            });
        });
        
        describe('LoginService fulfills -', function(){
            var user = {role:'admin'};
            var data = {user: user, additionalInfo: 'bla'};
            var response = {data: data};
            beforeEach(inject(function($q){
                LoginService.login.and.callFake(function(){return $q.resolve(response);});
            }));
            
            it('broadcasts AUTH_EVENTS.loginSuccess', function(){
                AuthService.login();
                $rootScope.$apply();
                expect($rootScope.$broadcast).toHaveBeenCalledWith(AUTH_EVENTS.loginSuccess, response);
            });
            
            it('creates Session', function(){
                AuthService.login();
                $rootScope.$apply();
                expect(Session.user).toEqual(user);
            });
        });
        
        it('LoginService fulfills but returns wrong content - returns rejected promise', inject(function($q){
            var response = {data: {noUser:''}};
            LoginService.login.and.callFake(function(){return $q.resolve(response);});
            var result = AuthService.login();
            $rootScope.$apply();
            result.then(function(){fail('returned a promise which fullfilled');});
        }));
    });
    
});
