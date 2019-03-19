package com.ruoyi.generator.domain;

import com.ruoyi.common.json.JSON;
import com.ruoyi.common.utils.StringUtils;

import java.util.ArrayList;
import java.util.List;

/**
 * ry数据库表列信息
 * 
 * @author ruoyi
 */
public class ColumnInfo
{
    /** 字段名称 */
    private String columnName;

    /** MySQL字段类型 */
    private String dataType;

    /** 列描述 */
    private String columnComment;

    /** 列配置 */
    private ColumnConfigInfo configInfo;

    /** Java属性类型 */
    private String attrType;

    /** Java属性名称(第一个字母大写)，如：user_name => UserName */
    private String attrName;

    /** Java属性名称(第一个字母小写)，如：user_name => userName */
    private String attrname;

    /** 执行计划（包含了与索引相关的一些细节信息） */
    private String extra;

    // 是否可搜索
    private boolean isSearchField;
    // 是否可编辑
    private boolean isEditField;
    // 该列是否显示在列表
    private boolean visible = true;
    // 控件类型,默认为根据类型自动
    private String component = "";


    private int width = 150; //列宽
    private boolean sortable = false;//是否排序

    //校验对象
    private List<Verify> verifyList = new ArrayList<>();

    public String getColumnName()
    {
        return columnName;
    }

    public void setColumnName(String columnName)
    {
        this.columnName = columnName;
    }

    public String getDataType()
    {
        return dataType;
    }

    public void setDataType(String dataType)
    {
        this.dataType = dataType;
    }

    public String getColumnComment()
    {
        return columnComment;
    }

    public String getComponent() {
        return component;
    }

    public void setComponent(String component) {
        this.component = component;
    }

    public void setColumnComment(String columnComment)
    {
        // 根据列描述解析列的配置信息
        if (StringUtils.isNotEmpty(columnComment) && columnComment.startsWith("{"))
        {
            try {
                this.configInfo = JSON.unmarshal(columnComment, ColumnConfigInfo.class);
            }catch(Exception ex){
                ex.printStackTrace();
            }
            this.columnComment = configInfo.getTitle();
        }
        else
        {
            this.columnComment = columnComment;
        }
    }

    public String getAttrName()
    {
        return attrName;
    }

    public void setAttrName(String attrName)
    {
        this.attrName = attrName;
    }

    public String getAttrname()
    {
        return attrname;
    }

    public void setAttrname(String attrname)
    {
        this.attrname = attrname;
    }

    public String getAttrType()
    {
        return attrType;
    }

    public void setAttrType(String attrType)
    {
        this.attrType = attrType;
    }

    public String getExtra()
    {
        return extra;
    }

    public void setExtra(String extra)
    {
        this.extra = extra;
    }

    public ColumnConfigInfo getConfigInfo()
    {
        return configInfo;
    }

    public void setConfigInfo(ColumnConfigInfo configInfo)
    {
        this.configInfo = configInfo;
    }

    public List<Verify> getVerifyList() {
        return verifyList;
    }

    public void setVerifyList(List<Verify> verifyList) {
        this.verifyList = verifyList;
    }

    public String getVerifyStr(){
        String vv = "";
        if(verifyList!=null && verifyList.size()>0){
            for(Verify v : verifyList) {
                vv += "|" + v.getName();
            }
            if(vv.length()>0){
                return vv.substring(1,vv.length());
            }
        }
        return vv;
    }

    public boolean isSearchField() {
        return isSearchField;
    }

    public void setSearchField(boolean searchField) {
        isSearchField = searchField;
    }

    public boolean isEditField() {
        return isEditField;
    }

    public void setEditField(boolean editField) {
        isEditField = editField;
    }

    public boolean isVisible() {
        return visible;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public boolean isSortable() {
        return sortable;
    }

    public void setSortable(boolean sortable) {
        this.sortable = sortable;
    }
}
