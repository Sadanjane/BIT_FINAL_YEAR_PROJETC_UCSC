package com.OMEL.controller;

import com.OMEL.model.*;
import com.OMEL.repository.*;
import com.OMEL.service.SMSService;
import com.OMEL.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping(value = "/invoice")
public class InvoiceController {

    @Autowired
    private UserService userService;

    @Autowired
    private PrevilageController previlageController;

    @Autowired
    private InvoiceRepository dao;

    @Autowired
    private BatchRepository batchdao;

    @Autowired
    private CustomerRepository cusdao;

    @Autowired
    private RoyaltyPointRepository royaldao;

    @Autowired
    private InvoiceStatusRepository invoiceStatusRepositoryDao;

    @Autowired
    private InvoicePaymentMethodRepository paymentMethodRepository;

    /*@Autowired
    private SMSService smsservice;*/

    @GetMapping(value = "/list", produces = "application/json")
    public List<Invoice> invoiceList(){
        return dao.findAll();
    }

/*    @GetMapping(value = "/grnfilltered",params = {"supplierid"}, produces = "application/json")
    public List<GRN> list(@RequestParam("supplierid") int supplierid){
        return dao.grnFilltered(supplierid);
    }
    */


    @GetMapping(value = "/nextnumber"  , produces = "application/json")
    public Invoice nextNumber(){
        String nextNumber = dao.getNextINVOICEnumber();
        Invoice nextInvoice = new Invoice(nextNumber);
        return nextInvoice;
    }

   // get mapping service for get All customers as page request [/customer/findAll?page=0&size=1]
    @GetMapping(value = "/findAll" , params = {"page" , "size"} , produces = "application/json")
    public Page<Invoice> findAll(@RequestParam("page") int page , @RequestParam("size") int size){
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "INVOICE");
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
          return null;
    }
}

    //post mapping service for inster all customers as page request
    @PostMapping
    public String insert(@RequestBody Invoice invoice) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "INVOICE");
        if(user != null & priv != null & priv.get("add")){


            System.out.println(invoice);
            try {
                for (InvoiceHasItem shi : invoice.getInvoiceHasItemList()){
                    shi.setInvoice_id(invoice);
                }

                dao.save(invoice);


                for (InvoiceHasItem shi : invoice.getInvoiceHasItemList()){
                    Batch receivedbatch = batchdao.getByItemBatchno(shi.getBatch_id().getItem_id().getId(), shi.getBatch_id().getBatchnumber());
                    receivedbatch.setAvailableqty(receivedbatch.getAvailableqty().subtract(shi.getQty()));
                    batchdao.save(receivedbatch);
                }

                /*For Update Customer points according to the royalty point table*/
                if(invoice.getCustomer_id() != null){

                    Customer customer = cusdao.getById(invoice.getCustomer_id().getId()); //get customer data according to the avaible customer id
                    RoyaltyPoint pointinfo = royaldao.byPoints(customer.getPoints()); //get Royalty points according to the customer old points
                    customer.setPoints(customer.getPoints().add(invoice.getNetamount().multiply(pointinfo.getAddedpoint().divide(BigDecimal.valueOf(100.00))))); //update the csutomer royalty points

                    cusdao.save(customer);

                    /*String message = "Your Invoice Amount is : "+ invoice.getNetamount()+ ". Your New Point Value is : "
                            + customer.getPoints() + "\nThank you\n OMEL Lanka Super Market";
                    String tonumber = "+94" + customer.getMobileno();
                    SMS sms = new SMS("+94774908320",message);
                    smsservice.send(sms);*/

                }

                return "0";
            } catch (Exception ex) {
                return "Error Inserting" + ex.getMessage();
            }
        }else{
            return "Error deleting !! You have no Privillage";
        }
    }


   //FOR DELETE OPTION
    @DeleteMapping
    public String delete(@RequestBody Invoice invoice) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "INVOICE");
        if (user != null & priv != null & priv.get("delete")) {
            try {
                invoice.setInvoicestatus_id(invoiceStatusRepositoryDao.getById(2));

                for (InvoiceHasItem ihi : invoice.getInvoiceHasItemList())
                    ihi.setInvoice_id(invoice);

                dao.save(invoice);
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
    public Page<Invoice> findAll(@RequestParam("page") int page, @RequestParam("size") int size, @RequestParam("searchtext") String searchtext) {
        //Get securityh authencication object
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        //get user from db
        User user = userService.findUserByUserName(auth.getName());
        //GETUSER MODULE PRIVILLAGE
        HashMap<String, Boolean> priv = previlageController.getPrivilages(user, "INVOICE");
        if (user != null & priv != null & priv.get("select")) {
            return dao.findAll(searchtext,PageRequest.of(page, size, Sort.Direction.DESC, "id"));
        } else {
            return null;
        }
    }


}
