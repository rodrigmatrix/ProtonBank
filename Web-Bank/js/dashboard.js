// var jwt = require('json-web-token')
var token = store.get('token')

if(token == null){
    window.open("login.html","_self")
}
else{
    var decoded = jwt(token)
    
}