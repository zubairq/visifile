'use strict';


var numberOfSecondsAliveCheck = 60; 
var numberOfSecondsIndexFilesInterval = 5; 
var isPi = require('detect-rpi');
var username = "Unknown user";

var isWin = /^win/.test(process.platform);
var isRaspberryPi = isPi();
var serverwebsockets = [];

function require2(moduleName) {
	var pat;
	if (isWin) {
		pat = "require(process.cwd() + " + "'\\\\node_modules\\\\" + moduleName + "');";
	} else {
		pat = "require(path.join(__dirname, '../node_modules/" + moduleName + "'));";
	}
	
	//console.log('PATH: ' + pat);
	//console.log('    MODULE PATH: ' + process.cwd() + '/node_modules/' + moduleName);
    var reac = eval(pat);	
	return reac;
};


var fs           = require('fs');
var path         = require('path');
var mkdirp       = require('mkdirp')
const uuidv1 = require('uuid/v1');

if (!fs.existsSync(process.cwd() + "/node_modules") ) {
    copyFolderRecursiveSync(path.join(__dirname, "../node_modules")  , process.cwd() ); }

    if (!fs.existsSync(process.cwd() + "/node_macos64") ) {
	copyFolderRecursiveSync(path.join(__dirname, "../node_macos64")  , process.cwd() ); }

if (!fs.existsSync(process.cwd() + "/node_win32") ) {
    copyFolderRecursiveSync(path.join(__dirname, "../node_win32")  , process.cwd() ); }


if (!fs.existsSync(process.cwd() + "/node_pi") ) {
    copyFolderRecursiveSync(path.join(__dirname, "../node_pi")  , process.cwd() ); }



const mkdirSync = function (dirPath) {
  try {
    mkdirp.sync(dirPath)
  } catch (err) {
    //if (err.code !== 'EEXIST') throw err
  }
}
    if (isWin) {
        mkdirp.sync("public\\docs");
    } else {
        mkdirp.sync("public/docs");
    };
mkdirp.sync("uploads");


function copyNodeNativeAdapter( osName, moduleName, directoryToSaveTo , nativeFileName) {
    //console.log('Copy started of : ' + osName + ', '+ moduleName + ','+ directoryToSaveTo + ','+ nativeFileName);
	if (!fs.existsSync(process.cwd() + "/node_modules/" + moduleName + "/" + directoryToSaveTo + "/" + nativeFileName) ) {
		//console.log('* Creating native driver for: ' + moduleName);
		mkdirSync(process.cwd() + "/node_modules/" + moduleName +  "/" + directoryToSaveTo);
		copyFileSync(	 process.cwd() + "/node_" + osName + "/" + nativeFileName + "rename",
							process.cwd() + "/node_modules/" + moduleName + "/" + directoryToSaveTo + "/" + nativeFileName) ;
	}
	//console.log('Copy done');
}

if (isWin) {
    //console.log('******* WINDOWS *******');
	// copy WIndows 32 node native files
	copyNodeNativeAdapter( "win32", "sqlite3", 		"lib/binding/node-v48-win32-ia32" , "node_sqlite3.node")
    
    
    
} else if (isRaspberryPi) {
    //console.log('******* PI *******');
	// copy Raspberry PI ARM node native files
	copyNodeNativeAdapter( "pi", "sqlite3", 	"lib/binding/node-v48-linux-arm" , "node_sqlite3.node")
    
    
    
} else { //means Mac OS
    //console.log('******* MAC *******');
	// copy Mac OS 64 node native files
	copyNodeNativeAdapter( "macos64", "sqlite3", 	"lib/binding/node-v48-darwin-x64" , "node_sqlite3.node")
}

					

var dns          = require('dns');
var url          = require('url');
var net          = require('net');
var unzip        = require('unzip');
var postgresdb   = require('pg');
var ip           = require("ip");
var program      = require('commander');
var drivers      = new Object();
var connections  = new Object();
var queries      = new Object();
var express      = require('express')
var app          = express()
var expressWs    = require('express-ws')(app);
var timeout      = 0;
var init_drivers = false;
var port;
var hostaddress;
var typeOfSystem;
var centralHostAddress;
var centralHostPort;
var request      = require("request");
var toeval;
var open         = require('open');
var dbhelper     = require('../public/dbhelper');
var Excel = require('exceljs');
var compression = require('compression')
app.use(compression())
var crypto = require('crypto');
var PDFParser = require2("pdf2json");


var sqlite3   = require2('sqlite3');
console.log("Creating tables ... ");

console.log("1 ");
            
                
                


var sqliteSync = require('sqlite-sync');

console.log("2 ");
        
sqliteSync.connect('gosharedatasearch.sqlite3'); 
                
        try {
            console.log("2.1 ");
            console.log("2.2 ");
            sqliteSync.run("CREATE TABLE IF NOT EXISTS search_rows_hierarchy (document_binary_hash TEXT, parent_hash TEXT, child_hash TEXT);");
            sqliteSync.run("CREATE INDEX search_rows_hierarchy_document_binary_hash_idx ON search_rows_hierarchy (document_binary_hash);");
            sqliteSync.run("CREATE INDEX search_rows_hierarchy_parent_hash_idx ON search_rows_hierarchy (parent_hash);");
            sqliteSync.run("CREATE INDEX search_rows_hierarchy_child_hash_idx ON search_rows_hierarchy (child_hash);");

            console.log("2.3 ");
        } catch(err) {
            console.log(err);                    
        } finally {
            console.log("2.4 ");
            console.log("2.5 ");
        }
console.log("3");
  
            
        try {
            sqliteSync.run("CREATE TABLE IF NOT EXISTS drivers (id TEXT, name TEXT, type TEXT, code TEXT);");
        } catch(err) {
            console.log(err);
        } finally {
        }

                
console.log("4");
  
                
                
                
        try {
            sqliteSync.run("CREATE TABLE IF NOT EXISTS connections (id TEXT, name TEXT, driver TEXT, database TEXT, host TEXT, port TEXT ,connectString TEXT, user TEXT, password TEXT, fileName TEXT, size INTEGER, type TEXT, preview TEXT, hash TEXT, status TEXT);");
        } catch(err) {
            console.log(err);
        } finally {
        }
              

console.log("5");


              
        try {
            sqliteSync.run("CREATE TABLE IF NOT EXISTS queries (id TEXT, name TEXT, connection INTEGER, driver TEXT, size INTEGER, hash TEXT, type TEXT, fileName TEXT, definition TEXT, preview TEXT, status TEXT, index_status TEXT);");
        } catch(err) {
            console.log(err);
        } finally {
        }

console.log("6");
 
        
                
        try {
            console.log("6.1");
            sqliteSync.run("CREATE TABLE IF NOT EXISTS intranet_client_connects (id TEXT, internal_host TEXT, internal_port INTEGER, public_ip TEXT, via TEXT, public_host TEXT, user_name TEXT, client_user_name TEXT, when_connected INTEGER);");
            console.log("6.2");
        } catch(err) {
            console.log(err);
        } finally {
        }
console.log("6.3");

//sqliteSync.close();
        
        
console.log("7");


var dbsearch = new sqlite3.Database('gosharedatasearch.sqlite3');
//dbsearch.run("PRAGMA journal_mode=WAL;")
dbsearch.run("PRAGMA synchronous=OFF;")
dbsearch.run("PRAGMA count_changes=OFF;")
dbsearch.run("PRAGMA journal_mode=MEMORY;")
dbsearch.run("PRAGMA temp_store=MEMORY;")

        try
        {
            var stmt = dbsearch.all(
                "SELECT name FROM sqlite_master WHERE type='table' AND name='zfts_search_rows_hashed';",
                function(err, results) 
                {
                    if (!err) 
                    {
                        if( results.length == 0) 
                        {
                            dbsearch.serialize(function() 
                            {
                                dbsearch.run("CREATE VIRTUAL TABLE zfts_search_rows_hashed USING fts5(row_hash, data);");
                            });
                        }
                    }
                });
        } catch(err) {
            console.log(err);
        } finally {
        }

var stmt2 = null;
var stmt3 = null;
var setIn = null;
                                        
console.log("...done ");
console.log("");
                
                
var stopScan = false;
var inScan = false;
var XLSX = require('xlsx');
var csv = require('fast-csv');
var mammoth = require("mammoth");

var mysql      = require('mysql');

 function isExcelFile(fname) {
	 if (!fname) {
		return false;
	 };
	 var ext = fname.split('.').pop();
	 ext = ext.toLowerCase();
	 if (ext == "xls") return true;
	 if (ext == "xlsx") return true;
	 return false;
 }


  function isWordFile(fname) {
	 if (!fname) {
		return false;
	 };
	 var ext = fname.split('.').pop();
	 ext = ext.toLowerCase();
	 if (ext == "doc") return true;
	 if (ext == "docx") return true;
	 return false;
 }

  function isPdfFile(fname) {
	 if (!fname) {
		return false;
	 };
	 var ext = fname.split('.').pop();
	 ext = ext.toLowerCase();
	 if (ext == "pdf") return true;
	 return false;
 }
 
 
  function isCsvFile(fname) {
	 if (!fname) {
		return false;
	 };
	 var ext = fname.split('.').pop();
	 ext = ext.toLowerCase();
	 if (ext == "csv") return true;
	 return false;
 }


var stmtInsertIntoConnections = dbsearch.prepare(" insert into connections " + 
                            "    ( id, name, driver, size, hash, type, fileName ) " +
                            " values " + 
                            "    (?,  ?,?,?,  ?,?,?);");
var stmtInsertInsertIntoQueries = dbsearch.prepare(" insert into queries " + 
                            "    ( id, name, connection, driver, size, hash, fileName, type, definition, preview ) " +
                            " values " + 
                            "    (?,  ?,?,?,  ?,?,?, ?,?,?);");
function saveConnectionAndQueryForFile(fileId, fileType, size, fileName, fileType2) {
    console.log("... in saveConnectionAndQueryForFile:::: " + fileId)
    sendOverWebSockets({
                            type:   "server_scan_status",  
                            value:  "Found file " + fileName,
                            });
    if (!fileName) {
        return;
    };
    if (fileName.indexOf("$") != -1) {
        return;
    };
    if (fileName.indexOf("gsd_") != -1) {
        return;
    };
    try {
        var contents = fs.readFileSync(fileName, "utf8");
        var hash = crypto.createHash('sha1');
        hash.setEncoding('hex');
        hash.write(contents);
        hash.end();
        var sha1sum = hash.read();
                                        
        dbsearch.serialize(function() {
            var newid = uuidv1();
            stmtInsertIntoConnections.run(
                     newid,
                     fileId, 
                     fileType,
                     size,
                     sha1sum,
                     fileType2,
                     fileName, function(err) {
                            connections[newid] = {id: newid, name: fileId, driver: fileType, size: size, hash: sha1sum, type: fileType2, fileName: fileName };
                            
                            var saveTo;
                            if (isWin) {
                                saveTo = process.cwd() + "\\public\\docs\\" + "gsd_" + sha1sum.toString() + path.extname(fileName);
                            } else {
                                saveTo = process.cwd() + "/public/docs/" + "gsd_" + sha1sum.toString() + path.extname(fileName);
                            };
                            var copyfrom = fileName;
                            //console.log('Copy from : ' + copyfrom + ' to : ' + saveTo);
                            copyFileSync(copyfrom, saveTo);
                              
                              
                            dbsearch.serialize(function() {
                                    console.log(":      saving query ..." + fileId);                        
                                    var newqueryid = uuidv1();
                                    stmtInsertInsertIntoQueries.run(newqueryid,
                                             fileId, 
                                             newid,
                                             fileType,
                                             size,
                                             sha1sum,
                                             fileName,
                                             fileType2,
                                             JSON.stringify({} , null, 2),
                                             JSON.stringify([{message: 'No preview available'}] , null, 2),
                                             function(err) {
                                                 if (err) {
                                                    console.log('   err : ' + err);
                                                 }
                                                console.log('   save result set fileid 1 : ' + fileId );
                                                var fileId2 = fileId;
                                                console.log('   save result set fileid 2 : ' + fileId2 );
                                                var newqueryid2 = newqueryid;
                                                var fileType2 = fileType;
                                                var newid2 = newid;
                                                
                                                queries[newqueryid] = {id: newqueryid,
                                                                     name: fileId,
                                                                     connection: newid,
                                                                     driver: fileType, 
                                                                     size: size, 
                                                                     hash: sha1sum, 
                                                                     fileName: fileName, 
                                                                     type: fileType2,
                                                                     definition: JSON.stringify({} , null, 2), 
                                                                     preview: JSON.stringify([{message: 'No preview available'}] , null, 2)}

                                                        console.log('    ...  entering getresult v2:  '  + fileId2);
                                                        sendOverWebSockets({
                                                                                type: "uploaded",  
                                                                                id:   fileId2,
                                                                                query: 
                                                                                {
                                                                                    
                                                                                }});
                                                         
                                                    }
                                                );
                            });
                            console.log("... query saved: " + fileId);
                            
                         
                     });                     
        });
    } catch(err) {
        console.log("Error " + err + " with file: " + fileName);     
        return err; 
    } finally {
        
    }
}

 var walk = function(dir, done) {
   if (stopScan) {
       inScan = false;
         return;
   };
   ////console.log('dir: ' + dir);
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
            sendOverWebSockets({
                                    type:   "server_scan_status",  
                                    value:  "Scanning directory " + file,
                                    });
           setTimeout(function() {
                              walk(file, function(err) {
                            if (!--pending) done(null);
                          });
          }, 10 * 1000);
        } else {
		  if (isExcelFile(file)) {
                //console.log('file: ' + file);
  					var excelFile = file;
  						if (typeof excelFile !== "undefined") {
							var fileId = excelFile.replace(/[^\w\s]/gi,'');
  							console.log('Saving from walk   *file id: ' + fileId);
  							//console.log('   *size: ' + stat.size);

                            saveConnectionAndQueryForFile(fileId, 'excel', stat.size, excelFile, '|SPREADSHEET|');
									  
						}
					}
		  if (isCsvFile(file)) {
                //console.log('CSV file: ' + file);
  					var CSVFile = file;
  						if (typeof CSVFile !== "undefined") {
							var fileId = CSVFile.replace(/[^\w\s]/gi,'');
  							console.log('Saving from walk   *file id: ' + fileId);
  							//console.log('   *size: ' + stat.size);

                            saveConnectionAndQueryForFile(fileId, 'csv', stat.size, CSVFile, '|CSV|');
						}
					}
		  if (isWordFile(file)) {
                //console.log('CSV file: ' + file);
  					var WordFile = file;
  						if (typeof WordFile !== "undefined") {
							var fileId = WordFile.replace(/[^\w\s]/gi,'');
  							console.log('Saving from walk   *file id: ' + fileId);
  							//console.log('   *size: ' + stat.size);

                            saveConnectionAndQueryForFile(fileId, 'word', stat.size, WordFile, '|DOCUMENT|');
						}
					}
		  if (isPdfFile(file)) {
                //console.log('CSV file: ' + file);
  					var PdfFile = file;
  						if (typeof PdfFile !== "undefined") {
							var fileId = PdfFile.replace(/[^\w\s]/gi,'');
  							console.log('Saving from walk   *file id: ' + fileId);
  							//console.log('   *size: ' + stat.size);

                            saveConnectionAndQueryForFile(fileId, 'pdf', stat.size, PdfFile, '|DOCUMENT|');
						}
					}          if (!--pending) done(null);
        }
      });
    });
  });
};



path.join(__dirname, '../public/jquery-1.9.1.min.js')
path.join(__dirname, '../public/jquery.zoomooz.js')
path.join(__dirname, '../public/polyfill.min.js')
path.join(__dirname, '../src/oracle.js')
path.join(__dirname, '../src/postgres.js')
path.join(__dirname, '../src/excel.js')
path.join(__dirname, '../public/gosharedata_setup.js')
path.join(__dirname, '../public/intranet.js')
path.join(__dirname, '../public/tether.min.js')
path.join(__dirname, '../public/bootstrap.min.js')
path.join(__dirname, '../public/bootstrap.min.css')
path.join(__dirname, '../public/es6-shim.js')
path.join(__dirname, '../public/vue_app.css')
path.join(__dirname, '../public/dist/build.js')
//path.join(__dirname, '../oracle_driver.zip')
path.join(__dirname, '../public/gosharedata_logo.PNG')
path.join(__dirname, '../public/favicon.ico')
path.join(__dirname, '../public/driver_icons/excel.jpg')
path.join(__dirname, '../public/driver_icons/csv.jpg')
path.join(__dirname, '../public/driver_icons/oracle.jpg')
path.join(__dirname, '../public/driver_icons/postgres.jpg')
path.join(__dirname, '../public/driver_icons/mysql.jpg')
path.join(__dirname, '../public/index_pc_mode.html')
path.join(__dirname, '../public/index_add_files.html')
path.join(__dirname, '../public/dropzone.js')
path.join(__dirname, '../public/dropzone.css')
path.join(__dirname, '../public/locked.png')
path.join(__dirname, '../public/unlocked.png')
path.join(__dirname, '../public/gosharedata/list_intranet_servers.html')
path.join(__dirname, '../public/list_intranet_servers.html')
path.join(__dirname, '../public/\aframe_fonts/Roboto-msdf.json')
path.join(__dirname, '../public/\aframe_fonts/Roboto-msdf.png')
path.join(__dirname, '../public/\aframe_fonts/Aileron-Semibold.fnt')
path.join(__dirname, '../public/\aframe_fonts/Aileron-Semibold.png')
path.join(__dirname, '../public/\aframe_fonts/SourceCodePro.fnt')
path.join(__dirname, '../public/\aframe_fonts/SourceCodePro.png')




var getResult = function(source, connection, driver, definition, callback) {
    if (stmt2 == null) {
        stmt2 = dbsearch.prepare("INSERT INTO zfts_search_rows_hashed (row_hash, data) VALUES (?, ?)");
    }
    if (stmt3 == null) {
        stmt3 = dbsearch.prepare("INSERT INTO search_rows_hierarchy (document_binary_hash, parent_hash, child_hash) VALUES (?,?,?)");
    }
    if (setIn == null) {
        setIn =  dbsearch.prepare("UPDATE queries SET index_status = 'ERROR' WHERE id = ?");
    }
                        

    console.log("var getResult = function(" + source + ", " + connection + ", " + driver + ", " + JSON.stringify(definition));
    var error = new Object();
    if (connections[connection]) {
        try {
            drivers[driver]['get_v2'](connections[connection],definition,function(ordata) {
                if (ordata.error) {
                    console.log("****************** err 4:" + ordata.error);
                    callback.call(this,ordata);
                    dbsearch.serialize(function() {
                        dbsearch.run("begin transaction");
                        setIn.run(source);
                        dbsearch.run("commit");
                        return
                    });

                } else {
                    var rrows = [];
                    if( Object.prototype.toString.call( ordata ) === '[object Array]' ) {
                        rrows = ordata;
                    } else {
                        rrows = ordata.values;
                    }
                    callback.call(this,ordata);
                    //console.log( "   ordata: " + JSON.stringify(ordata));
                    var findHashSql = "select  hash from queries where id = '" + source + "'";
                    console.log("FindHashSql : " + findHashSql );
                    var stmt4 = dbsearch.all(findHashSql,
                        function(err, results2) {
                            if( err) {
                                console.log("Error: " + JSON.stringify(error) + "'");
                            }
                            if( results2.length == 0) {
                                console.log("No sresults for hash" + source + "'");
                            }
                            var binHash = results2[0].hash;
                            var stmt = dbsearch.all("select  " + 
                                                "    document_binary_hash  "  + 
                                                "from  " + 
                                                "    search_rows_hierarchy  " +
                                                "where  " +
                                                "    document_binary_hash = '" + binHash + "'",
                            function(err, results) {
                                if (!err) {
                                    if( results.length == 0) {
                                        dbsearch.serialize(function() {
                                            console.log("Inserting rows");
                                            
                                            if (rrows && rrows.length) {
                                                dbsearch.run("begin transaction");
                                                for (var i =0 ; i < rrows.length; i++) {
                                                    var rowhash = crypto.createHash('sha1');
                                                    var row = JSON.stringify(rrows[i]);
                                                    rowhash.setEncoding('hex');
                                                    rowhash.write(row);
                                                    rowhash.end();
                                                    var sha1sum = rowhash.read();
                                                    ////console.log('                 : ' + JSON.stringify(rrows[i]));
                                                    stmt2.run(sha1sum, row);
                                                    stmt3.run(binHash, null, sha1sum);
                                                }
                                                console.log("Committed: " + rrows.length)
                                                //stmt2.finalize();
                                                //stmt3.finalize();
                                                console.log('                 : ' + JSON.stringify(rrows.length));
                                                
                                                console.log('                 source: ' + JSON.stringify(source));
                                                var setIn =  dbsearch.prepare("UPDATE queries set index_status = 'INDEXED' where id = ?");
                                                setIn.run(source);
                                                dbsearch.run("commit");
                                                
                                            } else {
                                                console.log("****************** err 2");
                                                
                                            }
                                        });
                                    } else {
                                        console.log("****************** err 5: no rows");
                                        dbsearch.run("begin transaction");
                                        setIn.run(source);
                                        dbsearch.run("commit");
                                        return
                                    }
                                } else {
                                    console.log("****************** err 3" + err);
                                }
                            });
                    })

            }})
        
        }
        catch(err){
            console.log("****************** err 1" + err);
        }
    }
    }
    
    
    
function sendOverWebSockets(data) {
    var ll = serverwebsockets.length;
    //console.log('send to sockets Count: ' + JSON.stringify(serverwebsockets.length));
    for (var i =0 ; i < ll; i++ ) {
        var sock = serverwebsockets[i];
        if (sock.readyState == 1) {
            sock.send(JSON.stringify(data));
        }
        //console.log('                    sock ' + i + ': ' + JSON.stringify(sock.readyState)); 
    }
}
    
function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}



program
  .version('0.0.1')
  .option('-t, --type [type]', 'Add the specified type of app (client/server) [type]', 'client')
  .option('-p, --port [port]', 'Which port should I listen on? (default 80) [port]', parseInt)
  .option('-h, --host [host]', 'Server address of the central host (default gosharedata.com) [host]', 'gosharedata.com')
  .option('-l, --locked [locked]', 'Allow server to be locked/unlocked on start up (default true) [locked]', 'true')
  .option('-s, --hostport [hostport]', 'Server port of the central host (default 80) [hostport]', parseInt)
  .parse(process.argv);


  port = program.port;
  if (!isNumber(port)) {port = 80;};

  var portrange = 3000
  //console.log('Local hostname: ' + ip.address() + ' ')
  getPort(mainProgram);

	function getPort (cb) {

		var server = net.createServer()
		
		server.listen(port, ip.address(), function (err) {
			//console.log('trying port: ' + port + ' ')
			server.once('close', function () {
			})
			server.close()
		})
		server.on('error', function (err) {
			//console.log('Couldnt connect on port ' + port + '...')
			if (port < portrange) {
				port = portrange
				};
			//console.log('... trying port ' + port)
			portrange += 1
			getPort(cb)
		})
		server.on('listening', function (err) {
				//console.log('Can connect on port ' + port + ' :) ')
				cb()
		})
	}
  
  
  
  function mainProgram() {
	typeOfSystem = program.type;
	centralHostAddress = program.host;
	centralHostPort = program.hostport;
	if (!isNumber(centralHostPort)) {centralHostPort = 80;};


	if (!(typeOfSystem == 'client' || typeOfSystem == 'server')) {
		//console.log('-------* Invalid system type: ' + typeOfSystem);
		process.exit();
	};
	//console.log('-------* System type: ' + typeOfSystem);
	//console.log('-------* Port: ' + port);
	//console.log('-------* Central host: ' + centralHostAddress);
	//console.log('-------* Central host port: ' + centralHostPort);


	var storageFileName = 'data.json';
		if (typeOfSystem == 'client') {
			storageFileName = 'data.json';
		} else if (typeOfSystem == 'server') {
			storageFileName = 'server.json';
		}
		console.dir ( ip.address() );

		//console.log('addr: '+ ip.address());
		hostaddress = ip.address();








	//------------------------------------------------------------
	// wait three seconds for stuff to initialize
	//------------------------------------------------------------
	setTimeout(startServices, timeout);
	//console.log('Creating timeout: ' + timeout);


	//------------------------------------------------------------
	// wait three seconds for stuff to initialize
	//------------------------------------------------------------
	function startServices() {

	var hostcount = 0;
	  //------------------------------------------------------------------------------
	  // Show the default page
	  //------------------------------------------------------------------------------
		app.get('/', function (req, res) {
			hostcount++;
		  //console.log("Host: " + req.headers.host + ", " + hostcount);
		  //console.log("URL: " + req.originalUrl);
		  if (req.headers.host) {
			  if (req.headers.host.toLowerCase() == 'canlabs.com') {
				res.writeHead(301,
					{Location: 'http://canlabs.com/canlabs'}
				  );
				  res.end();
				  return;
			  };
			  if (req.headers.host.toLowerCase() == 'gosharedata.com') {
				res.writeHead(301,
					{Location: 'http://gosharedata.com/gosharedata/index.html?time=' + new Date().getTime()}
				  );
				  res.end();
				  return;
			  };
		  };

		  if (!init_drivers) {
			init_drivers = true;
			eval(toeval);
			if (drivers['oracle']['loadOnCondition']()) {
				drivers['oracle']['loadDriver']();
			};
			eval(pgeval);

		  };

		  if (typeOfSystem == 'client') {
              if (!canAccess(req,res)) {return;}
			  res.end(fs.readFileSync(path.join(__dirname, '../public/index.html')));
		  }
		  if (typeOfSystem == 'server') {
			  res.end(fs.readFileSync(path.join(__dirname, '../public/index_server.html')));
		  }
	  })

      
var cors = require('cors')

app.use(cors())
            
    
    //console.log('::::::::::: ' +process.cwd() + '/docs')
    app.use("/docs", express.static('public/docs'));
    app.use("/public/aframe_fonts", express.static(path.join(__dirname, '../public/aframe_fonts')));
	app.use(express.static(path.join(__dirname, '../public/')))
	var bodyParser = require('body-parser');
	app.use(bodyParser.json()); // support json encoded bodies
	app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

    
    function isLocalMachine(req) {
        if ((req.ip == '127.0.0.1') || (hostaddress == req.ip)) {  // this is the correct line to use
        //if (req.ip == '127.0.0.1')  {      // this is used for debugging only so that we can deny access from the local machine
            return true;
        };
        return false;
    }
	//------------------------------------------------------------------------------
	// test if allowed
	//------------------------------------------------------------------------------
	function canAccess(req,res) {
        if (!locked) {
            return true;
        };
        if (isLocalMachine(req) ) {      
            return true;
        };
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end("Sorry but access to " + username + "'s data is not allowed. Please ask " + username + " to unlocked their GoShareData account");
        return false;
	};
        

	//------------------------------------------------------------------------------
	// test_firewall
	//------------------------------------------------------------------------------
	app.get('/test_firewall', function (req, res) {
        var tracking_id =    url.parse(req.url, true).query.tracking_id;
        var server      =    url.parse(req.url, true).query.server;
        
        //console.log(JSON.stringify(tracking_id,null,2));
        
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(JSON.stringify({    got_through_firewall:   tracking_id  ,  
                                    server:                 server,
                                    username:               username,
                                    locked:                 locked
                                    }));
	});

    
	//------------------------------------------------------------------------------
	// get_intranet_servers
	//------------------------------------------------------------------------------
    var requestClientPublicIp;
	app.get('/get_intranet_servers', function (req, res) {
        requestClientPublicIp = req.ip;
        var requestVia                       = findViafromString(req.headers.via);
        
		res.writeHead(200, {'Content-Type': 'text/plain'});
        
        var mysql = "select *  from  intranet_client_connects  where " +
                    "    (when_connected > " + ( new Date().getTime() - (numberOfSecondsAliveCheck * 1000)) + ") " +
                    " and " + 
                    "    (( public_ip = '" + requestClientPublicIp + "') or " +
                              "((via = '" + requestVia + "') and (length(via) > 0)))";
        //console.log("check IP: " + mysql);
        var stmt = dbsearch.all(mysql, function(err, rows) {
            if (!err) {
                //console.log( "           " + JSON.stringify(rows));
                res.end(JSON.stringify({  allServers:       rows,
                                          intranetPublicIp: requestClientPublicIp}));
        }});
	});

app.ws('/websocket', function(ws, req) {
    serverwebsockets.push(ws);
    //console.log('Socket connected : ' + serverwebsockets.length);
    ws.on('message', function(msg) {
        ws.send(msg);
    });
});


	//------------------------------------------------------------------------------
	// Get the result of a SQL query
	//------------------------------------------------------------------------------
	app.get('/scanharddisk', function (req, res) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end(JSON.stringify([]));
		stopScan = false;
        inScan = true;
		scanHardDisk();
        sendOverWebSockets({
                                type:   "server_scan_status",  
                                value:  "Hard disk scan in progress",
                                });
	});

	app.get('/stopscanharddisk', function (req, res) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end(JSON.stringify([]));
		stopScan = true;
        sendOverWebSockets({
                                type:   "server_scan_status",  
                                value:  "Hard disk scan stopped",
                                });
	});


    
    
    
    
    
    
    
    
var multer = require('multer');
var upload = multer( { dest: 'uploads/' } );


    app.post('/file_upload', upload.array( 'file' ), function (req, res, next) {
        //console.log('-------------------------------------------------------------------------------------');
        //console.log('-------------------------------------------------------------------------------------');
        //console.log('-------------------------------------------------------------------------------------');
        //console.log('-------------------------------------------------------------------------------------');
        //console.log('-------------------------------------------------------------------------------------');

        //console.log(JSON.stringify(req.files.length));
        //console.log("**FILES** " + JSON.stringify(req.files));
        //console.log(    "    next: " + JSON.stringify(next));
 

        //console.log('......................................................................................');
        //console.log('......................................................................................');
        //console.log('......................................................................................');
        //console.log('......................................................................................');
        //console.log('......................................................................................');
        res.status( 200 ).send( req.files );

        
        var ll = req.files.length;
        for (var i = 0; i < ll ; i ++) {
            var ifile = req.files[i];
            console.log("        " + JSON.stringify(ifile));
            var ext = ifile.originalname.split('.').pop();
            ext = ext.toLowerCase();
            //console.log('Ext: ' + ext);

            var localp2;
            if (isWin) {
            localp2 = process.cwd() + '\\uploads\\' + ifile.filename;
        } else{
            localp2 = process.cwd() + '/uploads/' + ifile.filename;
        };
            var localp = localp2 + '.' + ext;
            fs.renameSync(localp2, localp);
            //console.log('Local saved path: ' + localp);
            
            fs.stat(localp, function(err, stat) {
              if (isExcelFile(ifile.originalname)) {
                    //console.log('ifile: ' + ifile.originalname);
                    var excelFile = localp;
                        if (typeof excelFile !== "undefined") {
                            var fileId = excelFile.replace(/[^\w\s]/gi,'');
                            console.log('Saving from upload   *file id: ' + ifile.originalname);
                            console.log('   *size: ' + stat.size);

                            saveConnectionAndQueryForFile(ifile.originalname, 'excel', stat.size, excelFile, '|SPREADSHEET|');                                
                }
            } else if (isCsvFile(ifile.originalname)) {
                    //console.log('ifile: ' + ifile.originalname);
                        var excelFile = localp;
                        if (typeof excelFile !== "undefined") {
                            var fileId = excelFile.replace(/[^\w\s]/gi,'');
                            console.log('Saving from upload   *file id: ' + ifile.originalname);
                            console.log('   *size: ' + stat.size);

                            saveConnectionAndQueryForFile(ifile.originalname, 'csv', stat.size, excelFile, '|CSV|');
                };
            } else if (isWordFile(ifile.originalname)) {
                    //console.log('ifile: ' + ifile.originalname);
                        var wordFile = localp;
                        if (typeof wordFile !== "undefined") {
                            var fileId = wordFile.replace(/[^\w\s]/gi,'');
                            console.log('Saving from upload   *file id: ' + ifile.originalname);
                            console.log('   *size: ' + stat.size);

                            saveConnectionAndQueryForFile(ifile.originalname, 'word', stat.size, wordFile, '|DOCUMENT|');
                }
            } else if (isPdfFile(ifile.originalname)) {
                    //console.log('ifile: ' + ifile.originalname);
                        var pdfFile = localp;
                        if (typeof pdfFile !== "undefined") {
                            var fileId = pdfFile.replace(/[^\w\s]/gi,'');
                            console.log('Saving from upload   *file id: ' + ifile.originalname);
                            console.log('   *size: ' + stat.size);

                            saveConnectionAndQueryForFile(ifile.originalname, 'pdf', stat.size, pdfFile, '|DOCUMENT|');
                }};
            });
        }

    });
    
    
    
    
	app.post('/open_query_in_native_app', function (req, res) {

		//console.log('in open_query_in_native_app');
		var queryData = req.body;
		//console.log('queryData.source: ' + queryData.source);
		//console.log('queries[queryData.source]: ' + queries[queryData.source]);
		//console.log('connections[queries[queryData.source].connection]: ' + connections[queries[queryData.source].connection]);
		//console.log('connections[queries[queryData.source].connection].fileName: ' + connections[queries[queryData.source].connection].fileName);
		var error = new Object();
		////console.log('query driver: ' + connections[queryData.source].driver);
		try {
			//drivers[connections[queryData.source].driver]['get_v2'](connections[queryData.source],{sql: queryData.sql},function(ordata) {
			   open(connections[queries[queryData.source].connection].fileName);

			   res.writeHead(200, {'Content-Type': 'text/plain'});
				res.end(JSON.stringify(ordata));
		}

		catch(err) {
			res.writeHead(200, {'Content-Type': 'text/plain'});

			res.end(JSON.stringify({error: 'Error: ' + JSON.stringify(err)}));
		};
	})


	//------------------------------------------------------------------------------
	// Get the result of a SQL query
	//------------------------------------------------------------------------------
	app.post('/getresult', function (req, res) {
		//console.log('in getresult');
		var queryData = req.body;
		//console.log('queryData.source: ' + queryData.source);
        
		////console.log('request received source: ' + Object.keys(req));
		var error = new Object();
		if (queryData) {
			if (connections[queryData.source]) {
				if (queryData.source) {
					if (connections[queryData.source].driver) {
						//console.log('query driver: ' + connections[queryData.source].driver);
						try {
							drivers[connections[queryData.source].driver]['get_v2'](connections[queryData.source],{sql: queryData.sql},function(ordata) {
								res.writeHead(200, {'Content-Type': 'text/plain'});
                                
                                res.end(JSON.stringify(ordata));
							});
						}
						catch(err) {
							res.writeHead(200, {'Content-Type': 'text/plain'});

							res.end(JSON.stringify({error: 'Error: ' + JSON.stringify(err)}));
						};
					} else {
						//console.log('query driver not found: ' + connections[queryData.source]);
							res.writeHead(200, {'Content-Type': 'text/plain'});
							res.end(JSON.stringify({message: 'query driver not found'}));
					};
				};
			};
		};
	})

    
    
    //------------------------------------------------------------------------------
	// Get the result of a search
	//------------------------------------------------------------------------------
	app.get('/get_search_results', function (req, res) {
        console.log("called get_search_results: " )
        var searchTerm = req.query.search_text;
        var timeStart = new Date().getTime();
        
        console.log("searchTerm.length: " + searchTerm.length)
        console.log("searchTerm: " + searchTerm)
        if (searchTerm.length < 1) {
            var timeEnd = new Date().getTime();
            var timing = timeEnd - timeStart;
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end( JSON.stringify({search:      searchTerm, 
                                     queries:    [], 
                                     message:    "Search text must be at least 1 characters: " + searchTerm,
                                     duration:    timing    }  ));
        } else if (2 == (1 + 1)){
        
		dbsearch.serialize(function() {
            var mysql = "  select distinct(queries.id), the1.document_binary_hash, the1.num_occ  , the1.child_hash , zfts_search_rows_hashed.data " +
                        " from (  select   " +
                       "  distinct(document_binary_hash), count(document_binary_hash)  as num_occ  , child_hash  " +
                     "    from    " +
                     "    search_rows_hierarchy   " +
                     "    where    " +
                     "    child_hash in (select     " +
                      " distinct(row_hash)    " +
                        "  from     " +
    "                          zfts_search_rows_hashed    " +
     "                    where    " +
      "                         zfts_search_rows_hashed match '"  + searchTerm + "*'  )   " +
       "                  group by   " +
        "                    document_binary_hash) as the1,   " +
         "                     queries  , " +
          "                    zfts_search_rows_hashed  " +
           "              where    " +
            "             queries.hash = the1.document_binary_hash   " +
" and " +
"zfts_search_rows_hashed.row_hash = the1.child_hash ";
                            
            var firstWord = searchTerm.split()[0];
            if (firstWord.length < 1) {
                firstWord = "";
            }
			var stmt = dbsearch.all(mysql, function(err, rows) {
                if (!err) {
                    //sqliteSync.connect('gosharedatasearch.sqlite3'); 
                    //console.log('rows: ' + JSON.stringify(rows.length));
                    var newres = [];
                    for  (var i=0; i < rows.length;i++) {
                        var rowId = rows[i]["id"];
                        var rowData =  rows[i]["data"];
                        if (rowData.length > 0) {
                            var rowDataToSend = ""
                            if (i < 5) {
                                var rowDataStartInit = rowData.toUpperCase().indexOf(firstWord.toUpperCase())
                                //console.log('rowDataStartInit: ' + rowDataStartInit );
                                
                                //console.log('for: ' + firstWord + " = " + JSON.stringify(rowData));

                                var rowDataStart = rowDataStartInit - 30;
                                if (rowDataStart < 0) {
                                    rowDataStart = 0
                                }
                                //console.log('rowDataEndInit: ' + rowDataEndInit );
                                var rowDataEnd = rowDataStartInit + firstWord.length + 30
                                
                                rowDataToSend = rowData.substring(rowDataStart, rowDataStartInit) + firstWord.toUpperCase() + 
                                    rowData.substring(rowDataStartInit + firstWord.length, rowDataEnd);
                            }
                            //console.log('rowDataToSend: ' + rowDataToSend );
                            newres.push({
                                                id:     rowId,
                                                data:   rowDataToSend
                                        });
                        }
                    }
                    //sqliteSync.close();
                    var timeEnd = new Date().getTime();
                    var timing = timeEnd - timeStart;
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end( JSON.stringify({   search:  searchTerm, 
                                                queries: newres, 
                                                duration: timing}));
                } else {
                    var timeEnd = new Date().getTime();
                    var timing = timeEnd - timeStart;
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end( JSON.stringify({search:      searchTerm, 
                                             queries:    [], 
                                             duration:    timing,
                                             error: "Error searching for: " + searchTerm }  ));
                }
            });
        
        })
        } else {//this is the old way of searching but was too slow
        
		dbsearch.serialize(function() {
            var mysql = " select  " + 
                        "      distinct(row_hash)  " + 
                        " from  " + 
                        "      zfts_search_rows_hashed  " + 
                        " where  " + 
                        "      zfts_search_rows_hashed match '"  + searchTerm + "*'  "; 
            
			var stmt = dbsearch.all(mysql, function(err, rows) {
                if (!err) {
                    //sqliteSync.connect('gosharedatasearch.sqlite3'); 
                    console.log('rows: ' + JSON.stringify(rows.length));
                    var newres = [];
                    for  (var i=0; i < rows.length;i++) {
                        var rowHash = rows[i]["row_hash"];
                        //console.log('rowHash: ' + JSON.stringify(rowHash));
                        if (rowHash) {
                            var getQueryIdsSql =     " select " + 
                                                        "     id  " + 
                                                        " from  " + 
                                                        "     queries " + 
                                                        " where  " + 
                                                        "     hash in  " + 
                                                        "         (select  " + 
                                                        "              distinct(document_binary_hash)  " + 
                                                        "          from  " + 
                                                        "              search_rows_hierarchy " + 
                                                        "          where  " + 
                                                        "              child_hash = '" + rowHash + "' " + 
                                                        "                  )" + 
                                                        " GROUP BY id";
                                                    
                            //console.log('getQueryIdsSql: ' + JSON.stringify(getQueryIdsSql));
                            var resultSet = sqliteSync.run(getQueryIdsSql);
                            //console.log('               : ' + JSON.stringify(resultSet,null,2));
                                    
                            if (resultSet && (resultSet.length > 0)) {
                                if (resultSet[0].values) {
                                    var queryIds = resultSet[0].values;

                                    for (var x = 0; x < queryIds.length; x++) {
                                        newres.push({
                                                            id:     queryIds[x][0]
                                                    });
                                    }
                                }
                            }

                            
                        }
                    }
                    //sqliteSync.close();
                    var timeEnd = new Date().getTime();
                    var timing = timeEnd - timeStart;
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end( JSON.stringify({   search:  searchTerm, 
                                                queries: newres, 
                                                duration: timing}));
                } else {
                    var timeEnd = new Date().getTime();
                    var timing = timeEnd - timeStart;
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end( JSON.stringify({search:      searchTerm, 
                                             queries:    [], 
                                             duration:    timing,
                                             error: "Error searching for: " + searchTerm   }  ));
                }
            });
        
        })
        };
    });

    
    
    
        
    
	app.post('/getqueryresult', function (req, res) {
		var queryData2 = req.body;
		//console.log('in getqueryresult: ' + JSON.stringify(queryData2));
		//console.log('           source: ' + JSON.stringify(queryData2.source));
		////console.log('request received source: ' + Object.keys(req));
		////console.log('request received SQL: ' + queryData.sql);
		var query = queries[queryData2.source];

		//console.log('           query: ' + JSON.stringify(query));
		if (query) {
			var queryData 			= new Object();
			queryData.source 		= query.connection;
			queryData.definition 	= eval('(' + query.definition + ')' );

			//console.log('   query.definition.sql: ' + JSON.stringify(query.definition.sql));
			//console.log('           ***queryData: ' + JSON.stringify(queryData));


			var error = new Object();
			if (queryData) {
				if (connections[queryData.source]) {
					if (queryData.source) {
						if (connections[queryData.source].driver) {
							////console.log('query driver: ' + connections[queryData.source].driver);
                            var newres = res;
                            getResult(  queryData2.source, 
                                        queryData.source, 
                                        connections[queryData.source].driver, 
                                        queryData.definition, 
                                        function(result){
                                            //console.log("     In getresult callback:")
                                            //console.log("                          :" + JSON.stringify(result))
                                            newres.writeHead(200, {'Content-Type': 'text/plain'});
                                            newres.end(JSON.stringify(result));
                                        }
                                     );
						} else {
							console.log('query driver not found: ' + connections[queryData.source]);
								res.writeHead(200, {'Content-Type': 'text/plain'});
								res.end(JSON.stringify({error: 'query driver not found'}));
						};
					};
				};
			};
		} else {
			console.log('query not found: ' + queryData2.source);
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end(JSON.stringify({error: 'query ' + queryData2.source + ' not found'}));

		};
	})

    var locked = (program.locked == 'true');

	app.get('/send_client_details', function (req, res) {
		////console.log('in send_client_details: ' + JSON.stringify(req,null,2));
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(JSON.stringify({
                returned:           'some data ', 
                server:             hostaddress,
                port:               port,
                username:           username, 
                locked:             locked,
                localIp:            req.ip,
                isLocalMachine:     isLocalMachine(req) }));
	})


	app.get('/lock', function (req, res) {
        if ((req.query.locked == "TRUE") || (req.query.locked == "true")) {
            locked = true;
        } else {
            locked = false;
        }

            ////console.log('in lock: ' + JSON.stringify(req,null,2));
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.end(JSON.stringify({locked: locked}));
	})


	process.on('uncaughtException', function (err) {
	  console.log(err);
	})








	var requestClientInternalHostAddress = '';
	var requestClientInternalPort        = -1;
	var requestClientPublicIp            = '';
	var requestClientPublicHostName      = '';


	//------------------------------------------------------------------------------
	// This is called by the central server to get the details of the last
	// client that connected tp the central server
	//------------------------------------------------------------------------------
	app.get('/get_connect', function (req, res) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end(
				JSON.stringify(
					{
						requestClientInternalHostAddress: requestClientInternalHostAddress
						,
						requestClientInternalPort:        requestClientInternalPort
						,
						requestClientPublicIp:            requestClientPublicIp
						,
						requestClientPublicHostName:      requestClientPublicHostName
						,
						version:      31
					}
			  ));
	})

	//app.enable('trust proxy')

    var extractHostname = function (url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname

    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];

    return hostname;
}

    var extractRootDomain = function(url) {
    var domain = extractHostname(url),
        splitArr = domain.split('.'),
        arrLen = splitArr.length;

    //extracting the root domain here
    if (arrLen > 2) {
        domain = splitArr[arrLen - 2] + '.' + splitArr[arrLen - 1];
    }
    return domain;
}

    var findViafromString = function(inp) {
        if (inp == null) {
            return "";
        }
        
        var ll = inp.split(' ');
        for (var i=0; i< ll.length ; i++){
            if (ll[i] != null) {
                if (ll[i].indexOf(":") != -1) {
                    return extractRootDomain(ll[i]);
                }
            }
        }
        return "";
    }
    
	app.get('/get_all_table', 
        function (req, res) {
			var tableName = url.parse(req.url, true).query.tableName;
			var fields = url.parse(req.url, true).query.fields;
            var stmt = dbsearch.all("select " + fields + " from " + tableName,
                function(err, rows) {
                    if (!err) {
                        res.writeHead(200, {'Content-Type': 'text/plain'});
                        res.end(JSON.stringify(
                            rows));
                        //console.log("Sent: " + JSON.stringify(rows.length));
                    };
                })
    });
    
	app.post('/add_new_connection', 
        function (req, res) {
			var params = req.body;
            addNewConnection( params );
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(JSON.stringify({done: "ok"}))});
    


	app.post('/add_new_query', 
        function (req, res) {
			var params = req.body;
            addNewQuery( params );
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(JSON.stringify({done: "ok"}))});


    
    
	//------------------------------------------------------------------------------
	// run on the central server only
	//
	// This is where the client sends its details to the central server
	//------------------------------------------------------------------------------
	app.get('/client_connect', function (req, res) {
		try
		{
			var queryData = url.parse(req.url, true).query;

			var requestClientInternalHostAddress = req.query.requestClientInternalHostAddress;
			var requestClientInternalPort        = req.query.requestClientInternalPort;
			var requestVia                       = findViafromString(req.headers.via);
			var requestClientPublicIp            = req.ip;
            var clientUsername                   = req.query.clientUsername;
			//requestClientPublicHostName      = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
			var requestClientPublicHostName      = "req keys::" + Object.keys(req) + ", VIA::" + req.headers.via + ", raw::" + JSON.stringify(req.rawHeaders);

			//console.log('Client attempting to connect from:');
			//console.log('client internal host address:    ' + requestClientInternalHostAddress)
			//console.log('client internal port:            ' + requestClientInternalPort)
			//console.log('client public IP address:        ' + requestClientPublicIp)
			//console.log('client public IP host name:      ' + requestClientPublicHostName)
			//console.log('client VIA:                      ' + requestVia)
 
            dbsearch.serialize(function() {
                var stmt = dbsearch.prepare(" insert  into  intranet_client_connects " + 
                                        "    ( id, internal_host, internal_port, public_ip, via, public_host, user_name, client_user_name, when_connected) " +
                                        " values " + 
                                        "    (?,   ?,?,?,?,  ?,?,?,?);");
                                        
                var newid = uuidv1();
                stmt.run(   newid,
                            requestClientInternalHostAddress,  
                            requestClientInternalPort, 
                            requestClientPublicIp, 
                            requestVia,
                            requestClientPublicHostName,
                            username,
                            clientUsername,
                            new Date().getTime()
                    );
            });
            //console.log('***SAVED***');
			
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end(JSON.stringify(
                {
                    connected: true, 
                }));
		}
		catch (err) {
			//console.log('Warning: Central server not available:');
		}

	})







	//------------------------------------------------------------------------------
	// start the web server
	//------------------------------------------------------------------------------
	app.listen(port, hostaddress, function () {
		//console.log(typeOfSystem + ' started on port ' + port );
	})








	  //console.log('addr: '+ hostaddress + ":" + port);





    var aliveCheckFn =                 function() {
                    var urlToConnectTo = "http://" + centralHostAddress + ":" + centralHostPort + '/client_connect';
                    //console.log('-------* urlToConnectTo: ' + urlToConnectTo);
                    //console.log('trying to connect to central server...');
                    request({
                          uri: urlToConnectTo,
                          method: "GET",
                          timeout: 10000,
                          agent: false,
                          followRedirect: true,
                          maxRedirects: 10,
                          qs: {
                              requestClientInternalHostAddress: hostaddress
                              ,
                              requestClientInternalPort:        port
                              ,
                              clientUsername:        username
                          }
                        },
                        function(error, response, body) {
                          //console.log('Error: ' + error);
                          if (response) {
                              if (response.statusCode == '403') {
                                    //console.log('403 received, not allowed through firewall for ' + urlToConnectTo);
                                    //open("http://" + centralHostAddress + ":" + centralHostPort);
                              } else {
                                    ////console.log('response: ' + JSON.stringify(response));
                                    ////console.log(body);
                              }
                          }
                        });
                };
        aliveCheckFn();
        
        
        
        var indexFilesFn = function() {
           if (inScan) {
             return;
           };
            console.log("Index files");
            var stmt = dbsearch.all(
                "SELECT * FROM queries WHERE index_status IS NULL LIMIT 1 " ,
                function(err, results) 
                {
                    if (!err) 
                    {
                        if( results.length != 0) 
                        {//zzz
                            console.log("          : " + JSON.stringify(results[0],null,2));
                            getResult(  results[0].id, 
                                        results[0].connection, 
                                        results[0].driver, 
                                        {}, 
                                        function(result)
                                        {
                                            console.log("File added v2: " + JSON.stringify(result.error,null,2));
                                        });
                        
                        }                    
                    } else {
                        console.log("          Error: " + JSON.stringify(err,null,2));
                   } 
                })

        }
        
		if (typeOfSystem == 'client') {
            setInterval(aliveCheckFn ,numberOfSecondsAliveCheck * 1000);
            
            console.log("Set Index files timer");
            setInterval(indexFilesFn ,numberOfSecondsIndexFilesInterval * 1000);



				
				
				
				

		}



                  
                  




when_connections_changes();
when_queries_changes(null);
				




		//console.log("******************************ADDING DRIVERS*********************************")
		//console.log("******************************ADDING DRIVERS*********************************")



		var pgeval = '(' + fs.readFileSync(path.join(__dirname, './csv.js')).toString() + ')';
		drivers['csv'] = eval( pgeval )
		addOrUpdateDriver('csv', pgeval, drivers['csv'])


		var pgeval = '(' + fs.readFileSync(path.join(__dirname, './excel.js')).toString() + ')';
		drivers['excel'] = eval( pgeval )
		addOrUpdateDriver('excel', pgeval, drivers['excel'])

		var pgeval = '(' + fs.readFileSync(path.join(__dirname, './word.js')).toString() + ')';
		drivers['word'] = eval( pgeval )
		addOrUpdateDriver('word', pgeval, drivers['word'])

		var pgeval = '(' + fs.readFileSync(path.join(__dirname, './pdf.js')).toString() + ')';
		drivers['pdf'] = eval( pgeval )
		addOrUpdateDriver('pdf', pgeval, drivers['pdf'])


		var pgeval = '(' + fs.readFileSync(path.join(__dirname, './postgres.js')).toString() + ')';
		drivers['postgres'] = eval( pgeval )
		addOrUpdateDriver('postgres', pgeval, drivers['postgres'])

        
        
		var sqliteeval = '(' + fs.readFileSync(path.join(__dirname, './sqlite.js')).toString() + ')';
		drivers['sqlite'] = eval( sqliteeval )
		addOrUpdateDriver('sqlite', sqliteeval, drivers['sqlite'])



		var pgeval = '(' + fs.readFileSync(path.join(__dirname, './mysql.js')).toString() + ')';
		drivers['mysql'] = eval( pgeval )
		addOrUpdateDriver('mysql', pgeval, drivers['mysql'])



		toeval =  '(' + fs.readFileSync(path.join(__dirname, './oracle.js')).toString() + ')';
		drivers['oracle']   = eval( toeval )
		addOrUpdateDriver('oracle',   toeval, drivers['oracle'])
		process.env['PATH'] = process.cwd() + '\\oracle_driver\\instantclient32' + ';' + process.env['PATH'];
		if (drivers['oracle'].loadOnCondition()) {
			drivers['oracle'].loadDriver()
		}



		var tdeval = '(' + fs.readFileSync(path.join(__dirname, './testdriver.js')).toString() + ')';
		drivers['testdriver'] = eval(tdeval)
		addOrUpdateDriver('testdriver', tdeval, drivers['testdriver'])






    






		
		

	function addOrUpdateDriver(name, code, theObject) {
		var driverType = theObject.type;
		console.log('addOrUpdateDriver: ' + name);
        
        var stmt = dbsearch.all("select name from drivers where name = '" + name + "';", 
            function(err, rows) {
                if (!err) {
                    //console.log('             : ' + rows.length);
                    if (rows.length == 0) {
                        try 
                        {
                            dbsearch.serialize(function() {
                                var stmt = dbsearch.prepare(" insert or replace into drivers " + 
                                                            "    (id,  name, type, code ) " +
                                                            " values " + 
                                                            "    (?, ?,?,?);");
                            stmt.run(uuidv1(),  name,  driverType,  code);
                            stmt.finalize();
                            });
                        } catch(err) {
                            console.log('err             : ' + err);
                        } finally {
                            
                        }
                    
                    } else {
                        //console.log('   *** Checking DRIVER ' + name);
                        var existingDriver = rows[0];
                        if (!(code == existingDriver.code)) {
                            try 
                            {
                                dbsearch.serialize(function() {
                                    var stmt = dbsearch.prepare(" update   drivers   set code = ? where id = ?");
                                    stmt.run( code , rows[0].id );
                                    stmt.finalize();
                                });
                            } catch(err) {
                                console.log('err             : ' + err);
                            } finally {
                                
                            }
                        }
                    }
                }
            }
        );
    }
    



	////console.log("postgres.get = " + JSON.stringify(eval(pgeval) , null, 2))
	////console.log("postgres.get = " + eval(pgeval).get)
	//--------------------------------------------------------
	// open the app in a web browser
	//--------------------------------------------------------


	if (typeOfSystem == 'client') {
        var localClientUrl = 'http://' + hostaddress  + ":" + port;
        var remoteServerUrl = 'http://' + centralHostAddress  + ":" + centralHostPort + "/gosharedata/list_intranet_servers.html?time=" + new Date().getTime();
        
        
        request({
                  uri: remoteServerUrl,
                  method: "GET",
                  timeout: 10000,
                  agent: false,
                  followRedirect: true,
                  maxRedirects: 10
            },
            function(error, response, body) {
              if (error) {
                  console.log("Error opening central server: " + error);
                  open(localClientUrl);
              } else {
                open(remoteServerUrl);
              }
            });
	} else if (typeOfSystem == 'server') {
	  open('http://' + hostaddress  + ":" + port + "/gosharedata/list_intranet_servers.html?time=" +  + new Date().getTime());
	}

	}
	}














function scanHardDisk() {
    inScan = true;
	var useDrive = "C:\\";
    if (!isWin) {
        useDrive = '/';
    }

    if (!stopScan) {
        walk(useDrive, function(error){
            //console.log('*Error: ' + error);
        });
        inScan = false;
	  };
};

	  
	  
function copyFileSync( source, target ) {

    var targetFile = target;

    //if target is a directory a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source, target ) {
    //console.log('çopy from: '+ source + ' to ' + target);
    var files = [];

    //check if folder needs to be created or integrated
    var targetFolder = path.join( target, path.basename( source ) );
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    //copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
				//console.log('copying:  ' + targetFolder);
            }
        } );
    }
}


var in_when_connections_changes=false;
function when_connections_changes() {
    if (!in_when_connections_changes) {
        in_when_connections_changes=true;
        //console.log('------------------------------------');
        //console.log('Called when_ CONNS _changes ');
        //console.log('------------------------------------');
        //console.log('------------------------------------');
        
        var stmt = dbsearch.all("select * from connections",
            function(err, results) {
                if (!err) {
                    for (var i = 0 ; i < results.length ; i ++) {
                        var conn = results[i]
                        ////console.log('    --------Found conn:  ' + conn._id);
                        ////console.log('                      :  ' + conn.name);
                        if (!connections[conn.id]) {
                          ////console.log(a);
                          connections[conn.id] = conn;
                        }
                    }
                }
            in_when_connections_changes=false;
            }
        );
    };
}


function addNewConnection( params ) { 
    try 
    {
        //console.log("------------------function addNewConnection( params ) { -------------------");
        dbsearch.serialize(function() {
            var stmt = dbsearch.prepare(" insert into connections " + 
                                        "    ( id, name, driver, database, host, port, connectString, user, password, fileName, size, preview ) " +
                                        " values " + 
                                        "    (?,  ?,?,?,?,?,?,?,?,?,?,?);");
                                        
            stmt.run(uuidv1(),
                     params.name, 
                     params.driver, 
                     params.database, 
                     params.host, 
                     params.port, 
                     params.connectString, 
                     params.user, 
                     params.password, 
                     params.fileName, 
                     params.size, 
                     params.preview);
                     
            stmt.finalize();
            when_connections_changes();
        });
    } catch(err) {
        //console.log("                          err: " + err);
    } finally {
    }
}



function addNewQuery( params ) { 
    try 
    {
        //console.log("------------------function addNewQuery( params ) { -------------------");
        dbsearch.serialize(function() {
            var stmt = dbsearch.prepare(" insert into queries " + 
                                        "    ( id, name, connection, driver, definition, status ) " +
                                        " values " + 
                                        "    (?,    ?, ?, ?, ?, ?);");
                     
            var newQueryId = uuidv1();
            stmt.run(newQueryId,
                     params.name, 
                     params.connection, 
                     params.driver, 
                     params.definition,
                     params.status
                     );
                     
            stmt.finalize();
            when_queries_changes(null);
            getResult(newQueryId, params.connection, params.driver, eval("(" + params.definition + ")"), function(result){});
        });
    } catch(err) {
        console.log("                          err: " + err);
    } finally {
    }
}







var in_when_queries_changes = false;
function when_queries_changes(callback) {
    if (!in_when_queries_changes) {
        in_when_queries_changes = true;
        //console.log('Called when_queries_changes ');
        ////console.log('    connection keys:  ' + JSON.stringify(Object.keys(connections),null,2));
        var stmt = dbsearch.all("select * from queries",
            function(err, results) {
                if (!err) {
                //console.log('    --------Found:  ' + results.length);
                
                
                // find previews
                for (var i = 0 ; i < results.length ; i ++) {
                    var query = results[i];
                    if (!queries[query.id]) {
                        queries[query.id] = query;
                        var oout = [{a: 'no EXCEL'}];
                        try {
                            ////console.log('get preview for query id : ' + query._id);
                            ////console.log('          driver : ' + query.driver);
                            var restrictRows = JSON.parse(query.definition);
                            restrictRows.maxRows = 10;
                            /*drivers[query.driver]['get_v2'](connections[query.connection],restrictRows,
                                function(ordata) {
                                    ////console.log('getting preview for query : ' + query.name);
                                    query.preview = JSON.stringify(ordata, null, 2);
                                    queries.put(query);
                            });*/
                                callback.call(this);
                            if (callback) {
                            }
                        } catch (err) {};
                    }
                };
            }
            in_when_queries_changes = false;

            });
    }
};


 
//console.log("-------------------------------------------------------------------");
//console.log("-------------------------------------------------------------------");
//console.log("-------------------------------------------------------------------");
//console.log("-------------------------------------------------------------------");
//console.log("-------------------------------------------------------------------");

var os= require('os')
username = os.userInfo().username
//console.log(username);







