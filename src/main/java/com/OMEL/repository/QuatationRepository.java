package com.OMEL.repository;

import com.OMEL.model.Quatation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface QuatationRepository extends JpaRepository<Quatation, Integer> {

    @Query("select q from Quatation q where q.quatationcode like concat('%' , :searchtext , '%')or " +
            "q.supplierqno like concat('%' , :searchtext  ,'%')or "+
            "q.employee_id.callingname like concat('%' , :searchtext  ,'%')or "+
            "q.quatationstatus_id.name like concat('%' , :searchtext  ,'%')or "+
            "concat(q.receiveddate,'') like concat('%' , :searchtext  ,'%') or " +
            "concat(q.validfrom,'') like concat('%' , :searchtext  ,'%') or " +
            "concat(q.validto,'') like concat('%' , :searchtext  ,'%') or " +
            "concat(q.addeddate,'') like concat('%' , :searchtext  ,'%') or " +
            "q.quatationrequest_id.supplier_id.companyfullname like concat('%' , :searchtext , '%')")
    Page<Quatation> findAll(@Param("searchtext")String searchtext , Pageable of);

    @Query("SELECT q from Quatation q where q.quatationrequest_id.supplier_id.id=:supplierid and (:currentdate between q.validfrom and q.validto)  order by (q.receiveddate)asc ")
    List<Quatation> listBySupplier(@Param("supplierid") Integer supplierid , @Param("currentdate") LocalDate currentdate);

    @Query(value = "SELECT concat('QT' ,SUBSTRING((YEAR(CURDATE())),3), lpad(substring(max(qt.quatationcode) , 7) +1 , 5 , '0' )) from omelstore.quatation as qt" , nativeQuery = true)
    String getNextQTnumber();

}
