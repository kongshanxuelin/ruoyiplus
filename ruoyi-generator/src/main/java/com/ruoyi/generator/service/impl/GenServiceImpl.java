package com.ruoyi.generator.service.impl;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.google.common.collect.Lists;
import com.ruoyi.common.config.Global;
import com.ruoyi.common.constant.Constants;
import com.ruoyi.common.support.Convert;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.generator.domain.ColumnInfo;
import com.ruoyi.generator.domain.TableInfo;
import com.ruoyi.generator.domain.Verify;
import com.ruoyi.generator.mapper.GenMapper;
import com.ruoyi.generator.service.IGenService;
import com.ruoyi.generator.util.GenUtils;
import com.ruoyi.generator.util.VelocityInitializer;
import org.apache.commons.io.IOUtils;
import org.apache.velocity.Template;
import org.apache.velocity.VelocityContext;
import org.apache.velocity.app.Velocity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * 代码生成 服务层处理
 *
 * @author ruoyi
 */
@Service
public class GenServiceImpl implements IGenService {
    private static final Logger log = LoggerFactory.getLogger(GenServiceImpl.class);

    @Autowired
    private GenMapper genMapper;

    /**
     * 查询ry数据库表信息
     *
     * @param tableInfo 表信息
     * @return 数据库表列表
     */
    @Override
    public List<TableInfo> selectTableList(TableInfo tableInfo) {
        return genMapper.selectTableList(tableInfo);
    }

    /**
     * 生成代码
     *
     * @param tableName 表名称
     * @return 数据
     */
    @Override
    public byte[] generatorCode(String tableName, Map<String, String[]> params) {
        return generatorCode(null, tableName, params);
    }

    @Override
    public byte[] generatorCode(
            TableInfo.GenStyle codeStyle, String tableName, Map<String, String[]> params) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ZipOutputStream zip = new ZipOutputStream(outputStream);
        // 查询表信息
        String prefix = GenUtils.getParam(params, "prefix");
        TableInfo table = getTableInfo(tableName, prefix, params);
        // 查询列信息
        List<ColumnInfo> columns = table.getColumns();
        // 列的额外信息处理
        for (ColumnInfo c : columns) {
            String[] ss = params.get(c.getAttrname());
            if (ss != null && ss.length == 1) {
                JSONObject _json = JSONUtil.parseObj(ss[0]);
                c.setWidth(Convert.toInt(_json.get("width"), 150));
                c.setVisible(Convert.toBool(_json.get("visible"), true));
                c.setEditField(Convert.toBool(_json.get("editable"), true));
                c.setSearchField(Convert.toBool(_json.get("searchable"), false));
                List<Verify> verifyList = Lists.newArrayList();
                if (_json.containsKey("verify")) {
                    String vvs = Convert.toStr(_json.get("verify"));
                    if (vvs.length() > 0) {
                        String[] vvArray = StrUtil.splitToArray(vvs, ',');
                        for (String _v : vvArray) {
                            verifyList.add(new Verify(_v));
                        }
                    }
                    c.setVerifyList(verifyList);
                } else {
                    c.setVerifyList(verifyList);
                }
            }
        }
        // 生成代码
        String tmpl = GenUtils.getParam(params, "tmpl");
        if (StrUtil.isEmpty(tmpl)) {
            generatorCode(table, zip);
        } else {
            generatorAdvCodeOnlyWeb(tmpl, table, columns, params, zip);
        }
        IOUtils.closeQuietly(zip);
        return outputStream.toByteArray();
    }

    /**
     * 批量生成代码
     *
     * @param tableNames 表数组
     * @return 数据
     */
    @Override
    public byte[] generatorCode(String[] tableNames) {
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ZipOutputStream zip = new ZipOutputStream(outputStream);
        for (String tableName : tableNames) {
            // 查询表信息
            TableInfo table = getTableInfo(tableName, StrUtil.EMPTY);
            // 生成代码
            generatorCode(table, zip);
        }
        IOUtils.closeQuietly(zip);
        return outputStream.toByteArray();
    }

    @Override
    public TableInfo getTableInfo(String tableName) {
        return getTableInfo(tableName, StrUtil.EMPTY);
    }

    @Override
    public TableInfo getTableInfo(String tableName, String prefix) {
        return getTableInfo(tableName, prefix, null);
    }

    @Override
    public TableInfo getTableInfo(String tableName, String prefix, Map<String, String[]> params) {
        TableInfo table = genMapper.selectTableByName(tableName);
        if (table != null) {
            // 查询列信息
            List<ColumnInfo> columns = genMapper.selectTableColumnsByName(tableName);
            String tn = table.getTableName();
            if (StrUtil.isNotEmpty(prefix) && tn.startsWith(prefix)) {
                tn = tn.substring(prefix.length() - 1);
            }
            // 表名转换成Java属性名
            String className = GenUtils.tableToJava(tn);
            table.setClassName(className);
            table.setClassname(StringUtils.uncapitalize(className));
            // 列信息
            table.setColumns(GenUtils.transColums(columns, params));
            // 设置主键
            table.setPrimaryKey(table.getColumnsLast());
        }
        return table;
    }

    /**
     * 生成代码
     */
    private void generatorCode(TableInfo table, ZipOutputStream zip) {
        // 设置主键
        table.setPrimaryKey(table.getColumnsLast());
        VelocityInitializer.initVelocity();
        String packageName = Global.getPackageName();
        String moduleName = GenUtils.getModuleName(packageName);

        VelocityContext context = GenUtils.getVelocityContext(table);

        // 获取模板列表
        List<String> templates = GenUtils.getTemplates();
        for (String template : templates) {
            // 渲染模板
            StringWriter sw = new StringWriter();
            Template tpl = Velocity.getTemplate(template, Constants.UTF8);
            tpl.merge(context, sw);
            try {
                // 添加到zip
                zip.putNextEntry(new ZipEntry(GenUtils.getFileName(template, table, moduleName)));
                IOUtils.write(sw.toString(), zip, Constants.UTF8);
                IOUtils.closeQuietly(sw);
                zip.closeEntry();
            } catch (IOException e) {
                log.error("渲染模板失败，表名：" + table.getTableName(), e);
            }
        }
    }

    private void generatorAdvCodeOnlyWeb(
            String tmplName,
            TableInfo table,
            List<ColumnInfo> columns,
            Map<String, String[]> params,
            ZipOutputStream zip) {
        Map<String, String> swMap = generatorAdvCodeOnlyWeb(tmplName, table, columns, params);
        for (Map.Entry<String, String> entry : swMap.entrySet()) {
            String fileName = Convert.toStr(entry.getKey());
            fileName = fileName.substring(fileName.lastIndexOf("/") + 1, fileName.length());
            fileName = StrUtil.replace(fileName, ".vm", "");
            try {
                // 添加到zip
                zip.putNextEntry(new ZipEntry(fileName));
                IOUtils.write(Convert.toStr(entry.getValue()), zip, Constants.UTF8);
                zip.closeEntry();
            } catch (IOException e) {
                log.error("渲染模板失败，表名：" + table.getTableName(), e);
            }
        }
    }

    private Map generatorAdvCodeOnlyWeb(
            String tmplName, TableInfo table, List<ColumnInfo> columns, Map<String, String[]> params) {
        Map retMap = new HashMap();
        // 设置主键
        table.setPrimaryKey(table.getColumnsLast());
        // 设置表格的访问地址
        table.setUri(Convert.toStr(GenUtils.getParam(params, "uri"), "system/unknown"));
        VelocityInitializer.initVelocity();

        String packageName = GenUtils.getParam(params, "package");
        String moduleName = GenUtils.getParam(params, "module");
        table.setModule(moduleName);

        String genJava = Convert.toStr(GenUtils.getParam(params, "gen-java"), "0");
        String genHtml = Convert.toStr(GenUtils.getParam(params, "gen-html"), "0");
        TableInfo.GenStyle genStyle = TableInfo.GenStyle.All;
        if (genJava.equals("1") && genHtml.equals("0")) {
            genStyle = TableInfo.GenStyle.Java;
        } else if (genHtml.equals("1") && genJava.equals("0")) {
            genStyle = TableInfo.GenStyle.Web;
        }
        VelocityContext context = GenUtils.getVelocityContext(table, packageName);

        // 获取模板列表
        List<String> templates = GenUtils.getTemplatesWeb(genStyle, tmplName);
        return putIntoMap(retMap, context, templates);
    }

    private Map putIntoMap(Map retMap, VelocityContext context, List<String> templates) {
        for (String template : templates) {
            // 渲染模板
            StringWriter sw = new StringWriter();
            Template tpl = Velocity.getTemplate(template, Constants.UTF8);
            tpl.merge(context, sw);
            retMap.put(template, sw.toString());
        }
        return retMap;
    }

    @Override
    public Map generatorProjectCode(String projectName, String version, String basePackage) {
        Map retMap = new HashMap();
        VelocityInitializer.initVelocity();
        VelocityContext context = GenUtils.getVelocityContext(projectName, basePackage, version);
        // 获取模板列表
        List<String> templates = GenUtils.getTemplatesWeb(TableInfo.GenStyle.Project, null);
        return putIntoMap(retMap, context, templates);
    }

    @Override
    public Map previewCode(
            TableInfo.GenStyle codeStyle, String tableName, Map<String, String[]> params) {
        String prefix = GenUtils.getParam(params, "prefix");
        TableInfo table = getTableInfo(tableName, prefix, params);
        if (codeStyle == TableInfo.GenStyle.Web) {
            return generatorAdvCodeOnlyWeb(
                    GenUtils.getParam(params, "tmpl"), table, table.getColumns(), params);
        }
        return null;
    }
}
