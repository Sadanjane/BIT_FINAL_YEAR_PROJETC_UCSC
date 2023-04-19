package com.OMEL.controller;

import com.OMEL.model.Supplier;
import com.OMEL.model.SupplierHasItem;
import com.OMEL.model.User;
import com.OMEL.repository.SupplierRepository;
import com.OMEL.repository.SupplierStatusRepository;
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
@RequestMapping(value = "/supplier")
public class SupplierController {

    @Autowired
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private SupplierRepository dao;

    @Autowired
    private SupplierStatusRepository SupStatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Supplier> supplierList(){
        return dao.findAll();
    }

    @GetMapping(value = "/ActiveSup" , produces = "application/json")
    public List<Supplier> suppliers(){
        return dao.activeSup();
    }

    @GetMapping(value = "/nextnumber"  , produces = "application/json")
    public Supplier nextNumber(){
        String nextNumber = dao.getNextRegNo();
        Supplier nextSupplier = new Supplier(nextNumber);
        return nextSupplier;
    }

    // get mapping service for get All customers as page request [/customer/findAll?page=0&size=1]
    @GetMapping(value = "/findAll" , params = {"page" , "size"} , produces = "application/json")
    public Page<Supplier> findAll(@RequestParam("page") int page , @RequestParam("size") int size){
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SUPPLIER");
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
          return null;
    }
}

    //post mapping service for inster all customers as page request
    @PostMapping
    public String insert(@RequestBody Supplier supplier) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SUPPLIER");
        if(user != null & priv != null & priv.get("add")){
            try {

                Supplier receivedcustomer = dao.findByMobile(supplier.getCpmobile());
                if(receivedcustomer != null){
                    return "Error validation : Company Person Mobile Number already exists";
                }

                //
                for (SupplierHasItem shi : supplier.getSupplierHasItemList())
                    shi.setSupplier_id(supplier);

                dao.save(supplier);
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
    public String update(@RequestBody Supplier supplier) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SUPPLIER");
        if(user != null & priv != null & priv.get("update")){
            try {

                for (SupplierHasItem shi : supplier.getSupplierHasItemList())
                    shi.setSupplier_id(supplier);

                dao.save(supplier);
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
    public String delete(@RequestBody Supplier supplier) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SUPPLIER");
        if (user != null & priv != null & priv.get("delete")) {
            try {
                supplier.setSupplierstatus_id(SupStatusDao.getById(4));

                for (SupplierHasItem shi : supplier.getSupplierHasItemList())
                    shi.setSupplier_id(supplier);

                dao.save(supplier);
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
    public Page<Supplier> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SUPPLIER");
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
            return null;
        }
    }


}
