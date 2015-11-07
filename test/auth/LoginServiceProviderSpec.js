/* 
 * This file is part of the project tutteli-angular-auth published under the Apache License 2.0
 * For the full copyright and license information, please have a look at LICENSE in the
 * root folder or visit https://github.com/robstoll/angular-auth
 */
'use strict';

describe('LoginServiceProvider', function(){
    var LoginServiceProvider = null;
    
    beforeEach(module('tutteli.auth', ['tutteli.auth.LoginServiceProvider', function(provider){
        LoginServiceProvider = provider;
    }]));
        
    describe('LoginServiceName:', function(){
        beforeEach(inject(function(){}));
        var defaultName = 'tutteli.auth.login.form.LoginService';
        
        it('has \'' + defaultName + '\' as default', function(){            
            expect(LoginServiceProvider.getLoginServiceName()).toBe(defaultName);
        });
        
        it('can be modified', function(){
            expect(LoginServiceProvider.getLoginServiceName()).not.toBe('dummy');
            LoginServiceProvider.setLoginServiceName('dummy');
            expect(LoginServiceProvider.getLoginServiceName()).toBe('dummy');
        });
    });
    
    describe('$get:', function(){
        it('returns defined dependency', function(){
            var dummy = {};
            module(function($provide){
                $provide.value('dummy', dummy);
                LoginServiceProvider.setLoginServiceName('dummy');
            });
            inject(['tutteli.auth.LoginService', function(service){
                expect(service).toBe(dummy);
            }]);
        });
    }); 
});