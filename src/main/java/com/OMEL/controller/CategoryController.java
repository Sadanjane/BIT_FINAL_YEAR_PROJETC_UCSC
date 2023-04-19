package com.OMEL.controller;


import com.OMEL.model.Category;
import com.OMEL.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "category")
public class CategoryController {

    @Autowired
    private CategoryRepository dao;

    //(localhost:8080/customerstatus/list)
    @GetMapping(value = "/list", produces = "application/json")
    public List<Category> categoryList(){
        return dao.findAll();
    }
}
