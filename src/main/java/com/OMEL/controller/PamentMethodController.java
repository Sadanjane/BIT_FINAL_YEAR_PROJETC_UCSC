package com.OMEL.controller;


import com.OMEL.model.PaymentMethod;
import com.OMEL.repository.PaymentMethodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "paymentmethod")
public class PamentMethodController {

    @Autowired
    private PaymentMethodRepository dao;

    //(localhost:8080/quatationstatus/list)
    @GetMapping(value = "/list", produces = "application/json")
    public List<PaymentMethod> paymentMethods(){
        return dao.findAll();
    }
}
