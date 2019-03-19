package com.ruoyi.generator.domain;

import java.util.List;
import com.ruoyi.common.base.BaseEntity;
import com.ruoyi.common.utils.StringUtils;

/**
 * ry 数据库表
 * 
 * @author ruoyi
 */
public class TableInfo extends BaseEntity
{
    private static final long serialVersionUID = 1L;

    public static enum GenStyle {
        Web,Java,Project,All
    }

    /**前端模板目录名**/
    private String webTempleName = "layui";
    private GenStyle style = GenStyle.All;

    // 自动生成代码时，访问地址前缀，如admin/system等
    private String uri;

    //代码生成根目录
    private String baseDir;
    //模块名
    private String module;

    /** 表名称 */
    private String tableName;

    /** 表描述或模板中文名，如角色管理 */
    private String tableComment;

    /** 表的主键列信息 */
    private ColumnInfo primaryKey;

    /** 表的列名(不包含主键) */
    private List<ColumnInfo> columns;

    /** 类名(第一个字母大写) */
    private String className;

    /** 类名(第一个字母小写) */
    private String classname;

    public String getTableName()
    {
        return tableName;
    }

    public void setTableName(String tableName)
    {
        this.tableName = tableName;
    }

    public String getTableComment()
    {
        return tableComment;
    }

    public void setTableComment(String tableComment)
    {
        this.tableComment = tableComment;
    }

    public List<ColumnInfo> getColumns()
    {
        return columns;
    }

    public ColumnInfo getColumnsLast()
    {
        ColumnInfo columnInfo = null;
        if (StringUtils.isNotNull(columns) && columns.size() > 0)
        {
            columnInfo = columns.get(0);
        }
        return columnInfo;
    }

    public void setColumns(List<ColumnInfo> columns)
    {
        this.columns = columns;
    }

    public String getClassName()
    {
        return className;
    }

    public void setClassName(String className)
    {
        this.className = className;
    }

    public String getClassname()
    {
        return classname;
    }

    public void setClassname(String classname)
    {
        this.classname = classname;
    }

    public ColumnInfo getPrimaryKey()
    {
        return primaryKey;
    }

    public void setPrimaryKey(ColumnInfo primaryKey)
    {
        this.primaryKey = primaryKey;
    }

    public String getWebTempleName() {
        return webTempleName;
    }

    public void setWebTempleName(String webTempleName) {
        this.webTempleName = webTempleName;
    }

    public GenStyle getStyle() {
        return style;
    }

    public void setStyle(GenStyle style) {
        this.style = style;
    }

    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public String getModule() {
        return module;
    }

    public void setModule(String module) {
        this.module = module;
    }

    public String getBaseDir() {
        return baseDir;
    }

    public void setBaseDir(String baseDir) {
        this.baseDir = baseDir;
    }
}
