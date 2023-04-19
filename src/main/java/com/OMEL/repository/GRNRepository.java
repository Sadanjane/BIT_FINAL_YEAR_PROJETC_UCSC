package com.OMEL.repository;

import com.OMEL.model.GRN;
import com.OMEL.model.Invoice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface GRNRepository extends JpaRepository<GRN, Integer> {

    @Query("select g from GRN g where g.grncode like concat('%' , :searchtext , '%')or " +
            "g.grntype_id.name like concat('%' , :searchtext  ,'%')or "+
            "g.supplier_id.companyfullname like concat('%' , :searchtext  ,'%')or "+
            "g.porder_id.pordercode like concat('%' , :searchtext  ,'%')or "+
            "concat(g.receiveddate , '')  like concat('%' , :searchtext  ,'%')or "+
            "concat(g.addeddate , '')  like concat('%' , :searchtext  ,'%')or "+
            "g.grnstatus_id.name like concat('%' , :searchtext , '%')")
    Page<GRN> findAll(@Param("searchtext")String searchtext , Pageable of);


    /*auto generate grn code*/
    @Query(value = "SELECT concat('GRN' , lpad(substring(max(g.grncode) , 4) +1 , 6 , '0' )) from omelstore.grn as g" , nativeQuery = true)
    String getNextRegNo();

    @Query("SELECT new GRN (g.id , g.grncode , g.grossamount) from GRN g where g.supplier_id.id=:supplierid and g.grnstatus_id.id = 5")
    List<GRN>grnFilltered(@Param("supplierid") Integer supplierid);


    @Query("SELECT new GRN (g.id , g.grncode) from GRN g where g.grncode=:grncode")
    GRN getByGRNCode(@Param("grncode") String grncode);
}
