package com.OMEL.controller;

import com.OMEL.model.Customer;
import com.OMEL.model.SMS;
import com.OMEL.model.User;
import com.OMEL.repository.CustomerRepository;
import com.OMEL.repository.CustomerStatusRepository;
import com.OMEL.service.EmailService;
import com.OMEL.service.SMSService;
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
@RequestMapping(value = "/customer")
public class CustomerController {

    @Autowired
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private CustomerRepository dao;

    @Autowired
    private SMSService smsServiceDao;

    @Autowired
    private EmailService emailServiceDao;

    @Autowired
    private CustomerStatusRepository CustomStatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Customer> customerList(){
        return dao.findAll();
    }

    @GetMapping(value = "/ActiveCus" , produces = "application/json")
    public List<Customer> customers(){
        return dao.activeCus();
    }

    @GetMapping(value = "/nextnumber" , produces = "application/json")
    public Customer nextNumber(){
        String nextNumber = dao.getNextNumber();
        Customer nextCustomer = new Customer(nextNumber);
        return nextCustomer;
    }

    // get mapping service for get All customers as page request [/customer/findAll?page=0&size=1]
    @GetMapping(value = "/findAll" , params = {"page" , "size"} , produces = "application/json")
    public Page<Customer> findAll(@RequestParam("page") int page , @RequestParam("size") int size){
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMER");
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
            return null;
        }
    }

    //post mapping service for inster all customers as page request
    @PostMapping
    public String insert(@RequestBody Customer custom) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMER");
        if (user != null & priv != null & priv.get("add")) {

            Customer receivedNIC = dao.findByNIC(custom.getNic());
            /*Customer receivedMOBILE = dao.findByMOBILE(String.valueOf(custom.getMobileno()));
            if(receivedMOBILE != null){
                return "Error : Customer Mobile No Already Exists";
            }*/
            if (receivedNIC != null){
                return "Error : Customer Nic Already Exists";
            }else{
                try {
                    dao.save(custom);
                    /*SMS sms  = new SMS();
                    sms.setTo("+94774908320");
                    String massege = "Welcome to the OMEL Lanka Supermarket";
                    sms.setMessage(massege);
                    smsServiceDao.send(sms);*/

                    emailServiceDao.sendMail(custom.getEmail(),"Register Customer","Hi.." + custom.getFname() + custom.getLname()+ "Customer Registration Successfully...!\n\n Thank You to join with us.. \n\n from : OMEL LANKA SUPERMARKET");

                    return "0";
                }catch (Exception ex){
                    return "Save Not Completed" + ex.getMessage();
                }
            }
        } else {
            return "Error saving  : you have no previlages...!";
        }
    }

    //PUT MAPPING FOR INSERT UPDATED ITEM OBJECTS TO DB
    @PutMapping
    public String update(@RequestBody Customer custom) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMER");
        if (user != null & priv != null & priv.get("add")) {
            try {
                Customer customer = dao.getById(custom.getId());
                if(custom.getNic() == customer.getNic()){
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

    //FOR DELETE OPTION
    @DeleteMapping
    public String delete(@RequestBody Customer custom) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMER");
        if (user != null & priv != null & priv.get("add")) {
            try {
                custom.setCustomerstatus_id1(CustomStatusDao.getById(2));
                dao.save(custom);

                emailServiceDao.sendMail(custom.getEmail(),"Registered Customer ",
                        "Hi " + custom.getFname() + " "+ custom.getLname() +  "\n\n Your Account Has been suspended \n\n from : OMEL Lanka Supermarket");

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
    public Page<Customer> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "CUSTOMER");
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
            return null;
        }
    }


}
