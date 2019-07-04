package com.ruoyi.system.domain;

import com.ruoyi.common.base.BaseEntity;

import java.io.Serializable;
import java.util.Date;

public class DataTableFieldValues implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long objId;
    private Long fieldId;

    private String fieldValue;
    private Double fieldValueNum;
    private Long fieldValueInt;
    private Date fieldValueDate;

    private Date modifyTime;

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

    public Long getFieldId() {
        return fieldId;
    }

    public void setFieldId(Long fieldId) {
        this.fieldId = fieldId;
    }

    public String getFieldValue() {
        return fieldValue;
    }

    public void setFieldValue(String fieldValue) {
        this.fieldValue = fieldValue;
    }

    public Date getModifyTime() {
        return modifyTime;
    }

    public void setModifyTime(Date modifyTime) {
        this.modifyTime = modifyTime;
    }

    public Double getFieldValueNum() {
        return fieldValueNum;
    }

    public void setFieldValueNum(Double fieldValueNum) {
        this.fieldValueNum = fieldValueNum;
    }

    public Long getFieldValueInt() {
        return fieldValueInt;
    }

    public void setFieldValueInt(Long fieldValueInt) {
        this.fieldValueInt = fieldValueInt;
    }

    public Date getFieldValueDate() {
        return fieldValueDate;
    }

    public void setFieldValueDate(Date fieldValueDate) {
        this.fieldValueDate = fieldValueDate;
    }
}
