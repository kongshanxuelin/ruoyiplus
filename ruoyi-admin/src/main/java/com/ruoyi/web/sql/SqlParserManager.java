package com.ruoyi.web.sql;

import com.alibaba.druid.sql.ast.SQLStatement;
import com.alibaba.druid.sql.dialect.mysql.parser.MySqlStatementParser;
import com.alibaba.druid.sql.dialect.mysql.visitor.MySqlSchemaStatVisitor;
import com.alibaba.druid.stat.TableStat;

import java.util.*;

public class SqlParserManager {
    private SqlParserManager(){}
    private static SqlParserManager instance = new SqlParserManager();
    public static SqlParserManager getInstance(){
        if(instance == null){
            instance = new SqlParserManager();
        }
        return instance;
    }

    public Map parser(String sql){
        Map retMap = new HashMap();
        if(sql==null) return retMap;
        MySqlStatementParser parser = new MySqlStatementParser(sql);
        List<SQLStatement> sqlList = parser.parseStatementList();
        if(sqlList!=null && sqlList.size()==1){
            SQLStatement stat = sqlList.get(0);
            MySqlSchemaStatVisitor visitor = new MySqlSchemaStatVisitor();
            stat.accept(visitor);
            Map<TableStat.Name, TableStat> tables = visitor.getTables();
            Collection<TableStat.Column> columns = visitor.getColumns();
            List<TableStat.Condition> condition = visitor.getConditions();
            List<TableStat.Column> columns_orders = visitor.getOrderByColumns();
            Set<TableStat.Column> columns_groupby =  visitor.getGroupByColumns();
            List<Object> params = visitor.getParameters();
            retMap.put("tables",tables);
            retMap.put("columns",columns);
            retMap.put("columns_orders",columns_orders);
            retMap.put("columns_groupby",columns_groupby);
            retMap.put("condition",condition);
            retMap.put("params",params);
        }
        return retMap;
    }
}
