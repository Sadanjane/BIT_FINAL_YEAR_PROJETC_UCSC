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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/grn")
public class GRNController {

    @Autowired
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private GRNRepository dao;

    @Autowired
    private BatchRepository batchdao;

    @Autowired
    private BatchStatusRepository batchStatusdao;

    @Autowired
    private GRNStatusRepository grnStatusRepositoryDao;

    @Autowired
    private GRNTypeRepository grnTypeRepositoryDao;

    @Autowired
    private SupplierReturnRepository supplierReturnRepositoryDao;

    @Autowired
    private SupplierReturnStatusRepository supplierReturnStatusRepositoryDao;

    @Autowired
    private PurchaseOrderRepository porderRepositoryDao;

    @Autowired
    private PurchaseOrderStatusRepository purchaseOrderStatusRepositoryDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<GRN> grnList(){
        return dao.findAll();
    }

    @GetMapping(value = "/grnfilltered",params = {"supplierid"}, produces = "application/json")
    public List<GRN> list(@RequestParam("supplierid") int supplierid){
        return dao.grnFilltered(supplierid);
    }

    @GetMapping(value = "/nextnumber"  , produces = "application/json")
    public GRN nextNumber(){
        String nextNumber = dao.getNextRegNo();
        GRN nextGrn = new GRN(nextNumber);
        return nextGrn;
    }

   // get mapping service for get All customers as page request [/customer/findAll?page=0&size=1]
    @GetMapping(value = "/findAll" , params = {"page" , "size"} , produces = "application/json")
    public Page<GRN> findAll(@RequestParam("page") int page , @RequestParam("size") int size){
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "GRN");
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
          return null;
    }
}

    //post mapping service for inster all customers as page request
    @PostMapping
    public String insert(@RequestBody GRN grn) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "GRN");
        if(user != null & priv != null & priv.get("add")){
            try {

                grn.setGrnstatus_id(grnStatusRepositoryDao.getById(5)); //set grn status to pending payment

                System.out.println(grn);
                for (GRNHasBatch ghi : grn.getGrnHasBatchList()){
                    ghi.setGrn_id(grn);

                    Batch receivedbatch = batchdao.getBySupplierItemBatchno(grn.getSupplier_id().getId(),ghi.getBatch_id().getItem_id().getId(),ghi.getBatch_id().getBatchnumber());
                    if(receivedbatch != null){
                        receivedbatch.setAvailableqty(receivedbatch.getAvailableqty().add(ghi.getTotalqty()));
                        receivedbatch.setTotalqty(receivedbatch.getTotalqty().add(ghi.getTotalqty()));

                        Batch savedRecBatch =  batchdao.save(receivedbatch);

                        ghi.setBatch_id(savedRecBatch);

                    }else {
                        Batch newbatch = new Batch();
                        newbatch.setBatchnumber(ghi.getBatch_id().getBatchnumber());
                        newbatch.setItem_id(ghi.getBatch_id().getItem_id());
                        newbatch.setSupplier_id(grn.getSupplier_id());
                        newbatch.setBatchstatus_id(batchStatusdao.getById(1));

                        newbatch.setSaleprice(ghi.getBatch_id().getSaleprice());
                        newbatch.setPurchaseprice(ghi.getBatch_id().getPurchaseprice());
                        newbatch.setExpiredate(ghi.getBatch_id().getExpiredate());
                        newbatch.setManufacdate(ghi.getBatch_id().getManufacdate());

                        newbatch.setDiscountratio(BigDecimal.valueOf(0));
                        newbatch.setAvailableqty(ghi.getTotalqty());
                        newbatch.setTotalqty(ghi.getTotalqty());
                        newbatch.setReturnqty(BigDecimal.valueOf(0));

                        Batch savedNewBatch =  batchdao.save(newbatch);

                        ghi.setBatch_id(savedNewBatch);
                    }

                    /*change supplier return status to requested if user returned items*/
                    if(grn.getSupplierreturn_id() != null){
                        SupplierReturn receivedReturn = supplierReturnRepositoryDao.getById(grn.getSupplierreturn_id().getId());
                        receivedReturn.setReturnstatus_id(supplierReturnStatusRepositoryDao.getById(2));

                        SupplierReturn saveSupplierReturn = supplierReturnRepositoryDao.save(receivedReturn);
                        grn.setSupplierreturn_id(saveSupplierReturn);

                    }

                    //when user add a grn and if a porder exists porder status must chnage as completed
                    if(grn.getPorder_id() != null){
                        PurchaseOrder receivedPorder = porderRepositoryDao.getById(grn.getPorder_id().getId());
                        receivedPorder.setPorderstatus_id(purchaseOrderStatusRepositoryDao.getById(5));

                        PurchaseOrder savePorder = porderRepositoryDao.save(receivedPorder);
                        grn.setPorder_id(savePorder);
                    }

                }

                dao.save(grn);
                return "0";
            } catch (Exception ex) {
                return "Error Inserting" + ex.getMessage();
            }
        }else{
            return "Error deleting !! You have no Privillage";
        }
    }

    //FOR DELETE OPTION
    @Transactional
    @DeleteMapping
    public String delete(@RequestBody GRN grn) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "GRN");
        if (user != null & priv != null & priv.get("delete")) {
            try {
                grn.setGrnstatus_id(grnStatusRepositoryDao.getById(2));

                for (GRNHasBatch shi : grn.getGrnHasBatchList())
                    shi.setGrn_id(grn);

                dao.save(grn);
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
    public Page<GRN> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "GRN");
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
            return null;
        }
    }


}
