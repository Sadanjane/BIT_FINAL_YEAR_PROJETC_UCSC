package com.OMEL.repository;

import com.OMEL.model.QuatationRequset;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuatationRequestRepository extends JpaRepository<QuatationRequset, Integer> {

    @Query("select q from QuatationRequset q where q.qrno like concat('%' , :searchtext , '%')or " +
            "q.supplier_id.companyfullname like concat('%' , :searchtext  ,'%')or "+
            "q.quatationrequeststatus_id.name like concat('%' , :searchtext  ,'%')or "+
            "q.employee_id.callingname like concat('%' , :searchtext  ,'%')or "+
            "concat(q.requireddate,'') like concat('%' , :searchtext  ,'%') or " +
            "q.description like concat('%' , :searchtext , '%')")
    Page<QuatationRequset> findAll(@Param("searchtext")String searchtext , Pageable of);

/*quotation request list for when addign a quotation*/
    @Query("SELECT q from QuatationRequset q where q.supplier_id.id =:supplierid and q.quatationrequeststatus_id.id=1 order by q.requireddate asc")
    List<QuatationRequset> listBySupplier(@Param("supplierid") Integer supplierid);

/*autoo generated quotation request no*/
    @Query(value = "SELECT concat('QTR' , lpad(substring(max(qr.qrno) , 5) +1 , 5 , '0' )) from omelstore.quatationrequest as qr" , nativeQuery = true)
    String getNextReqNo();

}
