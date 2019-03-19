package com.ruoyi.generator.service;

import java.util.List;
import java.util.Map;
import java.util.zip.ZipOutputStream;

import com.ruoyi.generator.domain.ColumnInfo;
import com.ruoyi.generator.domain.TableInfo;

import static com.ruoyi.generator.domain.TableInfo.*;

/**
 * 代码生成 服务层
 * 
 * @author ruoyi
 */
public interface IGenService
{
    /**
     * 查询ry数据库表信息
     * 
     * @param tableInfo 表信息
     * @return 数据库表列表
     */
    public List<TableInfo> selectTableList(TableInfo tableInfo);

    /**
     * 生成代码
     * 
     * @param tableName 表名称
     * @param columnMap 用户提交的列额外信息，如是否在列表显示，宽度等
     * @return 数据
     */
    public byte[] generatorCode(String tableName, Map<String,String[]> columnMap);

    public byte[] generatorCode(GenStyle codeStyle, String tableName,Map<String,String[]> params);

    /**
     * 批量生成代码
     * 
     * @param tableNames 表数组
     * @return 数据
     */
    public byte[] generatorCode(String[] tableNames);

    public TableInfo getTableInfo(String tableName);
    /**
     * 预览生成的代码
     * @return
     */
    public Map previewCode(GenStyle codeStyle, String tableName,Map<String,String[]> params);

    //生成子工程项目的java代码和pom文件
    public Map generatorProjectCode(String projectName,String version,String basePackage);

}
