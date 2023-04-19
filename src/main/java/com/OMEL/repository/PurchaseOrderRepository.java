package com.OMEL.repository;

import com.OMEL.model.PurchaseOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Integer> {

    @Query("select p from PurchaseOrder p where " +
            "p.pordercode like concat('%' , :searchtext , '%')or " +
            "p.quatation_id.quatationcode like concat('%' , :searchtext , '%')or " +
            "p.employee_id.callingname like concat('%' , :searchtext , '%')or " +
            "concat(p.requireddate,'') like concat('%' , :searchtext  ,'%') or " +
            "concat(p.addeddate,'') like concat('%' , :searchtext  ,'%') or " +
            "p.quatation_id.quatationrequest_id.supplier_id.companyfullname like concat('%' , :searchtext , '%')")
    Page<PurchaseOrder> findAll(@Param("searchtext")String searchtext , Pageable of);

    @Query(value = "SELECT concat('POD' ,SUBSTRING((YEAR(CURDATE())),3), lpad(substring(max(p.pordercode) , 6) +1 , 5 , '0' )) from omelstore.porder as p" , nativeQuery = true)
    String getNextNumber();

    @Query("SELECT p from PurchaseOrder p where p.quatation_id.quatationrequest_id.supplier_id.id=:supplierid and p.porderstatus_id.id=1")
    List<PurchaseOrder> podBySupplier(@Param("supplierid") Integer supplierid);

}
