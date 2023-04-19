package com.OMEL.controller;


import com.OMEL.model.Unit;
import com.OMEL.repository.UnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "unit")
public class UnitController {

    @Autowired
    private UnitRepository dao;

    //(localhost:8080/customerstatus/list)
    @GetMapping(value = "/list", produces = "application/json")
    public List<Unit> unitList(){
        return dao.findAll();
    }
}
