package com.OMEL.controller;


import com.OMEL.model.BatchStatus;
import com.OMEL.repository.BatchStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "batchstatus")
public class BatchStatusController {

    @Autowired
    private BatchStatusRepository dao;

    //(localhost:8080/supplierstatus/list)
    @GetMapping(value = "/list", produces = "application/json")
    public List<BatchStatus> statusList(){
        return dao.findAll();
    }
}
