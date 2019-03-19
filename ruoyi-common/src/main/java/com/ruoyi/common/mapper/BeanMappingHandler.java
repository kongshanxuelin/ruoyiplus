package com.ruoyi.common.mapper;

public interface BeanMappingHandler<S, T> {
    T map(S source, Class<T> destinationClass);
}
