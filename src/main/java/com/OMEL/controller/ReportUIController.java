package com.OMEL.controller;

import com.OMEL.model.User;
import com.OMEL.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class ReportUIController {

    @Autowired
    private UserService userService;

    @RequestMapping(value = "/samplereport", method = RequestMethod.GET)
    public ModelAndView sampleReportUI() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("report/reportsample.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "areusamountreport", method = RequestMethod.GET)
    public ModelAndView AreusAmountReportUI() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("report/reportareusamount.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "incomereport", method = RequestMethod.GET)
    public ModelAndView IncomeReportUI() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("report/incomereport.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "expencereport", method = RequestMethod.GET)
    public ModelAndView ExpencessReportUI() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("report/expencessreport.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "itemsalereport", method = RequestMethod.GET)
    public ModelAndView itemsaleReportUI() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("report/itemsalereport.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "profitreport", method = RequestMethod.GET)
    public ModelAndView profitReportUI() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("report/profitreport.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }


}





