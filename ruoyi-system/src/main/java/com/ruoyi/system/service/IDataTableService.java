package com.ruoyi.system.service;

import com.ruoyi.system.domain.DataTable;
import com.ruoyi.system.domain.DataTableFieldValues;
import com.ruoyi.system.domain.DataTableFields;
import com.ruoyi.system.domain.SysUserOnline;

import java.util.List;

public interface IDataTableService {
    public int insertDataTable(DataTable dataTable);
    public int insertDataTableFields(DataTableFields fields);
    public int insertDataTableFieldValues(DataTableFieldValues fields);
}
