package com.OMEL.controller;

import com.OMEL.model.RoyaltyPoint;
import com.OMEL.repository.RoyaltyCardRepository;
import com.OMEL.repository.RoyaltyPointRepository;
import com.OMEL.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping(value = "/royaltypoint")
public class RoyaltyPointController {

    @Autowired
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private RoyaltyPointRepository dao;

    @Autowired
    private RoyaltyCardRepository cardDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<RoyaltyPoint> royaltyPoints(){
        return dao.findAll();
    }

    @GetMapping(value = "/royalPointsBypoints" ,params = {"points"}, produces = "application/json")
    public RoyaltyPoint royaltyPoint(@RequestParam("points") BigDecimal points ){
        return dao.byPoints(points);
    }

  /* // get mapping service for get All customers as page request [/customer/findAll?page=0&size=1]
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
    }*/

}
