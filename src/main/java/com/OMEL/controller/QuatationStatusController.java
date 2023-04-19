package com.OMEL.controller;


import com.OMEL.model.QuatationStatus;
import com.OMEL.repository.QutationStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "quatationstatus")
public class QuatationStatusController {

    @Autowired
    private QutationStatusRepository dao;

    //(localhost:8080/quatationstatus/list)
    @GetMapping(value = "/list", produces = "application/json")
    public List<QuatationStatus> quatationStatustas(){
        return dao.findAll();
    }
}
