/* 
 * This file is part of the project tutteli-angular-auth published under the Apache License 2.0
 * For the full copyright and license information, please have a look at LICENSE in the
 * root folder or visit https://github.com/robstoll/angular-auth
 */
'use strict';

describe('RoutingInterceptor', function(){
    var $rootScope = null, 
        AuthService = null,
        AUTH_EVENTS = null;
    beforeEach(function(){
        angular.module('ui.router', []);
        module('tutteli.auth.routing', function($provide){
            var LoginService = jasmine.createSpyObj('LoginService', ['login']);
            $provide.value('tutteli.auth.LoginService', LoginService);
        });
        inject(['$rootScope', 'tutteli.auth.AuthService', 'tutteli.auth.EVENTS', 
                function(_$rootScope_, _AuthService_, _AUTH_EVENTS_){
            $rootScope = _$rootScope_;
            AuthService = _AuthService_;
            AUTH_EVENTS = _AUTH_EVENTS_;
        }]);
    });
    
    it('has registered for $stateChangeStart', function(){
        spyOn(AuthService, 'isAuthorised');
        $rootScope.$broadcast('$stateChangeStart', {data:{authRoles:'admin'}});
        expect(AuthService.isAuthorised).toHaveBeenCalledWith('admin');        
    });
     
    it('state has no data property - passes undefined to AuthService', function(){
        spyOn(AuthService, 'isAuthorised');
        $rootScope.$broadcast('$stateChangeStart', {});
        expect(AuthService.isAuthorised).toHaveBeenCalledWith(undefined);
    });
    
    it('state\'s data has no authRoles property - passes undefined to AuthService', function(){
        spyOn(AuthService, 'isAuthorised');
        $rootScope.$broadcast('$stateChangeStart', {data:{}});
        expect(AuthService.isAuthorised).toHaveBeenCalledWith(undefined);
    });
    
    it('is authorised - defaultPrevented = false', function(){
        spyOn(AuthService, 'isAuthorised').and.returnValue(true);
        var result = $rootScope.$broadcast('$stateChangeStart', {data:{authRoles:'admin'}});
        expect(result.defaultPrevented).toBe(false);
    });
    
    it('is not authorised and not authenticated - defaultPrevented = true and notAuthenticated broadcasted', function(){
        spyOn(AuthService, 'isAuthorised').and.returnValue(false);
        spyOn(AuthService, 'isAuthenticated').and.returnValue(false);
        spyOn($rootScope, '$broadcast').and.callThrough();
        var data = {data:{authRoles:'admin'}};

        var result = $rootScope.$broadcast('$stateChangeStart', data);
        
        expect(result.defaultPrevented).toBe(true);
        expect($rootScope.$broadcast).toHaveBeenCalledWith(AUTH_EVENTS.notAuthenticated, {toState: data, toParams: undefined});
    });
    
    it('is not authorised and authenticated - defaultPrevented = true and notAuthorised broadcasted', function(){
        spyOn(AuthService, 'isAuthorised').and.returnValue(false);
        spyOn(AuthService, 'isAuthenticated').and.returnValue(true);
        spyOn($rootScope, '$broadcast').and.callThrough();
        var data = {data:{authRoles:'admin'}, url:'test.html'};
        
        var result = $rootScope.$broadcast('$stateChangeStart', data);
        
        expect(result.defaultPrevented).toBe(true);
        expect($rootScope.$broadcast).toHaveBeenCalledWith(AUTH_EVENTS.notAuthorised, {toState: data, toParams: undefined});
    });
});
