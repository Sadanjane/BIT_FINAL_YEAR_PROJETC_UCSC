package com.OMEL.repository;

import com.OMEL.model.SupplierReturn;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SupplierReturnRepository extends JpaRepository<SupplierReturn, Integer> {

    @Query("select s from SupplierReturn s where s.supplier_id.companyfullname like concat('%' , :searchtext , '%')or " +
            "s.description like concat('%' , :searchtext  ,'%')or "+
            "s.employee_id.callingname like concat('%' , :searchtext  ,'%')or "+
            "concat(s.totalamount,'') like concat('%' , :searchtext  ,'%') or " +
            "concat(s.addeddate,'') like concat('%' , :searchtext  ,'%') or " +
            "s.returnstatus_id.name like concat('%' , :searchtext , '%')")
    Page<SupplierReturn> findAll(@Param("searchtext")String searchtext , Pageable of);

     @Query(value = "SELECT concat('SRET' , lpad(substring(max(s.supreturncode) , 5) +1 , 5 , '0' )) from omelstore.supplierreturn as s" , nativeQuery = true)
     String getNextSupRetCode();

     @Query("SELECT sr from SupplierReturn sr where sr.supplier_id.id=:supplierid")
     List<SupplierReturn> supRetBySupplier(@Param("supplierid") Integer supplierid);

}
