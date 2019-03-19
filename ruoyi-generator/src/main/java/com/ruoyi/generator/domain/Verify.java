package com.ruoyi.generator.domain;

public class Verify {
    public Verify(String name){
        this.name = name;
    }
    private String name;//校验规则名称

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
