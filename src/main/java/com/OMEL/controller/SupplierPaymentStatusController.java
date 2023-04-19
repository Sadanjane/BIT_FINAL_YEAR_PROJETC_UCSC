package com.OMEL.controller;


import com.OMEL.model.SupplierpaymentStatus;
import com.OMEL.repository.SupplierPaymentStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "supplierpaymentstatus")
public class SupplierPaymentStatusController {

    @Autowired
    private SupplierPaymentStatusRepository dao;

    //(localhost:8080/supplierstatus/list)
    @GetMapping(value = "/list", produces = "application/json")
    public List<SupplierpaymentStatus> statusList(){
        return dao.findAll();
    }
}
