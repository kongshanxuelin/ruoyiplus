package com.ruoyi.generator.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.google.common.collect.Lists;
import com.ruoyi.common.support.Convert;
import com.ruoyi.generator.domain.ColumnConfigInfo;
import com.ruoyi.generator.domain.Verify;
import org.apache.velocity.VelocityContext;
import com.ruoyi.common.config.Global;
import com.ruoyi.common.constant.Constants;
import com.ruoyi.common.utils.DateUtils;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.generator.domain.ColumnInfo;
import com.ruoyi.generator.domain.TableInfo;

/**
 * 代码生成器 工具类
 * 
 * @author ruoyi
 */
public class GenUtils
{
    /** 项目空间路径 */
    private static final String PROJECT_PATH = getProjectPath();

    /** mybatis空间路径 */
    private static final String MYBATIS_PATH = "main/resources/mapper";

    /** html空间路径 */
    private static final String TEMPLATES_PATH = "main/resources/templates";

    /** 类型转换 */
    public static Map<String, String> javaTypeMap = new HashMap<String, String>();

    /**
     * 设置列信息
     */
    public static List<ColumnInfo> transColums(List<ColumnInfo> columns,Map<String,String[]> params)
    {
        // 列信息
        List<ColumnInfo> columsList = new ArrayList<>();
        for (ColumnInfo column : columns)
        {
            // 列名转换成Java属性名
            String attrName = StringUtils.convertToCamelCase(column.getColumnName());
            column.setAttrName(attrName);
            column.setAttrname(StringUtils.uncapitalize(attrName));
            column.setExtra(column.getExtra());

            // 列的数据类型，转换成Java类型
            String attrType = javaTypeMap.get(column.getDataType());
            column.setAttrType(attrType);


            // 网页设置的额外信息处理
            if(params!=null) {
                //setColumnConfigInfo(column,params);
                column.setSearchField(getParam(params, column.getColumnName() + "_searchField", "false").equals("true"));
                column.setEditField(getParam(params, column.getColumnName() + "_editField", "false").equals("true"));
                column.setSortable(getParam(params, column.getColumnName() + "_sortable", "false").equals("true"));
                column.setVisible(getParam(params, column.getColumnName() + "_visible", "false").equals("true"));

                //设置编辑列的控件类型
                column.setComponent(getParam(params, column.getColumnName() + "_component", ""));

                ColumnConfigInfo _configInfo = new ColumnConfigInfo();
                _configInfo.setValue(getParam(params, column.getColumnName() + "_editArg", ""));
                _configInfo.setType(column.getAttrType());
                _configInfo.setTitle(column.getColumnComment());
                column.setConfigInfo(_configInfo);

                String _verify = getParam(params, column.getColumnName() + "_verify");
                if (!StrUtil.isEmpty(_verify)) {
                    String[] vvs = StrUtil.splitToArray(_verify, ',');
                    if (vvs != null && vvs.length > 0) {
                        List<Verify> _verifyList = Lists.newArrayList();
                        for (String _vvs : vvs) {
                            if (!StrUtil.isEmpty(_vvs)) {
                                _verifyList.add(new Verify(_vvs));
                            }
                        }
                        column.setVerifyList(_verifyList);
                    }
                }
            }
            columsList.add(column);
        }
        return columsList;
    }

    public static VelocityContext getVelocityContext(TableInfo table)
    {
        return getVelocityContext(table,null);
    }

    private static void setColumnConfigInfo(ColumnInfo column,Map<String,String[]> params){
        //格式形如：{type:'dict',url:''},type:text(默认),select(下拉框，配合url获取下拉列表),dict(数据词典下拉框),checkbox,radio,date(配合format)，autocomplete（配合url)，tree（选择树，配合url），switch等
        String _paramValue = Convert.toStr(getParam(params,column.getAttrname() + "_editArg"),"");
        if(!_paramValue.startsWith("{")) _paramValue = "{" + _paramValue;
        if(!_paramValue.endsWith("}")) _paramValue = _paramValue + "}";
        JSONObject json = JSONUtil.parseObj(_paramValue);

        ColumnConfigInfo cci = new ColumnConfigInfo();
        cci.setType(Convert.toStr(json.get("type"),"text"));
        cci.setValue(json.toString());
        cci.setTitle(column.getColumnComment());
        column.setConfigInfo(cci);

    }
    /**
     * 获取模板信息
     * 
     * @return 模板列表
     */
    public static VelocityContext getVelocityContext(TableInfo table,String _packageName)
    {
        // java对象数据传递到模板文件vm
        VelocityContext velocityContext = new VelocityContext();
        String packageName = _packageName==null?Global.getPackageName():_packageName;
        velocityContext.put("tableName", table.getTableName());
        velocityContext.put("tableComment", replaceKeyword(table.getTableComment()));
        velocityContext.put("primaryKey", table.getPrimaryKey());
        velocityContext.put("className", table.getClassName());
        velocityContext.put("classname", table.getClassname());
        velocityContext.put("moduleName", getModuleName(packageName));
        velocityContext.put("columns", table.getColumns());
        velocityContext.put("basePackage", getBasePackage(packageName));
        velocityContext.put("package", packageName);
        velocityContext.put("author", Convert.toStr(Global.getAuthor(),"cxlh"));
        velocityContext.put("datetime", DateUtils.getDate());

        velocityContext.put("module", StrUtil.isEmpty(table.getModule())?getModuleName(packageName):table.getModule());
        velocityContext.put("uri",table.getUri());
        velocityContext.put("dir",table.getBaseDir());
        velocityContext.put("tmpl",table.getWebTempleName());
        return velocityContext;
    }


    /**
     * 项目生成中的变量
     *
     * @return 模板列表
     */
    public static VelocityContext getVelocityContext(String projectName,String basePackage,String version)
    {
        VelocityContext velocityContext = new VelocityContext();
        velocityContext.put("basePackage", Convert.toStr(basePackage,"com.ruoyi"));
        velocityContext.put("version", version);
        velocityContext.put("projectName", projectName);
        return velocityContext;
    }

    /**
     * 获取模板信息
     * 
     * @return 模板列表
     */
    public static List<String> getTemplates()
    {
        List<String> templates = new ArrayList<String>();
        templates.add("vm/java/domain.java.vm");
        templates.add("vm/java/Mapper.java.vm");
        templates.add("vm/java/Service.java.vm");
        templates.add("vm/java/ServiceImpl.java.vm");
        templates.add("vm/java/Controller.java.vm");
        templates.add("vm/xml/Mapper.xml.vm");
        templates.add("vm/html/list.html.vm");
        templates.add("vm/html/add.html.vm");
        templates.add("vm/html/edit.html.vm");
        templates.add("vm/sql/sql.vm");
        return templates;
    }

    public static List<String> getTemplatesWeb(TableInfo.GenStyle genStyle, String tmplDir)
    {
        List<String> templates = new ArrayList<String>();
        //前台代码
        if(genStyle == TableInfo.GenStyle.Web) {
            templates.add("vm/web/" + tmplDir + "/html/list.html.vm");
            templates.add("vm/web/" + tmplDir + "/html/add.html.vm");
            templates.add("vm/web/" + tmplDir + "/html/edit.html.vm");

            templates.add("vm/web/" + tmplDir + "/js/list.js.vm");
            templates.add("vm/web/" + tmplDir + "/js/add.js.vm");
        }else if(genStyle == TableInfo.GenStyle.Java) {
            //后台代码
            templates.add("vm/java/domain.java.vm");
            templates.add("vm/java/Mapper.java.vm");
            templates.add("vm/java/Service.java.vm");
            templates.add("vm/java/ServiceImpl.java.vm");
            templates.add("vm/java/Controller.java.vm");
            templates.add("vm/xml/Mapper.xml.vm");
            templates.add("vm/sql/sql.vm");
        }else if(genStyle == TableInfo.GenStyle.Project){
            templates.add("vm/project/main.java.vm");
            templates.add("vm/project/pom.xml.vm");
        }else{
            templates.add("vm/web/" + tmplDir + "/html/list.html.vm");
            templates.add("vm/web/" + tmplDir + "/html/add.html.vm");
            templates.add("vm/web/" + tmplDir + "/html/edit.html.vm");

            templates.add("vm/web/" + tmplDir + "/js/list.js.vm");
            templates.add("vm/web/" + tmplDir + "/js/add.js.vm");

            templates.add("vm/java/domain.java.vm");
            templates.add("vm/java/Mapper.java.vm");
            templates.add("vm/java/Service.java.vm");
            templates.add("vm/java/ServiceImpl.java.vm");
            templates.add("vm/java/Controller.java.vm");
            templates.add("vm/xml/Mapper.xml.vm");
            templates.add("vm/sql/sql.vm");
        }
        return templates;
    }
    /**
     * 表名转换成Java类名
     */
    public static String tableToJava(String tableName)
    {
        String autoRemovePre = Global.getAutoRemovePre();
        String tablePrefix = Global.getTablePrefix();
        //多种前缀
        if(tablePrefix.indexOf(",")>0){
            String[] prefixes = StrUtil.splitToArray(tablePrefix,',');
            for(String _prefix : prefixes){
                if(!StrUtil.isEmpty(_prefix)){
                    tableName = tableName.replaceFirst(_prefix, "");
                }
            }
        }else {
            if (Constants.AUTO_REOMVE_PRE.equals(autoRemovePre) && StringUtils.isNotEmpty(tablePrefix)) {
                tableName = tableName.replaceFirst(tablePrefix, "");
            }
        }
        return StringUtils.convertToCamelCase(tableName);
    }

    /**
     * 获取文件名
     */
    public static String getFileName(String template, TableInfo table, String moduleName)
    {
        // 小写类名
        String classname = table.getClassname();
        // 大写类名
        String className = table.getClassName();
        String javaPath = PROJECT_PATH;
        String mybatisPath = MYBATIS_PATH + "/" + moduleName + "/" + className;
        String htmlPath = TEMPLATES_PATH + "/" + moduleName + "/" + classname;

        if (template.contains("domain.java.vm"))
        {
            return javaPath + "domain" + "/" + className + ".java";
        }

        if (template.contains("Mapper.java.vm"))
        {
            return javaPath + "mapper" + "/" + className + "Mapper.java";
        }

        if (template.contains("Service.java.vm"))
        {
            return javaPath + "service" + "/" + "I" + className + "Service.java";
        }

        if (template.contains("ServiceImpl.java.vm"))
        {
            return javaPath + "service" + "/impl/" + className + "ServiceImpl.java";
        }

        if (template.contains("Controller.java.vm"))
        {
            return javaPath + "controller" + "/" + className + "Controller.java";
        }

        if (template.contains("Mapper.xml.vm"))
        {
            return mybatisPath + "Mapper.xml";
        }

        if (template.contains("list.html.vm"))
        {
            return htmlPath + "/" + classname + ".html";
        }
        if (template.contains("add.html.vm"))
        {
            return htmlPath + "/" + "add.html";
        }
        if (template.contains("edit.html.vm"))
        {
            return htmlPath + "/" + "edit.html";
        }
        if (template.contains("sql.vm"))
        {
            return classname + "Menu.sql";
        }
        return null;
    }

    /**
     * 获取模块名
     * 
     * @param packageName 包名
     * @return 模块名
     */
    public static String getModuleName(String packageName)
    {
        int lastIndex = packageName.lastIndexOf(".");
        int nameLength = packageName.length();
        String moduleName = StringUtils.substring(packageName, lastIndex + 1, nameLength);
        return moduleName;
    }

    public static String getBasePackage(String packageName)
    {
        int lastIndex = packageName.lastIndexOf(".");
        String basePackage = StringUtils.substring(packageName, 0, lastIndex);
        return basePackage;
    }

    public static String getProjectPath()
    {
        String packageName = Global.getPackageName();
        StringBuffer projectPath = new StringBuffer();
        projectPath.append("main/java/");
        projectPath.append(packageName.replace(".", "/"));
        projectPath.append("/");
        return projectPath.toString();
    }

    public static String replaceKeyword(String keyword)
    {
        String keyName = keyword.replaceAll("(?:表|信息)", "");
        return keyName;
    }

    public static String getParam(Map<String,String[]> params,String key){
        if(params.containsKey(key)){
            String[] ss = params.get(key);
            if(ss!=null && ss.length>1)
                return ArrayUtil.join(ss,",");
            else if(ss!=null && ss.length==1){
                return Convert.toStr(ss[0]);
            }
        }
        return null;
    }

    public static String getParam(Map<String,String[]> params,String key,String defaultValue){
        String ss = getParam(params,key);
        if(StrUtil.isEmpty(ss)){
            return defaultValue;
        }else{
            return ss;
        }
    }

    static
    {
        javaTypeMap.put("tinyint", "Integer");
        javaTypeMap.put("smallint", "Integer");
        javaTypeMap.put("mediumint", "Integer");
        javaTypeMap.put("int", "Integer");
        javaTypeMap.put("integer", "integer");
        javaTypeMap.put("bigint", "Long");
        javaTypeMap.put("float", "Float");
        javaTypeMap.put("double", "Double");
        javaTypeMap.put("decimal", "BigDecimal");
        javaTypeMap.put("bit", "Boolean");
        javaTypeMap.put("char", "String");
        javaTypeMap.put("varchar", "String");
        javaTypeMap.put("tinytext", "String");
        javaTypeMap.put("text", "String");
        javaTypeMap.put("mediumtext", "String");
        javaTypeMap.put("longtext", "String");
        javaTypeMap.put("time", "Date");
        javaTypeMap.put("date", "Date");
        javaTypeMap.put("datetime", "Date");
        javaTypeMap.put("timestamp", "Date");
    }
}
