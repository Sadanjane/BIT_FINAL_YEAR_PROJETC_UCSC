package com.OMEL.controller;


import com.OMEL.model.SubCategory;
import com.OMEL.repository.SubCategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "subcategory")
public class SubCategoryController {

    @Autowired
    private SubCategoryRepository dao;

    //(localhost:8080/customerstatus/list)
    @GetMapping(value = "/list", produces = "application/json")
    public List<SubCategory> subCategoryList(){
        return dao.findAll();
    }

    //get subcategory by subcategory id
    @GetMapping(value = "listByCategory" , params = {"category_id"}, produces = "application/json")
    public List<SubCategory>subCategoryListById(@RequestParam("category_id") int category_id){
        return dao.ListByCategory(category_id);
    }
}
