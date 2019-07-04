package com.ruoyi.system.mapper;

import com.ruoyi.system.domain.DataTable;
import com.ruoyi.system.domain.DataTableFieldValues;
import com.ruoyi.system.domain.DataTableFields;

import java.util.List;

public interface DataTableMapper {
    public List<DataTable> selectDataTableList(DataTable dataTable);
    public DataTable selectDataTableById(Long id);
    public int deleteDataTableByIds(Long[] ids);
    public int updateDataTable(DataTable dataTable);
    public int insertDataTable(DataTable dataTable);

    public int insertDataTableFields(DataTableFields dataTableFields);
    public int insertDataTableFieldValues(DataTableFieldValues dataTableFieldValues);

}
