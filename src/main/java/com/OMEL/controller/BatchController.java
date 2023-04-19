package com.OMEL.controller;

import com.OMEL.model.*;
import com.OMEL.repository.BatchRepository;
import com.OMEL.repository.BatchStatusRepository;
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
@RequestMapping(value = "/batch")
public class BatchController {

    @Autowired
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private BatchRepository dao;

    @Autowired
    private BatchStatusRepository statusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Batch> batches(){
        return dao.findAll();
    }

    //get mapping for get Batch obejct list by given batchnumber and itemid
    @GetMapping(value = "/listBySI" , params = {"supplierid" , "itemid"} , produces = "application/json")
    public List<Batch> listSupplierItem (@RequestParam("supplierid") int supplierid , @RequestParam("itemid")int itemid){
        return dao.listBySupplierItem(supplierid , itemid);
    }

    /*this service is for checking whethere exsits typing batch  umber in grn module*/
    @GetMapping(value = "/batchlistbybatch" , params={"itemid" , "batchcode"} , produces = "application/json")
    public Batch batchListByItemidBatcode(@RequestParam("itemid")int itemid , @RequestParam("batchcode")String batchcode){
        return dao.listByItemBatchcode(itemid,batchcode);
    }

    //get mapping for get Batch obejct list by given batchnumber and itemid
    @GetMapping(value = "/listbyItem" , params = {"itemname" } , produces = "application/json")
    public List<Batch> batchList (@RequestParam("itemname")String itemname){
        return dao.batchList(itemname);
    }

    //get mapping for get Batch obejct list by given itemname for customer order module
    @GetMapping(value = "/listbyItemCO" , params = {"itemname" } , produces = "application/json")
    public Batch batchListforCO(@RequestParam("itemname")String itemname){
        List<Batch> itembatch =  dao.batchListCO(itemname);
        if( itembatch.size() != 0){
            return itembatch.get(0);
        }

        return null;
    }

    @GetMapping(value = "/listbyBatch" , params = {"batchno" } , produces = "application/json")
    public Batch batches (@RequestParam("batchno")String batchno){
        return dao.batchListfrombatch(batchno);
    }

   // get mapping service for get All customers as page request [/customer/findAll?page=0&size=1]
    @GetMapping(value = "/findAll" , params = {"page" , "size"} , produces = "application/json")
    public Page<Batch> findAll(@RequestParam("page") int page , @RequestParam("size") int size){
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "BATCH");
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
          return null;
    }
}

    //post mapping service for inster all Batch as page request
    @PostMapping
    public String insert(@RequestBody Batch batch) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "BATCH");
        if (user != null & priv != null & priv.get("add")) {

            if(batch.getAvailableqty().add(batch.getReturnqty()) != batch.getTotalqty()){
                return "Error : Sum of available qty and return qty \b must be equal to total qty";
            }

            try {
                dao.save(batch);
                return "0";
            } catch (Exception ex) {
                return "Save Not Completed" + ex.getMessage();
            }
        } else {
            return "Error saving  : you have no previlages...!";
        }
    }

    //PUT MAPPING FOR INSERT UPDATED ITEM OBJECTS TO DB
    @PutMapping
    public String update(@RequestBody Batch batch) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "BATCH");
        if (user != null & priv != null & priv.get("add")) {
            try {
                dao.save(batch);
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
    public String delete(@RequestBody Batch batch) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "BATCH");
        if (user != null & priv != null & priv.get("add")) {
            try {
                batch.setBatchstatus_id(statusDao.getById(3));
                dao.save(batch);
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
    public Page<Batch> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "BATCH");
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
            return null;
        }
    }

    //inventory service
    //GET REQUEST MAPPING FOR GET ITEM PAGE REQUEST GIVEN PARAMS WITH SEARCH VALUE
    @GetMapping(value = "/itemfindAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<Batch> itemfindAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "INVENTORY");
        if (user != null & priv != null & priv.get("select")) {
            return dao.itemfindAll(searchtext,PageRequest.of(page, size));
        } else {
            return null;
        }
    }

    //this is for mainwindow low inventory table
    @GetMapping(value = "/getlowInventory" , produces = "application/JSON")
    public List findLowInventory(){
        return dao.itemFindAllLowInventory();
    }

}
