async function postgres_sql(args) {
/*
description("Postgres function")
base_component_id("postgres_server")
load_once_from_file(true)
only_run_on_server(true)
*/
    var config = {
      user:              args.user,
      database:          args.database,
      password:          args.password,
      host:              args.host,
      port:              args.port
    };

    console.log("postgres_server: " + JSON.stringify(args,null,2));

    var promise = new Promise(async function(returnFn) {

        var dbconnection = new postgresdb.Client(config);
        dbconnection.connect(function (err) {
          if (err) {
              console.log({error: '' + err});
              returnFn({failed: err})
          } else {
              var useSql = args.sql
              if (args.get_tables) {
                  useSql = "SELECT tablename as name FROM pg_catalog.pg_tables where schemaname = 'public';"
              } else if (args.get_columns) {
                  useSql = "select  column_name as name  FROM information_schema.columns WHERE table_name   = '" + args.table +"'"
              }
              dbconnection.query(useSql, [], function (err, result) {
                if (err) {
                    console.log({failed: '' + err});
                } else {
                    console.log("row count: " + result.rows.length); // outputs: { name: 'brianc' }
                    if (args.limit) {
                        result.rows = result.rows.slice(0, args.limit);
                    }
                    returnFn({value: result.rows})
                };
              })

          }
        });

    })
    var ret = await promise


    return ret
}
