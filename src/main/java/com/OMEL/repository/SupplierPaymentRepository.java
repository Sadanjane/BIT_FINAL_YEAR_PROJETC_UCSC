package com.OMEL.repository;

import com.OMEL.model.SupplierPayment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SupplierPaymentRepository extends JpaRepository<SupplierPayment, Integer> {

    @Query("select s from SupplierPayment s where s.supplier_id.companyfullname like concat('%' , :searchtext , '%')or " +
            "s.billno like concat('%' , :searchtext  ,'%')or "+
            "s.grn_id.grncode like concat('%' , :searchtext  ,'%')or "+
            "s.paymentmethod_id.name like concat('%' , :searchtext  ,'%')or "+
            "concat(s.paidamount,'') like concat('%' , :searchtext  ,'%') or " +
            "concat(s.balanceamount,'') like concat('%' , :searchtext  ,'%') or " +
            "s.supplierpaymentstatus_id.name like concat('%' , :searchtext , '%')")
    Page<SupplierPayment> findAll(@Param("searchtext")String searchtext , Pageable of);

     @Query(value = "SELECT concat('BILL' , lpad(substring(max(sp.billno) , 5) +1 , 5 , '0' )) from omelstore.supplierpayment as sp" , nativeQuery = true)
     String getNextBILLnumber();
     /*

     @Query("SELECT sr from SupplierReturn sr where sr.supplier_id.id=:supplierid")
     List<SupplierReturn> supRetBySupplier(@Param("supplierid") Integer supplierid);*/

}
