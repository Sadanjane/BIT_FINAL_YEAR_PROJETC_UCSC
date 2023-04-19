package com.OMEL.controller;

import com.OMEL.model.POrderHasItem;
import com.OMEL.model.SupplierHasItem;
import com.OMEL.model.SupplierReturnHasItem;
import com.OMEL.repository.SupplierHasItemRepository;
import com.OMEL.repository.SupplierReturnHasItemRepository;
import com.OMEL.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/supplierreturn_has_item")
public class SupplierReturnHasItemController {

    @Autowired
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private SupplierReturnHasItemRepository dao;


    @GetMapping(value = "/list", produces = "application/json")
    public List<SupplierReturnHasItem> supplierHasItemList(){
        return dao.findAll();
    }

    //get mapping for get supplier return has item list object by given item id and supplier return in grn module grn type return only
    @GetMapping(value = "/listByItemsupplierret" ,params = {"itemid" , "returnid"},produces = "application/json")
    public SupplierReturnHasItem supplierReturnHasItem(@RequestParam("itemid") int itemid , @RequestParam("returnid") int returnid){
        return dao.supretbyitemreturn(itemid , returnid);
    }

    /*//get mapping for get quataionhasItem obejct list by given quatationid and itemid
    @GetMapping(value = "/listBySI" , params = {"supplierid"} , produces = "application/json")
    public List<SupplierHasItem> supplierHasItemList (@RequestParam("supplierid") int supplierid){
        return dao.listBySupplierItem(supplierid);
    }
*/
   /* @GetMapping(value = "/nextnumber"  , produces = "application/json")
    public Supplier nextNumber(){
        String nextNumber = dao.getNextRegNo();
        Supplier nextSupplier = new Supplier(nextNumber);
        return nextSupplier;
    }*/

/*    // get mapping service for get All customers as page request [/customer/findAll?page=0&size=1]
    @GetMapping(value = "/findAll" , params = {"page" , "size"} , produces = "application/json")
    public Page<Quatation> findAll(@RequestParam("page") int page , @RequestParam("size") int size){
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "QUATATION");
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
          return null;
    }
}*/

/*
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
                supplier.setSupplierstatus_id(SupStatusDao.getById(2));

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

*/
}
