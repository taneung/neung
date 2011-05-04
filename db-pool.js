/* TEST async, DB Pool
 * netstat -an|grep 3306  // mysql
 * Require: async, node-mysql
 */
 
var Client = require('mysql').Client;
var async = require('async');

var seq = 0;    
var list = [];

for(var i =0; i<100;i++) {
    list.push(getUserList);
}            

var connectionPool = [];    
var maxPoolSize = 10;

var initConnection = function(callback) {
    for(var i=0; i < maxPoolSize; i++) {
        var client = new Client(),
            TEST_DATABASE = 'database_name';
            client.user = 'root';
            client.password = '';
            client.connect(function(err,results) {
                client.query('USE '+TEST_DATABASE, function(err, results){
                    console.log('USE DB');                  
                }); 
            });         
        connectionPool.push(client);
    }
    // TODO:  initConnection consequently, create connection for 10 connection pool
    
};

// initConnection();
// var list = {one:foo,two:getUserList,three:getStoreList};

async.series(initConnection,function(err, results){
    console.log('Err: ' + err, 'Results: ', results);
});

var getConnection = function() {
    return client;
};

function getUserList(callback) {    
            getConnection().query('SELECT * FROM users',
                function selectCb(err, results, fields) {
                    if (err) {
                        // throw err;
                        console.log('select error: ', err);
                    }
                    var userList = [];
                    for(var key in results) {
                        userList.push(results[key].username);
                    }
                    callback(null, userList);
                }
            );
}


/** TEST Parallel **/
function getStoreList(callback) {
    client.connect();
    client.query('USE '+TEST_DATABASE);
    client.query(
    'SELECT * FROM stores',
    function selectCb(err, results, fields) {
        if (err) {
        throw err;
        }
        var storeList = [];
        for(var key in results) {
            storeList.push(results[key].name);
        }
        client.end();
        callback(null, storeList);
    });
}

function foo(callback) {
    setTimeout(function() {
        console.log('hello', seq);
        seq++;
        callback(null, seq);
    },1000);
}

setTimeout(function(){},10000);            
    
