package com.OMEL.controller;


import com.OMEL.model.GRNStatus;
import com.OMEL.repository.GRNStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/grnstatus")
public class GRNStatusController {

    @Autowired
    private GRNStatusRepository grnStatusDao;

    //(localhost:8080/quatationstatus/list)
    @GetMapping(value = "/list", produces = "application/json")
    public List<GRNStatus> grnStatuses(){
        return grnStatusDao.findAll();
    }
}
