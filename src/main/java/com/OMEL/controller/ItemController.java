package com.OMEL.controller;

import com.OMEL.model.*;
import com.OMEL.repository.ItemRepository;
import com.OMEL.repository.ItemStatusRepository;
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
@RequestMapping(value = "/item")
public class ItemController {

    @Autowired
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private ItemRepository dao;

    @Autowired
    private ItemStatusRepository ItemStatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<Item> itemList(){
        return dao.findAll();
    }

    @GetMapping(value = "/availableItemList", produces = "application/json")
    public List<Item> availableItemList(){
        return dao.list();
    }

    //get item number automatically
    @GetMapping(value = "/nextnumber" , produces = "application/json")
    public Item nextNumber(){
        String nextNumber = dao.getNextNumber();
        Item nextItem = new Item(nextNumber);
        return nextItem;
    }

    //get mapping for get item list by given supplierid
    @GetMapping(value = "/listBySupplier" ,params = {"supplierid"},produces = "application/json")
    public List<Item> listBySupplier(@RequestParam("supplierid") int supplierid){
        return dao.ListBySupplier(supplierid);
    }

    @GetMapping(value = "/listbyporderandsupplierreturn" , params = {"porderid" , "returnid"} , produces = "application/json")
    public List <Item> itemsListByPorderReturn(@RequestParam("porderid")int porderid , @RequestParam("returnid")int returnid){
        return dao.listByPorderReturn(porderid , returnid);
    }

    /*get items by supplier return id for grn module return only type*/
    @GetMapping(value = "/listbysupplierreturn" , params = {"returnid"} , produces = "application/json")
    public List <Item> itemsListByPorderReturn(@RequestParam("returnid")int returnid){
        return dao.listByReturn(returnid);
    }

    //get mapping for get Item list by given quatation
    @GetMapping(value = "/listByPorder" , produces = "application/json")
    public List <Item> itemList(@RequestParam("porderid") int porderid){
        return dao.listByPorder(porderid);
    }

    //get mapping for get Item list by given quatation
    @GetMapping(value = "/listByQuatation" , produces = "application/json")
    public List <Item> listByQuatation(@RequestParam("quatationid") int quatationid){
        return dao.listByQuatation(quatationid);
    }

    // get mapping service for get All customers as page request [/customer/findAll?page=0&size=1]
    @GetMapping(value = "/findAll" , params = {"page" , "size"} , produces = "application/json")
    public Page<Item> findAll(@RequestParam("page") int page , @RequestParam("size") int size){
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "ITEM");
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
            return null;
        }
    }

   //post mapping service for inster all items as page request
    @PostMapping
    public String insert(@RequestBody Item itm) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "ITEM");
        if (user != null & priv != null & priv.get("add")) {
             Item extitemname = dao.getByName(itm.getItemname());
             Item extitemcode = dao.getByItemCode(itm.getItemcode());
             if(extitemcode != null){
                 return "Error !! Item code already exists";
             }
            if(extitemname != null){
                return "Error !! : Item Name Already Exist";
            }
            try {

                dao.save(itm);
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
    public String update(@RequestBody Item itm) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "ITEM");
        if (user != null & priv != null & priv.get("add")) {
            try {
                dao.save(itm);
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
    public String delete(@RequestBody Item itm) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "ITEM");
        if (user != null & priv != null & priv.get("add")) {
            try {
                itm.setItemstatus_id(ItemStatusDao.getById(2));
                dao.save(itm);
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
    public Page<Item> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "ITEM");
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
            return null;
        }
    }


}
