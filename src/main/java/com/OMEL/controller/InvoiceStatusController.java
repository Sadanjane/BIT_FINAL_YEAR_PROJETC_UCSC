package com.OMEL.controller;


import com.OMEL.model.InvoiceStatus;
import com.OMEL.repository.InvoiceStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "invoicestatus")
public class InvoiceStatusController {

    @Autowired
    private InvoiceStatusRepository dao;

    //(localhost:8080/itemstatus/list)
    @GetMapping(value = "/list", produces = "application/json")
    public List<InvoiceStatus> invoiceStatuses(){
        return dao.findAll();
    }
}
