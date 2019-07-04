package com.ruoyi.system.domain;

import com.ruoyi.common.base.BaseEntity;

import java.io.Serializable;
import java.util.Date;

public class DataTableFields implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long objId;
    private String objField;
    private String objLabel;

    private Date modifyTime;
    private String objDefault;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getObjId() {
        return objId;
    }

    public void setObjId(Long objId) {
        this.objId = objId;
    }

    public String getObjField() {
        return objField;
    }

    public void setObjField(String objField) {
        this.objField = objField;
    }

    public String getObjLabel() {
        return objLabel;
    }

    public void setObjLabel(String objLabel) {
        this.objLabel = objLabel;
    }

    public Date getModifyTime() {
        return modifyTime;
    }

    public void setModifyTime(Date modifyTime) {
        this.modifyTime = modifyTime;
    }

    public String getObjDefault() {
        return objDefault;
    }

    public void setObjDefault(String objDefault) {
        this.objDefault = objDefault;
    }

    public String getObjType() {
        return objType;
    }

    public void setObjType(String objType) {
        this.objType = objType;
    }

    private String objType;



}
