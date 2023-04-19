package com.OMEL.controller;

import com.OMEL.model.*;
import com.OMEL.repository.*;
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
@RequestMapping(value = "/supreturn")
public class SupplierReturnController {

    @Autowired
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private SupplierReturnRepository dao;

    @Autowired
    private BatchRepository batchdao;

    @Autowired
    private SupplierReturnStatusRepository statusDao;


    @GetMapping(value = "/list", produces = "application/json")
    public List<SupplierReturn> supplierReturnList(){
        return dao.findAll();
    }

    //get mapping for get quatation list by given supplierid
    /*@GetMapping(value = "/listBySupplier" ,params = {"supplierid"},produces = "application/json")
    public List<Quatation> listBySupplier(@RequestParam("supplierid") int supplierid){
        return dao.listBySupplier(supplierid);
    }*/

    @GetMapping(value = "/supRetBySupplier" ,params = {"supplierid"}, produces = "application/json")
    public List<SupplierReturn> orders(@RequestParam("supplierid")int supplierid ){
        return dao.supRetBySupplier(supplierid);
    }

    @GetMapping(value = "/nextnumber"  , produces = "application/json")
    public SupplierReturn nextNumber(){
        String nextNumber = dao.getNextSupRetCode();
        SupplierReturn nextSupRetCode = new SupplierReturn(nextNumber);
        return nextSupRetCode;
    }

  // get mapping service for get All customers as page request [/customer/findAll?page=0&size=1]
    @GetMapping(value = "/findAll" , params = {"page" , "size"} , produces = "application/json")
    public Page<SupplierReturn> findAll(@RequestParam("page") int page , @RequestParam("size") int size){
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SUPPLIERRETURN");
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
          return null;
    }
}


    //srhi = supplier return has item
    //post mapping service for inster all customers as page request
    @PostMapping
    public String insert(@RequestBody SupplierReturn supplierReturn) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SUPPLIERRETURN");
        if(user != null & priv != null & priv.get("add")){
            try {
                System.out.println(supplierReturn);
                for (SupplierReturnHasItem srhi : supplierReturn.getSupplierReturnHasItemList()) {
                    srhi.setSupplierreturn_id(supplierReturn);
                }
                dao.save(supplierReturn);

                for(SupplierReturnHasItem srhi : supplierReturn.getSupplierReturnHasItemList()){
                    Batch receivedbatch = batchdao.getBySupplierItemBatchno(supplierReturn.getSupplier_id().getId() , srhi.getItem_id().getId() , srhi.getBatch_id().getBatchnumber() );
                    receivedbatch.setAvailableqty(receivedbatch.getAvailableqty().subtract(srhi.getQty())); //return karpu item gana available qty eken adu krnawa
                    receivedbatch.setReturnqty(receivedbatch.getReturnqty().add(srhi.getQty())); //batch module ekema tyenawa return qty ekk. return karpu gana ekata add krnawa
                    batchdao.save(receivedbatch);
                }

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
    public String update(@RequestBody SupplierReturn supplierReturn) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SUPPLIERRETURN");
        if(user != null & priv != null & priv.get("update")){
            try {

                for (SupplierReturnHasItem shi : supplierReturn.getSupplierReturnHasItemList())
                    shi.setSupplierreturn_id(supplierReturn);

                dao.save(supplierReturn);
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
    public String delete(@RequestBody SupplierReturn supplierReturn) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SUPPLIERRETURN");
        if (user != null & priv != null & priv.get("delete")) {
            try {
                supplierReturn.setReturnstatus_id(statusDao.getById(4));

                for (SupplierReturnHasItem shi : supplierReturn.getSupplierReturnHasItemList())
                    shi.setSupplierreturn_id(supplierReturn);

                dao.save(supplierReturn);
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
    public Page<SupplierReturn> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SUPPLIERRETURN");
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
            return null;
        }
    }


}
