package com.OMEL.repository;

import com.OMEL.model.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface InvoiceRepository extends JpaRepository<Invoice, Integer> {

    @Query("select i from Invoice i where i.invoiceno like concat('%' , :searchtext , '%')or " +
            "i.customer_id.fname like concat('%' , :searchtext  ,'%')or "+
            "concat(i.customer_id.mobileno,'')like concat('%' , :searchtext  ,'%')or "+
            "i.cname like concat('%' , :searchtext  ,'%')or "+
            "concat(i.cmobile, '')  like concat('%' , :searchtext  ,'%')or "+
            "concat( i.netamount , '') like concat('%' , :searchtext  ,'%')or "+
            "i.employee_id.callingname like concat('%' , :searchtext  ,'%') or " +
            "i.invoicestatus_id.name like concat('%' , :searchtext , '%')")
    Page<Invoice> findAll(@Param("searchtext")String searchtext , Pageable of);


    @Query(value = "SELECT concat('BILL' ,SUBSTRING((YEAR(CURDATE())),3), lpad(substring(max(i.invoiceno) , 7) +1 , 5 , '0' )) from omelstore.invoice as i" , nativeQuery = true)
    String getNextINVOICEnumber();

    @Query("select new Invoice (i.id , i.invoiceno , i.customer_id , i.netamount) from Invoice i where i.customer_id=?1")
    Invoice getCustomer(Customer customer_id);

}
