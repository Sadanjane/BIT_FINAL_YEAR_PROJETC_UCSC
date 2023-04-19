package com.OMEL.controller;


import com.OMEL.model.UnitType;
import com.OMEL.repository.UnitTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "unitytype")
public class UnitTypeController {

    @Autowired
    private UnitTypeRepository dao;

    //(localhost:8080/customerstatus/list)
    @GetMapping(value = "/list", produces = "application/json")
    public List<UnitType> unitTypeList(){
        return dao.findAll();
    }
}
