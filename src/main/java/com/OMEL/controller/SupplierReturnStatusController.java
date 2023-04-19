package com.OMEL.controller;


import com.OMEL.model.ReturnStatus;
import com.OMEL.repository.SupplierReturnStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "supplierReturnstatus")
public class SupplierReturnStatusController {

    @Autowired
    private SupplierReturnStatusRepository dao;

    //(localhost:8080/supplierstatus/list)
    @GetMapping(value = "/list", produces = "application/json")
    public List<ReturnStatus> statusList(){
        return dao.findAll();
    }
}
