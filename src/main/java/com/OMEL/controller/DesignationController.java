package com.OMEL.controller;


import com.OMEL.model.Designation;
import com.OMEL.repository.DesignationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping(value = "/designation")
@RestController
public class DesignationController {

    @Autowired
    private DesignationRepository dao;


    @GetMapping(value = "/list", produces = "application/json")
    public List<Designation> designations() {
        return dao.list();
    }



}
