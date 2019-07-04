package com.ruoyi.generator.service;

import com.ruoyi.generator.domain.TableInfo;

import java.util.List;
import java.util.Map;

import static com.ruoyi.generator.domain.TableInfo.GenStyle;

/**
 * 代码生成 服务层
 *
 * @author ruoyi
 */
public interface IGenService {
    /**
     * 查询ry数据库表信息
     *
     * @param tableInfo 表信息
     * @return 数据库表列表
     */
    List<TableInfo> selectTableList(TableInfo tableInfo);

    /**
     * 生成代码
     *
     * @param tableName 表名称
     * @param columnMap 用户提交的列额外信息，如是否在列表显示，宽度等
     * @return 数据
     */
    byte[] generatorCode(String tableName, Map<String, String[]> columnMap);

    byte[] generatorCode(GenStyle codeStyle, String tableName, Map<String, String[]> params);

    /**
     * 批量生成代码
     *
     * @param tableNames 表数组
     * @return 数据
     */
    byte[] generatorCode(String[] tableNames);

    TableInfo getTableInfo(String tableName);

    TableInfo getTableInfo(String tableName, String prefix);

    TableInfo getTableInfo(String tableName, String prefix, Map<String, String[]> params);

    /**
     * 预览生成的代码
     *
     * @return
     */
    Map previewCode(GenStyle codeStyle, String tableName, Map<String, String[]> params);

    /**
     * 生成子工程项目的java代码和pom文件
     *
     * @param projectName
     * @param version
     * @param basePackage
     * @return
     */
    Map generatorProjectCode(String projectName, String version, String basePackage);
}
