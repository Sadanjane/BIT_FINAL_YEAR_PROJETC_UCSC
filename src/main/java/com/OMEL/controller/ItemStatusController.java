package com.OMEL.controller;


import com.OMEL.model.ItemStatus;
import com.OMEL.repository.ItemStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "itemstatus")
public class ItemStatusController {

    @Autowired
    private ItemStatusRepository dao;

    //(localhost:8080/itemstatus/list)
    @GetMapping(value = "/list", produces = "application/json")
    public List<ItemStatus> itemStatusList(){
        return dao.findAll();
    }
}
