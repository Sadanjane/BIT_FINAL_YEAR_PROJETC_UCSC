package com.OMEL.controller;


import com.OMEL.model.Brand;
import com.OMEL.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "brand")
public class BrandController {

    @Autowired
    private BrandRepository dao;

    //(localhost:8080/customerstatus/list)
    @GetMapping(value = "/list", produces = "application/json")
    public List<Brand> brandList(){
        return dao.findAll();
    }

    //get mapping for get BarndHasItem obejct list by given categoryid
    @GetMapping(value = "/listByCat" , params = {"categoryid" } , produces = "application/json")
    public List<Brand> brandList (@RequestParam("categoryid") int categoryid){
        return dao.listByCategory(categoryid);
    }
}
