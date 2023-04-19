package com.OMEL.controller;


import com.OMEL.model.CustomerOrderStatus;
import com.OMEL.repository.CustomerOrderStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "customerorderstatus")
public class CustomerOrderStatusController {

    @Autowired
    private CustomerOrderStatusRepository dao;

    //(localhost:8080/quatationstatus/list)
    @GetMapping(value = "/list", produces = "application/json")
    public List<CustomerOrderStatus> statusList(){
        return dao.findAll();
    }
}
