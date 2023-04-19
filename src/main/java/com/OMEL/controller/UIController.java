package com.OMEL.controller;

import com.OMEL.model.User;
import com.OMEL.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class UIController {

    @Autowired
    private UserService userService;

    @RequestMapping(value = "/access-denied", method = RequestMethod.GET)
    public ModelAndView error(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("error.html");
        return modelAndView;
    }

    @RequestMapping(value = "/config", method = RequestMethod.GET)
    public ModelAndView config(){
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("config.html");
        return modelAndView;
    }

    @GetMapping(value = {"/employee" })
    public ModelAndView employeeui() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("employee.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @GetMapping(value = {"/customer" })
    public ModelAndView customerUI() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("customer.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @GetMapping(value = {"/item" })
    public ModelAndView itemUI() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("item.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @GetMapping(value = {"/supplier" })
    public ModelAndView supplierUI() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("supplier.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @GetMapping(path = "/employee/{id}")
    public ModelAndView employeessui() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("employee.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @GetMapping(value = "/privilage")
    public ModelAndView privilageui() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("privilage.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }




    @RequestMapping(value = "/user", method = RequestMethod.GET)
    public ModelAndView user() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("user.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/purchaseorder", method = RequestMethod.GET)
    public ModelAndView purchaseOrderUI() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("purchaseorder.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/quatation", method = RequestMethod.GET)
    public ModelAndView quatationUI() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("quatation.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/quatationrequest", method = RequestMethod.GET)
    public ModelAndView quatationRequestUI() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("quatationrequest.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/supplierreturn", method = RequestMethod.GET)
    public ModelAndView supplierReturnUI() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
                modelAndView.setViewName("supplierreturn.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/batch", method = RequestMethod.GET)
    public ModelAndView batchUI() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("batch.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/grn", method = RequestMethod.GET)
    public ModelAndView grnUI() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("grn.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/supplierpayment", method = RequestMethod.GET)
    public ModelAndView supplierPaymentUI() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("supplierpayment.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/invoice", method = RequestMethod.GET)
    public ModelAndView invoiceUI() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("invoice.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/mainwindow2", method = RequestMethod.GET)
    public ModelAndView minWindow2UI() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("mainvindow2.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/mainwindow3", method = RequestMethod.GET)
    public ModelAndView minWindow3UI() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("mainvindow.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/inventory", method = RequestMethod.GET)
    public ModelAndView inventoryUI() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("inventory.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }

    @RequestMapping(value = "/customerorder", method = RequestMethod.GET)
    public ModelAndView customerorderUI() {
        ModelAndView modelAndView = new ModelAndView();
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findUserByUserName(auth.getName());
        if(user!= null){
            modelAndView.setViewName("customerorder.html");
        }
        else
            modelAndView.setViewName("error.html");

        return modelAndView;
    }


}





