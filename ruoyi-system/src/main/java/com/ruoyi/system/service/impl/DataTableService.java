package com.ruoyi.system.service.impl;

import com.ruoyi.system.domain.DataTable;
import com.ruoyi.system.domain.DataTableFieldValues;
import com.ruoyi.system.domain.DataTableFields;
import com.ruoyi.system.mapper.DataTableMapper;
import com.ruoyi.system.service.IDataTableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DataTableService implements IDataTableService {
    @Autowired
    private DataTableMapper dataTableMapper;

    @Override
    public int insertDataTable(DataTable dataTable) {
        return dataTableMapper.insertDataTable(dataTable);
    }

    @Override
    public int insertDataTableFields(DataTableFields fields) {
        return dataTableMapper.insertDataTableFields(fields);
    }

    @Override
    public int insertDataTableFieldValues(DataTableFieldValues v) {
        return dataTableMapper.insertDataTableFieldValues(v);
    }
}
