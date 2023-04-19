package com.OMEL.controller;


import com.OMEL.model.ReturnReason;
import com.OMEL.repository.SupplierReturnReasonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "returnreason")
public class SupplierReturnReasonController {

    @Autowired
    private SupplierReturnReasonRepository dao;

    //(localhost:8080/supplierstatus/list)
    @GetMapping(value = "/list", produces = "application/json")
    public List<ReturnReason> reasonList(){
        return dao.findAll();
    }
}
