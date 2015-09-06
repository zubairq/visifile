(ns webapp.framework.server.systemfns

  [:require [clojure.string :as string]]
  [:use [korma.db]]
  [:use [clojure.core.async :only [go <! >!]]]
  [:require [korma.core]]
  [:use [webapp-config.settings]]
  [:use [webapp.framework.server.encrypt]]
  (:require [clojure.edn :as edn])
  (:use [clojure.pprint])
  (:import [java.util.UUID])
  [:use [webapp.framework.server.db-helper]]
  [:use [webapp.framework.server.globals]]
  (use [overtone.at-at])
  )


(try
  (cond
    (= *database-type* "postgres" )
        (defdb db (postgres {:db *database-name*
                         :host *database-server*
                         :user *database-user*
                         :password *database-password*}))

    (= *database-type* "oracle" )
        (defdb db {:classname "oracle.jdbc.driver.OracleDriver"
               :subprotocol "oracle"
               :subname (str "thin:@"  *database-server*  ":1521:" *database-name*)
               :user *database-user*
               :password *database-password*
               :naming {:keys string/upper-case
                        :fields string/upper-case}})
    )






  (catch Exception e
    (str "Error connecting to database: " (.getMessage e))))







(defn !say-hello [params]
    {:text (str "System Hello " (:name params))})






(defn !sql [{coded-sql :sql params :params}]
  (do
    (let [sql             (decrypt coded-sql)
          lower           (.toLowerCase sql)
          ]
      ;(println "SQL from client: " coded-sql " -> " sql)
      (cond
       (.startsWith lower "select")  (do (comment println "SELECT") (korma.core/exec-raw [sql params] :results))
       :else                         (do (comment println "INSERT") (korma.core/exec-raw [sql params]) [])
    ))))





(defn !get-record-pointer-locally []
  {:value *record-pointer-locally*})





(defn !get-record-ui []
  {:value *record-ui*})




(defn !get-environment []
  {:value *environment*})





(defn !get-show-debug []
  {:value *show-code*})




;----------------------------------------------------------------
(defn !create-session
  [{:keys [init-state browser]}]
  ;----------------------------------------------------------------
  (let [
        session-id         (uuid-str)
        data-session-id    (uuid-str)
        ]

    {
     :value session-id
     :data-session-id    data-session-id
    }
    ))








(defn !make-sql
  [{:keys [
           fields
           db-table
           where
           ]}]

  (sql
   (str
    "select "
         fields " "
    "from "
         db-table " "
    (cond
      (= *database-type* "postgres" )
        (if where (str "where " where " "))

      (= *database-type* "oracle" )
        (if where (str "where " where " "))
    )
    ;questions_answered_count is not null
    ;order by
    ;questions_answered_count desc"
      (cond
        (= *database-type* "postgres" )
        "limit 100"

        (= *database-type* "oracle" )
        ""
          )
    ) {}))







(defn fields-to-str [fields]
  (apply str (interpose "," (map (-> name ) fields) )))











(defn create-query-key [& {:keys [
                                   db-table
                                   where
                                   start
                                   end
                                   params
                                   order
                                   ]}]
         {
          :db-table db-table
          :where where
          :start start
          :end end
          :params params
          :order order
         })




(defn get-count [db-table  where   params]
                                               (:cnt (sql-1 (str
                                                  "select count (id) as CNT from "
                                                  db-table " "
                                                  (if (-> where count pos?) (str "where " where " "))
                                                  )
                                                 params)))





(defn get-results [& {:keys [db-table where order start end params]}]
(sql
    (str
        "select id from "
        db-table " "
        (if (-> where count pos?) (str "where " where " "))
        (if (-> order count pos?) (str "order by " order " "))
        (cond
            (= *database-type* "postgres" )
            (str
                (if start (str " offset " (- start 1) " "))
                (if end (str " limit " (+ 1 (- end start)) " ") "limit 2")
                )

            (= *database-type* "oracle" )
            ""
            )

        ;questions_answered_count is not null
        ;order by
        ;questions_answered_count desc"
        ) params)
        )








(def coils-tables-trigger-version "1")



(defn create-realtime-trigger [& {:keys [:table-name]}]
(let [coils-trigger      (korma.core/exec-raw
                                   [" select * from coils_triggers where table_name = ?" [table-name]]
                                   :results)

        coils-trigger-exists   (pos? (count coils-trigger))

        sql-to-drop-trigger    (str "DROP TRIGGER IF EXISTS trigger_afterinsert ON " table-name ";")
      sql-to-insert-trigger-row "
INSERT INTO coils_triggers
(
  table_name,version
) values (?,?);
"

        sql-to-create-insert-trigger (str "CREATE TRIGGER trigger_afterInsert AFTER INSERT ON " table-name " FOR EACH ROW EXECUTE PROCEDURE trigger_function_afterInsert();")
        sql-to-create-update-trigger (str "CREATE TRIGGER trigger_afterUpdate AFTER UPDATE ON " table-name " FOR EACH ROW EXECUTE PROCEDURE trigger_function_afterUpdate();")
        sql-to-create-delete-trigger (str "CREATE TRIGGER trigger_afterDelete AFTER DELETE ON " table-name " FOR EACH ROW EXECUTE PROCEDURE trigger_function_afterDelete();")
        ]
        (println "Coils trigger table exists: " coils-trigger-exists)


        (if (not coils-trigger-exists )
        (do
            (korma.core/exec-raw   [sql-to-insert-trigger-row [table-name  coils-tables-trigger-version]]   [])
            (korma.core/exec-raw   [sql-to-drop-trigger []]   [])
            (korma.core/exec-raw   [sql-to-create-insert-trigger []]   [])
            (korma.core/exec-raw   [sql-to-create-update-trigger []]   [])
            (korma.core/exec-raw   [sql-to-create-delete-trigger []]   [])

                      )
                      nil

        )

          )
)


(defn make-admin-table []
  (let [coils-admin-tables      (korma.core/exec-raw
                                   [" select * from pg_tables where schemaname='public' and tablename='coils_triggers'" []]
                                   :results)

        coils-admin-table-exists   (pos? (count coils-admin-tables))

        sql-to-create-admin-table "
CREATE TABLE coils_triggers
(
  id serial NOT NULL,
  table_name character varying,
  version character varying
);
"
  ]

      (println "Coils admin table exists: " coils-admin-table-exists)
      (if (not coils-admin-table-exists )
                      (korma.core/exec-raw   [sql-to-create-admin-table []]   [])
                      nil
        )





  )
  )






(defn make-log-table []
  (let [coils-admin-tables      (korma.core/exec-raw
                                   [" select * from pg_tables where schemaname='public' and tablename='coils_realtime_log'" []]
                                   :results)

        coils-admin-table-exists   (pos? (count coils-admin-tables))

        sql-to-create-admin-table "
CREATE TABLE coils_realtime_log
(
  id                  serial NOT NULL,
  realtime_jvm_id     integer,
  record_timestamp    timestamp without time zone,
  record_table_name   character varying,
  record_id           character varying,
  record_operation    character varying,
  record_status       character varying
);
"
  ]

      (println "Coils admin table exists: " coils-admin-table-exists)
      (if (not coils-admin-table-exists )
                      (korma.core/exec-raw   [sql-to-create-admin-table []]   [])
                      nil
        )





  )
  )









(defn make-log-table-insert-trigger-function []
    (let [coils-trigger-fn-exists-result      (korma.core/exec-raw
                                                  ["select exists(select * from pg_proc where proname = 'trigger_function_afterinsert');" []]
                                                  :results)

          coils-trigger-fn-exists   (= "t"  coils-trigger-fn-exists-result)

          sql-to-create-trigger-fn "
CREATE OR REPLACE FUNCTION trigger_function_afterInsert()
      RETURNS trigger AS
$BODY$
      BEGIN
           INSERT INTO coils_realtime_log
                 (record_timestamp,  record_table_name,  record_id,  record_operation,  record_status)
           VALUES
                 ( now(),   TG_TABLE_NAME ,  NEW.id,  'INSERT',  'WAITING');
           RETURN NULL;
      END;
$BODY$
LANGUAGE plpgsql;
"
          ]

        (println "Coils trigger function exists: " coils-trigger-fn-exists)
        (if (not coils-trigger-fn-exists )
            (korma.core/exec-raw   [sql-to-create-trigger-fn []]   [])
            nil
            )
        )
    )




(defn make-log-table-update-trigger-function []
    (let [coils-trigger-fn-exists-result      (korma.core/exec-raw
                                                  ["select exists(select * from pg_proc where proname = 'trigger_function_afterUpdate');" []]
                                                  :results)

          coils-trigger-fn-exists   (= "t"  coils-trigger-fn-exists-result)

          sql-to-create-trigger-fn "
CREATE OR REPLACE FUNCTION trigger_function_afterUpdate()
      RETURNS trigger AS
$BODY$
      BEGIN
           INSERT INTO coils_realtime_log
                 (record_timestamp,  record_table_name,  record_id,  record_operation,  record_status)
           VALUES
                 ( now(),   TG_TABLE_NAME ,  NEW.id,  'UPDATE',  'WAITING');
           RETURN NULL;
      END;
$BODY$
LANGUAGE plpgsql;
"
          ]

        (println "Coils trigger function exists: " coils-trigger-fn-exists)
        (if (not coils-trigger-fn-exists )
            (korma.core/exec-raw   [sql-to-create-trigger-fn []]   [])
            nil
            )
        )
    )



(defn make-log-table-delete-trigger-function []
    (let [coils-trigger-fn-exists-result      (korma.core/exec-raw
                                                  ["select exists(select * from pg_proc where proname = 'trigger_function_afterDelete');" []]
                                                  :results)

          coils-trigger-fn-exists   (= "t"  coils-trigger-fn-exists-result)

          sql-to-create-trigger-fn "
CREATE OR REPLACE FUNCTION trigger_function_afterDelete()
      RETURNS trigger AS
$BODY$
      BEGIN
           INSERT INTO coils_realtime_log
                 (record_timestamp,  record_table_name,  record_id,  record_operation,  record_status)
           VALUES
                 ( now(),   TG_TABLE_NAME ,  OLD.id,  'DELETE',  'WAITING');
           RETURN NULL;
      END;
$BODY$
LANGUAGE plpgsql;
"
          ]

        (println "Coils trigger function exists: " coils-trigger-fn-exists)
        (if (not coils-trigger-fn-exists )
            (korma.core/exec-raw   [sql-to-create-trigger-fn []]   [])
            nil
            )
        )
    )





(defn do-real [& {:keys [:table-name]}]
  (println "table name: " table-name)
  (make-admin-table )
  (make-log-table   )
  ( make-log-table-insert-trigger-function)
  ( make-log-table-update-trigger-function)
  ( make-log-table-delete-trigger-function)
  (create-realtime-trigger  :table-name  table-name)
)


(defn !get-query-results-v2 [{:keys [
                                     db-table
                          		       where
                                     start
                                     end
                                     params
                                     order
                                     realtime
                                     data-session-id
                          		   ]}]

  (println "************************************************************************************")
  (println "!get-query-results-v2*   REALTIME = " realtime)
  (println (str "!get-query-results-v2: "
                db-table
                where " "
                start  " "
                end " "
                params " "
                order " "
                data-session-id " "
                realtime " "
                ))
  (println "************************************************************************************")

  (cond
       realtime

       (let [
             query-key   (create-query-key
                            :db-table  db-table
                            :where     where
                            :start     start
                            :end       end
                            :params    params
                            :order     order)
             ]

           (if (get @cached-queries  query-key)
               nil
               (let [
                     record-count       (get-count   db-table  where   params)



                     results            (get-results    :db-table db-table
                                                        :where    where
                                                        :order    order
                                                        :start    start
                                                        :end      end
                                                        :params   params
                                                        )

                     result-id-vector   (into [] (map :id results))
                    ]
                      (swap! cached-queries assoc  query-key {
                                                               :records      result-id-vector
                                                               :count        record-count
                                                                  })
              )

           )

          (do-real   :table-name db-table)

          (println "-------------------------------")
          (println "@cached-queries     " @cached-queries)
          (println query-key)
          (println (get @cached-queries  query-key))
          (println "-------------------------------")

           (get @cached-queries  query-key)
      )



      :else

      (do
          (let [
                 record-count      (get-count   db-table  where   params)



        results

       (get-results   :db-table db-table
                      :where    where
                      :order    order
                      :start    start
                      :end      end
                      :params   params
        )

		result-id-vector
		(into [] (map :id results))
		]

    ;(println result-id-vector)
    {
     :records      result-id-vector
      :count       record-count
     }
    ))))

















(defn !get-record-result-v2
  [{:keys [
           db-table
           id
           fields
           data-session-id
           ]}]
      ;(println (str " !get-record-result-v2 DATA_SESSION_ID: " data-session-id))
  {:value
   (sql-1
    (str
     "select "
     (fields-to-str fields) " "
     "from "
     db-table " "
     "where id = ? "
     (cond
       (= *database-type* "postgres" )
       " limit 1"

       (= *database-type* "oracle" )
       ""
       )


     ) [id])})



;(sql-1 "select count(id) from table_name " [])


(def realtime-counter (atom 0))
(defn next-realtime-id [] (swap! realtime-counter inc))



; deletes the realtime log every time the file is reloaded, or the server is restarted
(korma.core/exec-raw ["delete from coils_realtime_log" []] [])






(defn process-log-entry [ realtime-log-entry ]
  (do
   (println (str "**** Processing: " realtime-log-entry))
   (println (str @cached-queries))
   (println (str "Count: " (-> @cached-queries keys count str)))
   (let [queries (keys @cached-queries)]
   (doall (for [query queries]
     (println (str "   " query)))
   ))))






(go
  (loop []
    (do
        (let [realtime-log-entry   (<! server-side-record-changes)]
            (process-log-entry  realtime-log-entry )
        )
        (recur)
      )
    ))




(def my-pool (mk-pool))




(every 1000 (fn []
              (let [next-id   (next-realtime-id)

                    sql (str "update coils_realtime_log"
                            "      set record_status = 'PROCESSING',"
                            "          realtime_jvm_id = ? "
                            "where "
                            "      id in ( SELECT "
                            "                    id"
                            "              FROM "
                            "                    coils_realtime_log"
                            "              WHERE "
                            "                   record_status='WAITING' LIMIT 1 ) "
                    )

                    get-realtime-log-entry (str "select * from coils_realtime_log "
                                                "WHERE "
                                                "realtime_jvm_id = ?")
                    ]
                     (let [get-new-entry-count    (korma.core/exec-raw [sql [next-id]] []) ]
                       (do
                       (println "processing: " get-new-entry-count )
                       ;(println (str @cached-queries))
                        (if (pos? (first get-new-entry-count))
                          (do
                        (let [realtime-log-entry-list
                              (korma.core/exec-raw [get-realtime-log-entry [next-id]] :results)
                              realtime-log-entry (first realtime-log-entry-list)
                                ]
                          (go
                            (if realtime-log-entry
                               (>! server-side-record-changes  realtime-log-entry)))
                          ))))
                 ))) my-pool )


