/* 
 * This file is part of the project tutteli-angular-auth published under the Apache License 2.0
 * For the full copyright and license information, please have a look at LICENSE in the
 * root folder or visit https://github.com/robstoll/angular-auth
 */
'use strict';

describe('Session', function() {
    var Session;
    
    beforeEach(module('tutteli.auth.core'));
    
    beforeEach(inject(['tutteli.auth.Session', function(_Session_) {
        Session = _Session_;
    }]));
    
    describe('create:', function() {
        it('not called - user is undefined', function() {
            expect(Session.user).toBe(undefined);
        });
        
        it('passed an object without property "role" - throws an exception', function() {
            var dummy = {};
            
            expect(function() {
                Session.create(dummy);    
            }).toThrow(new Error('user object needs to provide a property role'));
        });
        
        it('passed an object with property "role" - is set accordingly', function() {
           var dummy = {role: 'admin'};
           Session.create(dummy);
           expect(Session.user).toBe(dummy);
        }); 
    });
    
    describe('destroy:', function() {
        it('Session not created before - no error', function() {
            Session.destroy();    
        });
        
        it('Session created before - user is undefined', function() {
            Session.create({role: 'hello'});
            Session.destroy();
            expect(Session.user).toBe(undefined);
        });
    });
       
});