# tutteli.auth for AngularJS

This module contains the following services:

- AuthService to perform a log in
- HttpInterceptor to react to HTTP 401 (Unauthorized) and 403 (Forbidden)
- [ui.router](https://github.com/angular-ui/ui-router) "interceptor" to verify if the current user is authorised to visit the particular route.

<br/>

---

Copyright 2015 Robert Stoll <rstoll@tutteli.ch>

Licensed under the Apache License, Version 2.0 (the "License");  
you may not use this file except in compliance with the License.  
You may obtain a copy of the License at  

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software  
distributed under the License is distributed on an "AS IS" BASIS,  
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  
See the License for the specific language governing permissions and  
limitations under the License.