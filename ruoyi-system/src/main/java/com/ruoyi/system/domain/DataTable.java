package com.ruoyi.system.domain;

import com.ruoyi.common.base.BaseEntity;

import java.io.Serializable;
import java.util.Date;

public class DataTable implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String tableName;
    private String tableLabel;
    private String sys;
    private Date modifyTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getTableLabel() {
        return tableLabel;
    }

    public void setTableLabel(String tableLabel) {
        this.tableLabel = tableLabel;
    }

    public String getSys() {
        return sys;
    }

    public void setSys(String sys) {
        this.sys = sys;
    }

    public Date getModifyTime() {
        return modifyTime;
    }

    public void setModifyTime(Date modifyTime) {
        this.modifyTime = modifyTime;
    }
}
