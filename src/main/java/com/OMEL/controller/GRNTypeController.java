package com.OMEL.controller;


import com.OMEL.model.GRNType;
import com.OMEL.repository.GRNTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/grntype")
public class GRNTypeController {

    @Autowired
    private GRNTypeRepository grnTypeDao;

    //(localhost:8080/quatationstatus/list)
    @GetMapping(value = "/list", produces = "application/json")
    public List<GRNType> grnTypes(){
        return grnTypeDao.findAll();
    }
}
