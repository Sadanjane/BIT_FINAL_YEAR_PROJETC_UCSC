package com.OMEL.controller;


import com.OMEL.model.QuatationReqStatus;
import com.OMEL.repository.QutationRequestStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "quatationreqstatus")
public class QuatationRequestStatusController {

    @Autowired
    private QutationRequestStatusRepository dao;

    //(localhost:8080/quatationstatus/list)
    @GetMapping(value = "/list", produces = "application/json")
    public List<QuatationReqStatus> quatationReqStatuses(){
        return dao.findAll();
    }
}
