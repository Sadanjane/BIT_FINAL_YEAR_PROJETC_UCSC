package com.OMEL.controller;

import com.OMEL.model.*;
import com.OMEL.repository.*;
import com.OMEL.service.EmailService;
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
@RequestMapping(value = "/porder")
public class PurchaseOrderController {

    @Autowired
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private PurchaseOrderRepository dao;

    @Autowired
    private PurchaseOrderStatusRepository PodStatusDao;

    @Autowired
    private QuatationRepository quatationRepositoryDao;

    @Autowired
    private QuotationStatusRepository quotationStatusRepositoryDao;

    @Autowired
    private SupplierRepository supplierRepositoryDao;

    @Autowired
    private EmailService emailService;

    @GetMapping(value = "/list", produces = "application/json")
    public List<PurchaseOrder> purchaseOrderList(){
        return dao.findAll();
    }

    @GetMapping(value = "/nextpod", produces = "application/json")
    public PurchaseOrder nextNumber() {
        String nextNumber = dao.getNextNumber();
        PurchaseOrder nextPOrder = new PurchaseOrder(nextNumber);
        return nextPOrder;

    }

    @GetMapping(value = "/podBySupplier" ,params = {"supplierid"}, produces = "application/json")
    public List<PurchaseOrder> orders(@RequestParam("supplierid")int supplierid ){
        return dao.podBySupplier(supplierid);
    }

    // get mapping service for get All customers as page request [/customer/findAll?page=0&size=1]
    @GetMapping(value = "/findAll" , params = {"page" , "size"} , produces = "application/json")
    public Page<PurchaseOrder> findAll(@RequestParam("page") int page , @RequestParam("size") int size){
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PORDER");
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
          return null;
    }
}


    //post mapping service for inster all customers as page request
    @PostMapping
    public String insert(@RequestBody PurchaseOrder purchaseOrder) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PORDER");
        if(user != null & priv != null & priv.get("add")){
            try {
                /*System.out.println("purchaseorder" + purchaseOrder);
                System.out.println(purchaseOrder);*/
                StringBuffer message = new StringBuffer("No \t\t\t" + "Item Name \t\t\t\t" + "Quantity \n");
                int i = 1;
                for (POrderHasItem phi : purchaseOrder.getPorderHasItemList()){
                    phi.setPorder_id(purchaseOrder);

                    message.append(i).append("\t\t")
                            .append(phi.getItem_id().getItemname()).append("\t\t\t")
                            .append(phi.getQty()).append("\t\t\t")
                            .append("\n");

                    i++;
                }
                dao.save(purchaseOrder);

                Supplier supplier = supplierRepositoryDao.getById(purchaseOrder.getQuatation_id().getQuatationrequest_id().getSupplier_id().getId());

                emailService.sendMail(supplier.getEmail(),"Please Send Following Items","Porder Code : "+ purchaseOrder.getPordercode()+"\n Item details \n\n" + message +
                        "Thank you \n\n\n OMEL Lanka Supermarket" );

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
    public String update(@RequestBody PurchaseOrder purchaseOrder) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PORDER");
        if(user != null & priv != null & priv.get("update")){
            try {

                for (POrderHasItem shi : purchaseOrder.getPorderHasItemList()){
                    shi.setPorder_id(purchaseOrder);
                }


                dao.save(purchaseOrder);
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
    public String delete(@RequestBody PurchaseOrder porder) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PORDER");
        if (user != null & priv != null & priv.get("delete")) {
            try {
                porder.setPorderstatus_id(PodStatusDao.getById(3));

                for (POrderHasItem pod : porder.getPorderHasItemList())
                    pod.setPorder_id(porder);

                dao.save(porder);
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
    public Page<PurchaseOrder> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "PORDER");
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
            return null;
        }
    }
}
