package com.OMEL.controller;

import com.OMEL.model.*;
import com.OMEL.repository.QuatationRepository;
import com.OMEL.repository.QuatationRequestRepository;
import com.OMEL.repository.QutationRequestStatusRepository;
import com.OMEL.repository.QutationStatusRepository;
import com.OMEL.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/quatation")
public class QuatationController {

    @Autowired
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private QuatationRepository dao;

    @Autowired
    private QutationStatusRepository quatationStatusDao;

    @Autowired
    private QuatationRequestRepository quatationRequestRepositoryDao;

    @Autowired
    private QutationRequestStatusRepository qutationRequestStatusRepositoryDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Quatation> quatationList(){
        return dao.findAll();
    }

    //get mapping for get quatation list by given supplierid
    @GetMapping(value = "/listBySupplier" ,params = {"supplierid"},produces = "application/json")
    public List<Quatation> listBySupplier(@RequestParam("supplierid") int supplierid){
        return dao.listBySupplier(supplierid ,  LocalDate.now());
    }

    @GetMapping(value = "/nextnumber"  , produces = "application/json")
    public Quatation nextNumber(){
        String nextNumber = dao.getNextQTnumber();
        Quatation nextQuatation = new Quatation(nextNumber);
        return nextQuatation;
    }

   // get mapping service for get All customers as page request [/customer/findAll?page=0&size=1]
    @GetMapping(value = "/findAll" , params = {"page" , "size"} , produces = "application/json")
    public Page<Quatation> findAll(@RequestParam("page") int page , @RequestParam("size") int size){
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "QUOTATION");
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
          return null;
    }
}

    /*qhi - quotation has item*/
    //post mapping service for inster all customers as page request
    @PostMapping
    public String insert(@RequestBody Quatation quatation) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "QUOTATION");
        if(user != null & priv != null & priv.get("add")){
            try {
                for (QuatationHasItem qhi : quatation.getQuatationHasItemList()){

                    /*when addign a quotation to the system requested quotation status must change as received*/
                    if(quatation.getQuatationrequest_id() != null){
                        QuatationRequset receivedQuotation = quatationRequestRepositoryDao.getById(quatation.getQuatationrequest_id().getId());
                        receivedQuotation.setQuatationrequeststatus_id(qutationRequestStatusRepositoryDao.getById(2));

                        QuatationRequset saveRequestedQuotation = quatationRequestRepositoryDao.save(receivedQuotation);
                        quatation.setQuatationrequest_id(saveRequestedQuotation);

                    }
                    qhi.setQuatation_id(quatation);
                }
                   

                dao.save(quatation);
                return "0";
            } catch (Exception ex) {
                return "Error Inserting" + ex.getMessage();
            }
        }else{
            return "Error deleting !! You have no Privillage";
        }
    }


    //PUT MAPPING FOR INSERT UPDATED ITEM OBJECTS TO DB
    @PutMapping
    public String update(@RequestBody Quatation quatation) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "QUOTATION");
        if(user != null & priv != null & priv.get("update")){
            try {

                for (QuatationHasItem shi : quatation.getQuatationHasItemList())
                    shi.setQuatation_id(quatation);

                dao.save(quatation);
                return "0";
            } catch (Exception ex) {
                return "Error Updating" + ex.getMessage();
            }
        }else{
            return "Error deleting !! You have no Privillage";
        }

    }

    //FOR DELETE OPTION
    @DeleteMapping
    public String delete(@RequestBody Quatation quatation) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "QUOTATION");
        if (user != null & priv != null & priv.get("delete")) {
            try {
                quatation.setQuatationstatus_id(quatationStatusDao.getById(3));

                for (QuatationHasItem shi : quatation.getQuatationHasItemList())
                    shi.setQuatation_id(quatation);

                dao.save(quatation);
                return "0";
            } catch (Exception ex) {
                return "Error Deleting" + ex.getMessage();
            }
        }else{
            return "Error deleting !! You have no Privillage";
        }
    }

    //GET REQUEST MAPPING FOR GET ITEM PAGE REQUEST GIVEN PARAMS WITH SEARCH VALUE
    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<Quatation> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "QUOTATION");
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
            return null;
        }
    }


}
