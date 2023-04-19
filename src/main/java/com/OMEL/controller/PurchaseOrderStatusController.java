package com.OMEL.controller;


import com.OMEL.model.PurchaseOrderStatus;
import com.OMEL.repository.PurchaseOrderStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "porderstatus")
public class PurchaseOrderStatusController {

    @Autowired
    private PurchaseOrderStatusRepository dao;

    //(localhost:8080/supplierstatus/list)
    @GetMapping(value = "/list", produces = "application/json")
    public List<PurchaseOrderStatus> purchaseOrderStatuses(){
        return dao.findAll();
    }
}
