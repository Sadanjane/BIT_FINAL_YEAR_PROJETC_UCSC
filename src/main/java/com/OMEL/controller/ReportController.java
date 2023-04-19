package com.OMEL.controller;


import com.OMEL.repository.InvoiceRepository;
import com.OMEL.repository.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/report")
public class ReportController {

    @Autowired
    private ReportRepository dao;

    @Autowired
    private InvoiceRepository invoicedao;

    @GetMapping(value = "/supplierareus" , produces = "application/JSON")
    public List  supplierAreusList(){
        return dao.areusAmountFindAll();
    }

    /*income report by given start date  , end date and type*/
    @GetMapping(value = "/netincome" , params = {"sdate" , "edate" , "type"} , produces = "application/JSON")
    public List incomeReport(@RequestParam("sdate")String sdate , @RequestParam("edate")String edate , @RequestParam("type")String type){
        if(type.equals("Daily"))
            return dao.dailyIncome(sdate , edate);
        if(type.equals("Weekly"))
            return dao.weeklyIncome(sdate , edate);
        if(type.equals("Monthly"))
            return  dao.monthlyIncome(sdate , edate);
        if(type.equals("Yearly"))
            return  dao.yearlyIncome(sdate , edate);
        else
            return null;
    }


    //expencess report by given start date  , end date and type
    @GetMapping(value = "/expencess" , params = {"sdate" , "edate" , "type"} , produces = "application/JSON")
    public List expencessReport(@RequestParam("sdate")String sdate , @RequestParam("edate")String edate , @RequestParam("type")String type){
        if(type.equals("Daily"))
            return dao.dailyExpencess(sdate , edate);
        if(type.equals("Weekly"))
            return dao.weeklyExpencess(sdate , edate);
        if(type.equals("Monthly"))
            return  dao.monthlyExpencess(sdate , edate);
        if(type.equals("Yearly"))
            return  dao.yearlyExpencess(sdate , edate);
        else
            return null;
    }
    //itemsales  report by given start date  , end date and type
    @GetMapping(value = "/itemsales" , params = {"itemname","sdate" , "edate" , "type"} , produces = "application/JSON")
    public List itemSalesReport(@RequestParam("itemname") String itemname , @RequestParam("sdate")String sdate , @RequestParam("edate")String edate , @RequestParam("type")String type){
        if(type.equals("Daily"))
            return dao.dailyItemSale(itemname , sdate , edate);
        if(type.equals("Weekly"))
            return dao.weeklySale(itemname , sdate , edate);
        if(type.equals("Monthly"))
            return  dao.monthlySale(itemname , sdate , edate);
        if(type.equals("Yearly"))
            return  dao.yearlySale(itemname , sdate , edate);
        else
            return null;
    }

    //  this month expenses for dashboard
    @GetMapping(value = "salesthismonth" , produces = "application/JSON")
    public List thismonthexpenseReport(){
        return dao.thismonthExpenses();
    }

    //  this month income for dashboard
    @GetMapping(value = "incomesthismonth" , produces = "application/JSON")
    public List thismonthIncomeReport(){
        return dao.thisMonthIncome();
    }

    //  this month income for dashboard
    @GetMapping(value = "orderscount" , produces = "application/JSON")
    public List activeOrders(){
        return dao.orderCount();
    }

    //  this month income for dashboard
    @GetMapping(value = "customercount" , produces = "application/JSON")
    public List activeCustomers(){
        return dao.activeCustomers();
    }

    //get most selling items for 6 months
    @GetMapping(value = "mostsellingitems" , produces = "application/JSON")
    public List sixmonthitemselling(){
        return dao.mostsellingitems();
    }

    /*NOTIFICATIONS*/
    @GetMapping(value = "expirecheque" , produces = "application/JSON")
    public List expireCheque(){
        return dao.expireCheques();
    }

    @GetMapping(value = "expireitems" , produces = "application/JSON")
    public List expirwItems(){
        return dao.expiringitemsByBatch();
    }

}
