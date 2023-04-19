package com.OMEL.controller;


import com.OMEL.model.CustomerStatus;
import com.OMEL.repository.CustomerStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "customerstatus")
public class CustomerStatusController {

    @Autowired
    private CustomerStatusRepository dao;

    //(localhost:8080/customerstatus/list)
    @GetMapping(value = "/list", produces = "application/json")
    public List<CustomerStatus> customerStatusList(){
        return dao.findAll();
    }
}
