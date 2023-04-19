package com.OMEL.controller;

import com.OMEL.model.CustomerOrder;
import com.OMEL.model.CustomerOrderHasItem;
import com.OMEL.model.POrderHasItem;
import com.OMEL.model.User;
import com.OMEL.repository.CustomerOrderRepository;
import com.OMEL.repository.CustomerOrderStatusRepository;
import com.OMEL.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/customerorder")
public class CustomerOrderController {

    @Autowired
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private CustomerOrderRepository dao;

    @Autowired
    private CustomerOrderStatusRepository CustomOrderStatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<CustomerOrder> customerOrderrList(){
        return dao.findAll();
    }

    /*@GetMapping(value = "/ActiveCus" , produces = "application/json")
    public List<Customer> customers(){
        return dao.activeCus();
    }     */

    @GetMapping(value = "/cordersByCustomer" , params = {"customerid"} , produces = "application/json")
    public List <CustomerOrder> corder(@RequestParam("customerid")int customerid){
        return dao.corderList(customerid);
    }

    @GetMapping(value = "/nextnumber"  , produces = "application/json")
    public CustomerOrder nextNumber(){
        String ordercode = dao.getNextOrderNo();
        CustomerOrder nextOrder = new CustomerOrder(ordercode);
        return nextOrder;
    }

    // get mapping service for get All customers as page request [/customer/findAll?page=0&size=1]
    @GetMapping(value = "/findAll" , params = {"page" , "size"} , produces = "application/json")
    public Page<CustomerOrder> findAll(@RequestParam("page") int page , @RequestParam("size") int size){
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMERORDER");
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
            return null;
        }
    }


    //post mapping service for inster all customers as page request
    @PostMapping
    public String insert(@RequestBody CustomerOrder customerOrder) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMERORDER");
        if (user != null & priv != null & priv.get("add")) {

            System.out.println(customerOrder);
            try {
                for (CustomerOrderHasItem cohi : customerOrder.getOrderHasItemList())
                    cohi.setCustomerorder_id(customerOrder);

                dao.save(customerOrder);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed" + ex.getMessage();
            }
        } else {
            return "Error saving  : you have no previlages...!";
        }
    }
/*
    //PUT MAPPING FOR INSERT UPDATED ITEM OBJECTS TO DB
    @PutMapping
    public String update(@RequestBody Customer custom) {
        //Get security authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMER");
        if (user != null & priv != null & priv.get("add")) {
            try {
                if(custom.getNic() != null){
                    return "Error : Customer Nic Already Exists";
                }
                dao.save(custom);
                return "0";
            } catch (Exception ex) {
                return "Update Not Completed" + ex.getMessage();
            }
        } else {
            return "Error Updating  : you have no previlages...!";
        }
    }
*/
    //FOR DELETE OPTION
    @DeleteMapping
    public String delete(@RequestBody CustomerOrder customerOrder) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMERORDER");
        if (user != null & priv != null & priv.get("add")) {
            try {
                customerOrder.setCustomerorderstatus_id(CustomOrderStatusDao.getById(2));
                dao.save(customerOrder);
                return "0";
            } catch (Exception ex) {
                return "Delete Not Completed" + ex.getMessage();
            }
        } else {
            return "Error Deleting  : you have no previlages...!";
        }
    }


    //GET REQUEST MAPPING FOR GET ITEM PAGE REQUEST GIVEN PARAMS WITH SEARCH VALUE
    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<CustomerOrder> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMERORDER");
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
            return null;
        }
    }


}
