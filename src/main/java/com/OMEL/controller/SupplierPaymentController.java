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
@RequestMapping(value = "/supplierpayment")
public class SupplierPaymentController {

    @Autowired
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private SupplierPaymentRepository dao;

    @Autowired
    private SupplierRepository supdao;

    @Autowired
    private GRNRepository grndao;

    @Autowired
    private GRNStatusRepository grnstatusdao;

    @Autowired
    private PurchaseOrderRepository porderdao;

    @Autowired
    private PurchaseOrderStatusRepository porderstatusdao;

    @Autowired
    private SupplierPaymentStatusRepository spstatusDao;

    @GetMapping(value = "/list", produces = "application/json")
    public List<SupplierPayment> list() {
        return dao.findAll();
    }

    @GetMapping(value = "/nextbill"  , produces = "application/json")
    public SupplierPayment nextNumber(){
        String billno = dao.getNextBILLnumber();
        SupplierPayment nextBill = new SupplierPayment(billno);
        return nextBill;
    }

    // get mapping service for get All customers as page request [/customer/findAll?page=0&size=1]
    @GetMapping(value = "/findAll", params = {"page", "size"}, produces = "application/json")
    public Page<SupplierPayment> findAll(@RequestParam("page") int page, @RequestParam("size") int size) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SPAYMENT");
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
            return null;
        }
    }

    //post mapping service for inster all customers as page request
    @PostMapping
    public String insert(@RequestBody SupplierPayment supplierPayment) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SPAYMENT");
        if (user != null & priv != null & priv.get("add")) {
            try {
                System.out.println(supplierPayment);
                if (supplierPayment.getGrn_id() != null) { /*checking whehere is there any grn selected or not*/

                    /*if grn is available load grn object*/
                    GRN grn = grndao.getById(supplierPayment.getGrn_id().getId());
                    /*load purchaseorder object*/


                    /*set grn status pending to complete*/
                    grn.setGrnstatus_id(grnstatusdao.getById(2));
                    for (GRNHasBatch ghi : grn.getGrnHasBatchList()) ghi.setGrn_id(grn);
                    grndao.save(grn);/* save grn*/

                }

                /*set porder status to paid frompending payment*/
                if(supplierPayment.getGrn_id().getPorder_id() != null){
                    PurchaseOrder purchaseOrder = porderdao.getById(supplierPayment.getGrn_id().getPorder_id().getId());
                    purchaseOrder.setPorderstatus_id(porderstatusdao.getById(5));
                    for(POrderHasItem phi : purchaseOrder.getPorderHasItemList())
                        phi.setPorder_id(purchaseOrder);
                    porderdao.save(purchaseOrder);
                }


                //if sa supplier is exist get supplier object and set supplier areus amount using supplier payment balane amount
                if(supplierPayment.getSupplier_id() != null){
                    Supplier supplier = supdao.getById(supplierPayment.getSupplier_id().getId());

                    supplier.setAreasamount(supplierPayment.getBalanceamount());
                    for(SupplierHasItem shi : supplier.getSupplierHasItemList())
                        shi.setSupplier_id(supplier);
                    supdao.save(supplier);

                }

                dao.save(supplierPayment);


                return "0";
            } catch (Exception ex) {
                return "Error Inserting" + ex.getMessage();
            }
        } else {
            return "Error deleting !! You have no Privillage";
        }
    }

    //GET REQUEST MAPPING FOR GET ITEM PAGE REQUEST GIVEN PARAMS WITH SEARCH VALUE
    @GetMapping(value = "/findAll", params = {"page", "size", "searchtext"}, produces = "application/json")
    public Page<SupplierPayment> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "SPAYMENT");
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext, PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
            return null;
        }
    }


}
