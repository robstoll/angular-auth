/* 
 * This file is part of the project tutteli-angular-auth published under the Apache License 2.0
 * For the full copyright and license information, please have a look at LICENSE in the
 * root folder or visit https://github.com/robstoll/angular-auth
 */
'use strict';

describe('HttpInterceptor', function(){
    it('is added to $httpProvider.interceptors', function(){
        module('tutteli.auth.http', function($httpProvider){
            expect($httpProvider.interceptors).toContain('tutteli.auth.HttpInterceptor');
        });
        inject(function(){});
    });
});

describe('HttpInterceptor', function(){
    var $rootScope = null,
    $httpBackend = null,
    $http = null,
    AUTH_EVENTS = null;
    var loginUrl = 'login.html';
    
    beforeEach(function(){
        module('tutteli.auth.http', function($provide){
            $provide.value('tutteli.auth.loginUrl', loginUrl);
        }); 
        inject(['$rootScope', '$httpBackend', '$http', 'tutteli.auth.EVENTS', 
            function(_$rootScope_,_$httpBackend_, _$http_, _AUTH_EVENTS_){
              $rootScope = _$rootScope_;
              $httpBackend = _$httpBackend_;
              $http = _$http_;
              AUTH_EVENTS = _AUTH_EVENTS_;
              spyOn($rootScope,'$broadcast');
        }]);
    });
    
    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
        
    it('is 401 and not login url - broadcasts AUTH_EVENTS.notAuthenticated', function() {
        var response = {msg:'hello'};
        $httpBackend.whenGET('dummy.tpl').respond(401, response);
        $http.get('dummy.tpl');
        $httpBackend.flush();
        expect($rootScope.$broadcast).toHaveBeenCalledWith(
                AUTH_EVENTS.notAuthenticated, {data: response, url: 'dummy.tpl'});
    });
    
    it('is 401 and login url - does not broadcast', function() {
        var response = {msg:'hello'};
        $httpBackend.whenGET(loginUrl).respond(401, response);
        $http.get(loginUrl);
        $httpBackend.flush();
        expect($rootScope.$broadcast).not.toHaveBeenCalled();
    });
    
    it('is 403 and not login url - broadcasts AUTH_EVENTS.notAuthorised', function() {
        var response = {msg:'hello'};
        $httpBackend.whenGET('dummy.tpl').respond(403, response);
        $http.get('dummy.tpl');
        $httpBackend.flush();
        expect($rootScope.$broadcast).toHaveBeenCalledWith(
                AUTH_EVENTS.notAuthorised, {data: response, url: 'dummy.tpl'});
    });
      
    it('is 403 and is login url - broadcasts AUTH_EVENTS.notAuthorised', function(){
        var response = {msg:'hello'};
        $httpBackend.whenGET(loginUrl).respond(403, response);
        $http.get(loginUrl);
        $httpBackend.flush();
        expect($rootScope.$broadcast).toHaveBeenCalledWith(
                AUTH_EVENTS.notAuthorised, {data: response, url: loginUrl});
    });
    
});