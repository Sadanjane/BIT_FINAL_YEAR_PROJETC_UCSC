package com.OMEL.controller;


import com.OMEL.repository.BrandHasCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "brand_has_category")
public class BrandHasCategoryController {

    @Autowired
    private BrandHasCategoryRepository dao;


}
