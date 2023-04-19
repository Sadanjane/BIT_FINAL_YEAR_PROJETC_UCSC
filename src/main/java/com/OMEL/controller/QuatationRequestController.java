package com.OMEL.controller;

import com.OMEL.model.*;
import com.OMEL.repository.QuatationRequestRepository;
import com.OMEL.repository.QutationRequestStatusRepository;
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
@RequestMapping(value = "/quatationrequest")
public class QuatationRequestController {

    @Autowired
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private QuatationRequestRepository dao;

    @Autowired
    private QutationRequestStatusRepository statusRepository;

    @Autowired
    private EmailService emailService;

    @GetMapping(value = "/list", produces = "application/json")
    public List<QuatationRequset> quatationList(){
        return dao.findAll();
    }

    //get mapping for get quatationrequest list by given supplierid
    @GetMapping(value = "/listBySupplier" ,params = {"supplierid"},produces = "application/json")
    public List<QuatationRequset> listBySupplier(@RequestParam("supplierid") int supplierid){
        return dao.listBySupplier(supplierid);
    }


   @GetMapping(value = "/nextnumber"  , produces = "application/json")
    public QuatationRequset nextNumber(){
        String nextNumber = dao.getNextReqNo();
        QuatationRequset quatationRequset = new QuatationRequset(nextNumber);
        return quatationRequset;
    }

   // get mapping service for get All customers as page request [/customer/findAll?page=0&size=1]
    @GetMapping(value = "/findAll" , params = {"page" , "size"} , produces = "application/json")
    public Page<QuatationRequset> findAll(@RequestParam("page") int page , @RequestParam("size") int size){
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "QUOTATTIONREQ");
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
          return null;
    }
}


    //post mapping service for inster all customers as page request
    @PostMapping
    public String insert(@RequestBody QuatationRequset quatationreq) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "QUOTATTIONREQ");
        if (user != null & priv != null & priv.get("add")) {

            System.out.println(quatationreq);
            try {
                dao.save(quatationreq);

               /* emailService.sendMail(quatationreq.getSupplier_id().getEmail(),"Quotation Request ",
                        "Hi " + quatationreq.getSupplier_id().getCompanyfullname() + "Hello, my name is Mr/Mrs."+ quatationreq.getEmployee_id().getCallingname() +" " +
                                "and I'm the" + quatationreq.getEmployee_id().getDesignationId().getName() +" of OMEL Lanka Supermarket. I'm writing this email to request a price quote for items based on your supplies for our supermarket:\n\n " + "thank you !!!");
         */       return "0";
            } catch (Exception ex) {
                return "Save Not Completed" + ex.getMessage();
            }
        } else {
            return "Error saving  : you have no previlages...!";
        }
    }


    //PUT MAPPING FOR INSERT UPDATED ITEM OBJECTS TO DB
    @PutMapping
    public String update(@RequestBody QuatationRequset quatationRequset) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "QUOTATTIONREQ");
        if (user != null & priv != null & priv.get("add")) {
            try {
                dao.save(quatationRequset);
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
    public String delete(@RequestBody QuatationRequset quatationRequset) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "QUOTATTIONREQ");
        if (user != null & priv != null & priv.get("add")) {
            try {
                quatationRequset.setQuatationrequeststatus_id(statusRepository.getById(4));
                dao.save(quatationRequset);
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
    public Page<QuatationRequset> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "QUOTATTIONREQ");
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
            return null;
        }
    }


}
