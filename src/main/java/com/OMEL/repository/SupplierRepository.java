package com.OMEL.repository;

import com.OMEL.model.Customer;
import com.OMEL.model.Supplier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SupplierRepository extends JpaRepository<Supplier, Integer> {

    @Query("select s from Supplier s where s.companyfullname like concat('%' , :searchtext , '%')or " +
            "s.regno like concat('%' , :searchtext  ,'%')or "+
            "s.email like concat('%' , :searchtext  ,'%')or "+
            "s.addeddate like concat('%' , :searchtext  ,'%')or "+
            "s.supplierstatus_id.name like concat('%' , :searchtext  ,'%')or "+
            "concat(s.landno,'') like concat('%' , :searchtext  ,'%') or " +
            "concat(s.creditlimit,'') like concat('%' , :searchtext  ,'%') or " +
            "s.address like concat('%' , :searchtext , '%')")
    Page<Supplier> findAll(@Param("searchtext")String searchtext , Pageable of);

    @Query(value = "SELECT concat('SUP' , lpad(substring(max(s.regno) , 4) +1 , 4 , '0' )) from omelstore.supplier as s" , nativeQuery = true)
    String getNextRegNo();

    @Query("select new Supplier(s.id , s.regno , s.companyfullname , s.areasamount , s.creditlimit  ) from Supplier s where s.supplierstatus_id.id= 1 or s.supplierstatus_id.id=2  order by s.addeddate desc ")
    List<Supplier>activeSup();

    @Query("select new Supplier(s.id , s.regno , s.companyfullname , s.areasamount , s.creditlimit  ) from Supplier s where s.supplierstatus_id.id= 1 or s.supplierstatus_id.id=2 ")
    Supplier getBySupplier();

    /*@Query(value = "SELECT * FROM omelstore.supplier where supplierstatus_id !=:status" , nativeQuery = true)
    List<Supplier> activeSup(@Param("status") Integer status);*/

  /*  @Query(value = "SELECT s from Supplier s where s.supplierstatus_id.id=:status")
    List<Supplier> activeSup(@Param("status") Integer status);*/

    /*get supplier mobile no when insrting */
    @Query("SELECT s FROM Supplier s WHERE s.cpmobile= :supmobile")
    Supplier findByMobile(@Param("supmobile") Integer supmobile);





}
